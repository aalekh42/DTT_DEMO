const { parse } = require("csv-parse");
const fs = require('fs');
const path = require("path");
const { winstonLogger } = require("../errorLogger/winstonLogger");
const { Daily, Mpan, OptiMap } = require("../models/schema");
const { singleConvObj, getDays, getValInd, deleteFolder, isValidDate, isValidMpan, deleteFile } = require("./genric");

exports.readUpFile = async(res,next,docUser) => {

  let tempMp = new Map();
  let resultArrObj = [];
  //---for optimap---
  let optiMap = new Map();
  
  let hhObj = [];
  let i=1;
  //---processing single file for now
  let dir = path.join(__basedir,'uploads',docUser+'.csv');

  // let dir = path.join(__basedir,'uploads',docUser);
  // let fileItem = fs.readdirSync(dir);

  let rsErr = new Error();
  // let errCount = 0;

  // let rs = fs.createReadStream(path.join(dir,fileItem[0]))
  let rs = fs.createReadStream(dir);
    rs.on('error', err => {
      next(err);
    })
    rs.pipe(parse({delimiter: [';',','], from_line: 2}))
    .on('data', data => {
      let len = data.length;
      if(len != 3 && len != 4) {
        rsErr.message = 'Invalid column size';
        rs.destroy();
        return;
      }

      if(!isValidMpan(data[len-3]) || !isValidDate(data[len-2])) {
        // errCount = errCount + 1;
        rsErr.message = `Invalid Mpans or Date time at Column position ${i+1}`;
        rs.destroy();
        return;
      }

      // if(errCount>30) {
      //   rsErr.message = 'Invalid Mpans or Date time found in multiple rows';
      //   rs.destroy();
      //   return;
      // }

      let {simpleHH, transformedHH, extra} = singleConvObj(data,docUser);
      let {curveCode, newPeakCond, newDuosCond, weekday, month, year} = extra;

      resultArrObj.push(transformedHH);
      hhObj.push(simpleHH);

      if (curveCode && !tempMp.has(curveCode)) {
        tempMp.set(curveCode, true);
      }

      //--------------OPTI MAP CODE-------------
      if (curveCode && !optiMap.has(curveCode)) {
        let yearly = new Map();
        let monthly = new Map();

        let fiveVals = getValInd(i,newPeakCond,newDuosCond,weekday);

        monthly.set(month, fiveVals);
        yearly.set(year, monthly);
        optiMap.set(curveCode, yearly);
      } else if(optiMap.has(curveCode)) {
        if(!optiMap.get(curveCode).has(year)) {
          let monthly = new Map();

          let fiveVals = getValInd(i,newPeakCond,newDuosCond,weekday);

          monthly.set(month, fiveVals);

          let tempYr = optiMap.get(curveCode);
          tempYr.set(year,monthly);
          optiMap.set(curveCode, tempYr);
        } else if(optiMap.get(curveCode).has(year)) {
          if(!optiMap.get(curveCode).get(year).has(month)) {
            let fiveVals = getValInd(i,newPeakCond,newDuosCond,weekday);

            let tempMonth = optiMap.get(curveCode).get(year);
            tempMonth.set(month,fiveVals);
            optiMap.get(curveCode).set(year, tempMonth);
          } else if(optiMap.get(curveCode).get(year).has(month)){
            let oldFiveVals = optiMap.get(curveCode).get(year).get(month);
          
            if(newPeakCond && weekday) {
              oldFiveVals.pvi.push(i);
              if(newDuosCond) {
                oldFiveVals.dvi.push(i);
              }
            } else {
              if(!weekday) {
                oldFiveVals.wvi.push(i);
              }
          
              if(!newPeakCond || !weekday) {
                oldFiveVals.opvi.push(i);
              }
            }
            // oldFiveVals.tvi.push(i);
            optiMap.get(curveCode).get(year).set(month,oldFiveVals);
          }
        }
      }
      i++;
      //-----!---------OPTI MAP CODE-------!------

    })
    rs.on('end', async() => {
      winstonLogger.info(`Done parsing - (${docUser})`)
      
      let mpansArr = [];
      // iterating through Map of unique mpans & storing them in an array of objects
      for (var [key, value] of tempMp.entries()) {
        mpansArr.push({name: key, isChecked: true, du:docUser});
      }

      // Creating optiArr for storing in database
      let optiArr = [];
      for(var [key, v] of optiMap.entries()) {
        let cc = key;
        for(var [k1,v1] of v.entries()) {
          let y = k1;
          for(var [k2,v2] of v1.entries()) {
            optiArr.push({
              du: docUser,
              cc: cc,
              y: y,
              m: k2,
              // tvi: v2.tvi,
              pvi: v2.pvi,
              dvi: v2.dvi,
              opvi: v2.opvi,
              wvi: v2.wvi,
            })
          }
        }
      }

      //Pushing all data to respective collections
      await OptiMap.insertMany(optiArr);
      winstonLogger.info(`OptiMap inserted to Collection - (${docUser})`);
      await Mpan.insertMany(mpansArr);
      winstonLogger.info(`Mpans inserted to Collection - (${docUser})`);
      const perDayData = resultArrObj.reduce(getDays, []);
      winstonLogger.info(`Reduced to days - (${docUser})`);
      await Daily.insertMany(perDayData);
      winstonLogger.info(`Daily data inserted to Collection - (${docUser})`);
      // deleteFolder(docUser);
      deleteFile(docUser);
      res.status(200).json({status:'success',msg:"Data posted successfully",hhObj:hhObj});
    })
    rs.on("close", (err) => {
      if(rsErr.message) {
        // deleteFolder(docUser);
        deleteFile(docUser);
        rsErr.status = 400;
        next(rsErr,null,res,next);
      }
    })

}