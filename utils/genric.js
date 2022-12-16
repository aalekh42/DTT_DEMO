const moment = require('moment');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { winstonLogger } = require('../errorLogger/winstonLogger');
const { errorHandler } = require('../errorLogger/errorLogger');

const getWeekNum = (d) => {
  let dated = new Date(d);
  let weekOfMonth = (0 | dated.getDate() / 7)+1;
  return weekOfMonth;
}

// const converter = (resultArr) => {
//   let obj = [];
//   let tempMp = new Map();
//   let mpansArr = [];
//   let n = resultArr.length;   
  
//   let j=0;
//   if(resultArr[1].length == 3) j=1;   //for files with 3 columns
//   if(resultArr[n-1][2-j] === undefined) n = n-1;    // skipping last row if null

//   for(let i=1;i<n;i++) {

//     // let val = resultArr[i][3-j];
//     let value = isNaN(val) ? 0 : parseFloat(val);
//     let FromDateTime = resultArr[i][2-j];

//     //-------moment conversion dump------------
//     let date = moment(FromDateTime).format("YYYY-MM-DD");
//     let month = moment(FromDateTime).format("MMM");
//     let year = moment(FromDateTime).format("YYYY");
//     // let value = parseFloat(val);
//     let day = moment(date).format("ddd");
//     let time = moment(FromDateTime, moment.defaultFormat).format("YYYY-MM-DD HH:mm");
//     var d = moment(`${time}`);
//     var peakStart = moment(`${date} 07:00`);
//     var peakEnd = moment(`${date} 19:00`);
  
//     var duosStart = moment(`${date} 16:00`);
//     var duosEnd = moment(`${date} 19:00`);
  
//     var peakCondition1 = 0 <= d.diff(peakStart, "hours") && d.diff(peakStart, "hours") <= 12; //should be true (only true if result is between 0-12)
//     var peakCondition2 = 0 <= peakEnd.diff(d, "hours") && peakEnd.diff(d, "hours") <= 12;
//     var weekday = moment(date).isoWeekday() <= 5;
//     var peakVol = peakCondition1 && peakCondition2 && weekday ? value : 0;
  
//     var duosCondition1 = 0 <= d.diff(duosStart, "hours") && d.diff(duosStart, "hours") <= 3; //should be true (only true if result is between 0-3)
//     var duosCondition2 = 0 <= duosEnd.diff(d, "hours") && duosEnd.diff(d, "hours") <= 3;
//     var duosVol = duosCondition1 && duosCondition2 && weekday ? value : 0;
//     var weekendVol = !weekday ? value : 0;
//     var offPeak = !peakCondition1 && !peakCondition2 && weekday ? value : 0;
//     var offPeakVol = weekendVol + offPeak;
//     let daysInMonth = moment(date).daysInMonth();
//     let weekNo = getWeekNum(date);
//     //---!---moment conversion dump----!-------

//     // storing unique mpans in a Map
//     if (resultArr[i][1-j] && !tempMp.has(resultArr[i][1-j])) {
//       tempMp.set(resultArr[i][1-j], true);
//     }

//     obj.push({
//       cc: resultArr[i][1-j],
//       // fdt: FromDateTime,
//       day: day,
//       date: moment(FromDateTime).format("DD-MM-YYYY"),
//       m: month,
//       y: year,
//       tv: value,
//       pv: peakVol,
//       dv: duosVol,
//       wv: weekendVol,
//       opv: offPeakVol,
//       // dim: daysInMonth,
//       // my: `${month} ${year}`,
//       wn: weekNo,
//       // dd: day + moment(date).format("DD-MM-YYYY"),
//     });
//   }

//   // iterating through Map of unique mpans & storing them in an array of objects
//   for (var [key, value] of tempMp.entries()) {
//     mpansArr.push({name: key, isChecked: true});
//   }
  
//   console.log('------Processing done Arr -> Obj---------');
//   return {obj,mpansArr};
// }

/* converter version 2 */
// const converter2 = (resultArr) => {
//   let obj = [];
//   let tempMp = new Map();
//   let mpansArr = [];
//   let n = resultArr.length;
//   //----2.0-------   
//   let optiMap = new Map();
//   let hhObj = [];

  
//   let j=0;
//   if(resultArr[1].length == 3) j=1;   //for files with 3 columns
//   if(resultArr[n-1][2-j] === undefined) n = n-1;    // skipping last row if null

//   for(let i=1;i<n;i++) {

//     let val = resultArr[i][3-j];
//     let value = isNaN(val) ? 0 : parseFloat(val);
//     let FromDateTime = resultArr[i][2-j];

//     //-------moment conversion dump------------
//     let date = moment(FromDateTime).format("YYYY-MM-DD");
//     let month = moment(FromDateTime).format("MMM");
//     let year = moment(FromDateTime).format("YYYY");
//     // let value = parseFloat(val);
//     let day = moment(date).format("ddd");
//     let time = moment(FromDateTime, moment.defaultFormat).format("YYYY-MM-DD HH:mm");
//     var d = moment(`${time}`);
//     var peakStart = moment(`${date} 07:00`);
//     var peakEnd = moment(`${date} 19:00`);
  
//     var duosStart = moment(`${date} 16:00`);
//     var duosEnd = moment(`${date} 19:00`);
  
//     var peakCondition1 = 0 <= d.diff(peakStart, "hours") && d.diff(peakStart, "hours") <= 12; //should be true (only true if result is between 0-12)
//     var peakCondition2 = 0 <= peakEnd.diff(d, "hours") && peakEnd.diff(d, "hours") <= 12;
//     var weekday = moment(date).isoWeekday() <= 5;
//     var peakVol = peakCondition1 && peakCondition2 && weekday ? value : 0;
  
//     var newPeakCond = d.diff(peakStart, "minutes") >=0 && d.diff(peakEnd, "minutes") <= 0;
//     var newDuosCond = d.diff(duosStart, "minutes") >=0 && d.diff(duosEnd, "minutes") <= 0;


//     var duosCondition1 = 0 <= d.diff(duosStart, "hours") && d.diff(duosStart, "hours") <= 3; //should be true (only true if result is between 0-3)
//     var duosCondition2 = 0 <= duosEnd.diff(d, "hours") && duosEnd.diff(d, "hours") <= 3;
//     var duosVol = duosCondition1 && duosCondition2 && weekday ? value : 0;
//     var weekendVol = !weekday ? value : 0;
//     var offPeak = !peakCondition1 && !peakCondition2 && weekday ? value : 0;
//     var offPeakVol = weekendVol + offPeak;
//     let daysInMonth = moment(date).daysInMonth();
//     let weekNo = getWeekNum(date);
//     //---!---moment conversion dump----!-------

//     // storing unique mpans in a Map
//     if (resultArr[i][1-j] && !tempMp.has(resultArr[i][1-j])) {
//       tempMp.set(resultArr[i][1-j], true);
//     }

//     //--------------OPTI MAP CODE-------------

//     if (resultArr[i][1-j] && !optiMap.has(resultArr[i][1-j])) {
//       let yearly = new Map();
//       let monthly = new Map();

//       let fiveVals = getValInd(i,newPeakCond,newDuosCond,weekday);

//       monthly.set(month, fiveVals);
//       yearly.set(year, monthly);
//       optiMap.set(resultArr[i][1-j], yearly);
//     } else if(optiMap.has(resultArr[i][1-j])) {
//       if(!optiMap.get(resultArr[i][1-j]).has(year)) {
//         let monthly = new Map();

//         let fiveVals = getValInd(i,newPeakCond,newDuosCond,weekday);
  
//         monthly.set(month, fiveVals);

//         let tempYr = optiMap.get(resultArr[i][1-j]);
//         tempYr.set(year,monthly);
//         optiMap.set(resultArr[i][1-j], tempYr);
//       } else if(optiMap.get(resultArr[i][1-j]).has(year)) {
//         if(!optiMap.get(resultArr[i][1-j]).get(year).has(month)) {
//           let fiveVals = getValInd(i,newPeakCond,newDuosCond,weekday);

//           let tempMonth = optiMap.get(resultArr[i][1-j]).get(year);
//           // console.log(tempMonth);
//           tempMonth.set(month,fiveVals);
//           optiMap.get(resultArr[i][1-j]).set(year, tempMonth);
//         } else if(optiMap.get(resultArr[i][1-j]).get(year).has(month)){
//           let oldFiveVals = optiMap.get(resultArr[i][1-j]).get(year).get(month);
        
//           if(newPeakCond && weekday) {
//             oldFiveVals.pvi.push(i);
//             if(newDuosCond) {
//               oldFiveVals.dvi.push(i);
//             }
//           } else {
//             if(!weekday) {
//               oldFiveVals.wvi.push(i);
//             }
        
//             if(!newPeakCond || !weekday) {
//               oldFiveVals.opvi.push(i);
//             }
//           }
//           oldFiveVals.tvi.push(i);
//           optiMap.get(resultArr[i][1-j]).get(year).set(month,oldFiveVals);
//         }
//       }
//     }

//     //-----!---------OPTI MAP CODE-------!------

//     //--------HH object creation---------
//     hhObj.push({
//       curveCode: resultArr[i][1-j],
//       FromDateTime: FromDateTime,
//       value: value
//     })

//     obj.push({
//       cc: resultArr[i][1-j],
//       // fdt: FromDateTime,
//       day: day,
//       date: moment(FromDateTime).format("DD-MM-YYYY"),
//       m: month,
//       y: year,
//       tv: value,
//       pv: peakVol,
//       dv: duosVol,
//       wv: weekendVol,
//       opv: offPeakVol,
//       // dim: daysInMonth,
//       // my: `${month} ${year}`,
//       wn: weekNo,
//       // dd: day + moment(date).format("DD-MM-YYYY"),
//     });
//   }

//   // Creating optiArr for storing in database
//   let optiArr = [];
//   for(var [key, v] of optiMap.entries()) {
//     optiArr.push({
//       curveCode: key,
//       data: v
//     })
//   }

//   // iterating through Map of unique mpans & storing them in an array of objects
//   for(var [key, value] of tempMp.entries()) {
//     mpansArr.push({name: key, isChecked: true});
//   }

//   return {obj,mpansArr,hhObj,optiArr};
// }

const singleConvObj = (data,docUser) => {

  let j=0;
  if(data.length == 4) j=1; 
  let val = data[2+j];
  let value = isNaN(val) ? 0 : parseFloat(val);
  let FromDateTime = data[1+j];
  let curveCode = data[0+j];

  //------moment conversion dump-----------
  let date = moment(FromDateTime).format("YYYY-MM-DD");
  let month = moment(FromDateTime).format("MMM");
  let year = moment(FromDateTime).format("YYYY");
  let day = moment(date).format("ddd");
  let time = moment(FromDateTime, moment.defaultFormat).format("YYYY-MM-DD HH:mm");
  var d = moment(`${time}`);
  var peakStart = moment(`${date} 07:00`);
  var peakEnd = moment(`${date} 19:00`);

  var duosStart = moment(`${date} 16:00`);
  var duosEnd = moment(`${date} 19:00`);

  var weekday = moment(date).isoWeekday() <= 5;
  var weekendVol = !weekday ? value : 0;

  /*-------New conditions & values------*/
  var newPeakCond = d.diff(peakStart, "minutes") >=0 && d.diff(peakEnd, "minutes") <= 0;
  var peakVol = newPeakCond && weekday ? value : 0;

  var newDuosCond = d.diff(duosStart, "minutes") >=0 && d.diff(duosEnd, "minutes") <= 0;
  var duosVol = newDuosCond && weekday ? value : 0;

  var offPeak = !newPeakCond && weekday ? value : 0;

  var offPeakVol = weekendVol + offPeak;
  let weekNo = getWeekNum(date);
  //---!---moment conversion dump----!-------

  let simpleHH = {
    curveCode: curveCode,
    FromDateTime: FromDateTime,
    value: value
  }

  let transformedHH = {
    cc: curveCode,
    day: day,
    date: moment(FromDateTime).format("DD-MM-YYYY"),
    m: month,
    y: year,
    my:month + year,
    tv: value,
    pv: peakVol,
    dv: duosVol,
    wv: weekendVol,
    opv: offPeakVol,
    wn: weekNo,
    du: docUser
  }

  let extra = {
    curveCode: curveCode,
    weekday: weekday,
    newPeakCond: newPeakCond,
    newDuosCond: newDuosCond,
    month: month,
    year: year,
  }

  return {
   simpleHH, 
   transformedHH,
   extra
  };
}

const getDays = (group, current) => {
  let i = group.findIndex(
    (single) => single.date === current.date && single.cc === current.cc
  );
  if (i === -1) {
    return [...group, current];
  }
  group[i].tv = (parseFloat(group[i].tv )+ parseFloat(current.tv)).toFixed(2);
  group[i].pv = (parseFloat(group[i].pv )+ parseFloat(current.pv)).toFixed(2);
  group[i].dv = (parseFloat(group[i].dv )+ parseFloat(current.dv)).toFixed(2);
  group[i].opv =(parseFloat(group[i].opv) + parseFloat(current.opv)).toFixed(2);
  group[i].wv = (parseFloat(group[i].wv ) + parseFloat(current.wv)).toFixed(2);
  return group;
};

const getMonths = (group, current) => {
  let i = group.findIndex(
    (single) => single.m === current.m && single.y === current.y
  );
  if (i === -1) {
    return [...group, current];
  }
  group[i].tv = (parseFloat(group[i].tv) + parseFloat(current.tv)).toFixed(2); //returns totalVolume
  group[i].pv = (parseFloat(group[i].pv) + parseFloat(current.pv)).toFixed(2); //returns peakVol
  group[i].dv = (parseFloat(group[i].dv) + parseFloat(current.dv)).toFixed(2); //returns duosVol
  group[i].wv = (parseFloat(group[i].wv) + parseFloat(current.wv)).toFixed(2); //returns weekendVol
  group[i].opv =(parseFloat(group[i].opv) + parseFloat(current.opv)).toFixed(2); //returns offPeakVol

  return group;
};

const getWeekly = (group, current) => {
  let i = group.findIndex(
    (single) =>
      single.m === current.m &&
      single.y === current.y &&
      single.wn === current.wn &&
      single.cc === current.cc
  );
  if (i === -1) {
    return [...group, current];
  }
  group[i].tv = (parseFloat(group[i].tv) + parseFloat(current.tv)).toFixed(2); //returns totalVolume
  group[i].pv = (parseFloat(group[i].pv) + parseFloat(current.pv)).toFixed(2); //returns peakVol
  group[i].dv = (parseFloat(group[i].dv) + parseFloat(current.dv)).toFixed(2); //returns duosVol
  group[i].wv = (parseFloat(group[i].wv) + parseFloat(current.wv)).toFixed(2); //returns weekendVol
  group[i].opv= (parseFloat(group[i].opv) + parseFloat(current.opv)).toFixed(2); //returns offPeakVol

  return group;
};

const getDaysInMonth = (mon,yr) => {
  const dim = {
    'Jan':31,
    'Feb':28,
    'Mar':31,
    'Apr':30,
    'May':31,
    'Jun':30,
    'Jul':31,
    'Aug':31,
    'Sep':30,
    'Oct':31,
    'Nov':30,
    'Dec':31,
  }
  if(mon==='Feb' && moment([yr]).isLeapYear()) return dim.Feb + 1;
  return dim[mon];
}

const monthlyViewData = (perDayData) => {
  let monthlyView = perDayData.reduce(getMonths, []);
  let peakKwh = monthlyView?.map((x) => x.pv);
  let maxKwh = Math.max(...peakKwh);
  for(let i=0;i<monthlyView.length;i++) {
    let dim = getDaysInMonth(monthlyView[i].m, monthlyView[i].y);
    let mBase = (parseFloat(monthlyView[i].tv) / dim).toFixed(2);
    let mMW = (parseFloat(monthlyView[i].tv) / 1000 / dim / 24).toFixed(2);
    monthlyView[i] = Object.assign(monthlyView[i], {mBase: mBase, mMW: mMW, maxKwh: maxKwh,tvp:0,opvp:0,pvp:0,dvp:0,wvp:0});
  }
  return monthlyView;
}

const checkAuthName = (req,res) => {
  try{
    var authheader = req.headers.authorization;
    
    if (!authheader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      throw err;
    }
    var auth;
    try{
      auth = new Buffer.from(authheader.split(' ')[1],'base64').toString().split(':');
    } catch(err) {
      err.status = 400;
      err.message += ' - Something wrong with Auth header';
      throw err;
    }
    return auth[0];
  } catch(error) {
    errorHandler(error);
  }
}

//---------Multer config-----------
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // let docUser = new Buffer.from(req.headers.authorization.split(' ')[1],'base64').toString().split(':')[0];
    // makeFolder(docUser);
    //Creating uploads folder
    let upload = path.join(__basedir,'uploads');
    if(!fs.existsSync(upload)) {
      fs.mkdirSync(upload);
    }
    // cb(null, `./uploads/${docUser}/`)
    cb(null, `./uploads/`)
  },
  filename: function (req, file, cb) {
    let docUser = new Buffer.from(req.headers.authorization.split(' ')[1],'base64').toString().split(':')[0];
    // cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    cb(null, docUser + path.extname(file.originalname)) //Appending extension
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req,file, cb) => {
    if (file.mimetype == "text/csv") {
      cb(null, true);
    } else {
      cb(null, false);
      let err = new Error('Only .csv format allowed!');
      err.status = 400;
      return cb(err);
    }
    winstonLogger.info("File stored locally")
  }
});
//-----!----Multer config-----!------

const getPerMult = (perVal) => {
  if(!perVal) return 1;
  let perMult;
  if(perVal < 0) {
    if(perVal <= -100) return 0;
    let div = (-perVal)/100;
    perMult = (1-div);
  } else {
    let div = perVal/100;
    perMult = (1+div);
  }
  return perMult;
}

const getValInd = (i,pCond,dCond,weekday) => {
  let fiveVals = {
    pvi: [],
    dvi: [],
    opvi: [],
    wvi: [],
    // tvi: []
  }

  if(pCond && weekday) {
    fiveVals.pvi.push(i);
    if(dCond) {
      fiveVals.dvi.push(i);
    }
  } else {
    if(!weekday) {
      fiveVals.wvi.push(i);
    }

    if(!pCond || !weekday) {
      fiveVals.opvi.push(i);
    }
  }

  // fiveVals.tvi.push(i);

  return fiveVals;
}

//Old approach for old optimap impl
// const getIdxArrObj = (val,type,curr,valYear,valMonth) => {
//   let multi = getPerMult(val)
//   let idxArr = curr.get(valYear)[valMonth][type];
//   return {
//     idxArr: idxArr, multi: multi
//   };
// }

/* New approach for new optimap schema */
const getIdxArrObj = (val,type,curr) => {
  return({
    idxArr: curr[type],multi: getPerMult(val)
  })
}

//helper for creating 'upload' and user subfolders
const makeFolder = (folderName) => {
  let upload = './uploads/';
  if(fs.existsSync(upload)) {           //checking if main folder exists
    if(!fs.existsSync(upload+folderName)) { //checking if subexists if not create one
      fs.mkdirSync(upload+folderName);
    }
  } else {    //if not create main + user specific subfolder
    fs.mkdirSync(upload);
    fs.mkdirSync(upload+folderName);
  }
}

const deleteFolder = (folderName) => {
  try{
    const dir = path.join(__basedir, "uploads", folderName);
    if(fs.existsSync(dir)) {
      fs.rmSync(dir, {recursive: true})
      winstonLogger.info(`${folderName}'s folder deleted successfully`);
    } else {
      winstonLogger.info(`No ${folderName} folder to be deleted`);
    }
  } catch(error) {
    winstonLogger.error(error + " - Error deleting folder");
  }
}

const deleteFile = (fileName) => {
  let dir = path.join(__basedir,'uploads',fileName+'.csv');
  try {
    fs.unlink(dir, (err) => {
      if (err) throw err;
      winstonLogger.info("User file deleted successfully");
    });
  } catch (error) {
    err.message += ' - Error deleting file';
    errorHandler(err);
  }
}

/*  The ISO 8601 syntax (YYYY-MM-DD) is also the preferred JavaScript date format */
const isValidDate = (str) => {
  var d = moment(str,'YYYY-MM-DD HH:mm');
  if(d==null || !d.isValid() || Date.parse(str) < 0) return false;
  return str.indexOf(d.format('YYYY-MM-DD HH:mm')) >= 0
}

const isValidMpan = val => isNaN(val) ? 0 : parseInt(val);

module.exports = {
  // converter,
  // converter2,
  singleConvObj,
  getDays,
  getMonths,
  monthlyViewData,
  getWeekly,
  checkAuthName,
  upload,
  getPerMult,
  getValInd,
  getIdxArrObj,
  deleteFolder,
  deleteFile,
  isValidDate,
  isValidMpan
}