const {monthlyViewData, getWeekly, getPerMult, getIdxArrObj, checkAuthName, deleteFolder} = require('../utils/genric');
const {Mpan, Daily, OptiMap} = require('../models/schema');
const { readUpFile } = require('../utils/readUpFile');
const { winstonLogger } = require('../errorLogger/winstonLogger');
const { errorHandler } = require('../errorLogger/errorLogger');

/*Get Daily Data*/
exports.getDailyData = async(req,res,next) => {
  try {
    let docUser = checkAuthName(req,res);
    let dailyData = await Daily.find({du: docUser},{_id:0,__v:0,du:0});
    if(dailyData.length == 0) {
      let err = new Error('No daily data found');
      err.status = 404;
      throw err;
    }
    winstonLogger.info(`Daily data displayed - ${docUser}`);
    res.status(200).json(dailyData);
  } catch(error) {
    if(error.status) next(error);
    else {
      error.message += ' - In getDailyData';
      next(error);
    }
  }
}

/*Get Monthly Data*/
exports.getMonthlyData = async(req,res,next) => {
  try {
    let docUser = checkAuthName(req,res);
    let dailyData = await Daily.find({du:docUser},{_id:0,__v:0,du:0,cc:0,day:0}).lean();
    if(dailyData.length == 0) {
      let err = new Error('No Monthly data found');
      err.status = 404;
      throw err;
    }
    let monthlyData = monthlyViewData(dailyData);
    winstonLogger.info(`Monthly data displayed - ${docUser}`);
    res.status(200).json(monthlyData);
  } catch(error) {
    if(error.status) next(error);
    else {
      error.message += ' - In getMonthlyData';
      next(error);
    }
  }
}

/*Get Weekly Data*/
exports.getWeeklyData = async(req,res,next) => {
  try {
    let docUser = checkAuthName(req,res);
    let dailyData = await Daily.find({du:docUser},{_id:0,__v:0,du:0});
    if(dailyData.length == 0) {
      let err = new Error('No Weekly data found');
      err.status = 404;
      throw err;
    }
    let weeklyData = dailyData.reduce(getWeekly, []);
    winstonLogger.info(`Weekly data displayed - ${docUser}`);
    res.status(200).json(weeklyData);
  } catch(error) {
    if(error.status) next(error);
    else {
      error.message += ' - In getWeeklyData';
      next(error);
    }
  }
}

/*Get Mpan Data*/
exports.getMpanData = async(req,res,next) => {
  try {
    let docUser = checkAuthName(req,res);
    let mpans = await Mpan.find({du:docUser},{_id:0,__v:0,du:0});
    if(mpans.length == 0) {
      let err = new Error('No Mpans found');
      err.status = 404;
      throw err;
    }
    winstonLogger.info(`Mpans displayed - ${docUser}`);
    res.status(200).json(mpans);
  } catch(error) {
    if(error.status) next(error);
    else {
      error.message += ' - In getMpan';
      next(error);
    }
  }
}

/*File -> Post Daily Data*/
exports.postTranformData = async(req,res,next) => {
  let hhObj = []
  try{
    let docUser = checkAuthName(req,res);
    readUpFile(res,next,docUser);
  } catch(error) {
    error.message += ' - In postTransformData';
    next(error);
  }
}

/*Editing daily data with PUT req*/
exports.putDaily = async(req,res,next) => {
  try {
    let selMpan = req.body.selectedMpans;
    let editedVals = req.body.editedVals;
    if(!selMpan || !editedVals || selMpan.length == 0 || editedVals.length == 0) {
      let err = new Error('Incomplete request body');
      err.status = 400;
      throw err;
    }
    let docUser = checkAuthName(req,res);
    let updFlag = false;
    for(let i=0;i<editedVals.length;i++) {
      let currMonth = editedVals[i];
      if(currMonth.tvp) {
        let perMult = getPerMult(currMonth.tvp);
        
        let upAns = await Daily.updateMany({cc: {$in: selMpan}, m:currMonth.month, y:currMonth.year, du:docUser}, 
                               {$mul: {tv: perMult, opv: perMult, pv: perMult, dv: perMult, wv:perMult}});
        if(upAns.matchedCount > 0) {
          winstonLogger.info(`----Updated TV & All - ${docUser}----`);
          updFlag = true;
        } 
      } else  {
        let weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        let weekends = ['Sat', 'Sun'];

        //Editing based on Weekend volume
        if(currMonth.wvp) {
          let wvMult = getPerMult(currMonth.wvp);
          let upAns = await Daily.updateMany({cc: {$in: selMpan}, m: currMonth.month, y:currMonth.year, day:{$in: weekends}, du: docUser}, 
                                 {$mul: {opv: wvMult, wv: wvMult}});
          if(upAns.matchedCount > 0) {
            winstonLogger.info(`----Updated WV & OPV (Weekend only) - ${docUser}----`);
            updFlag = true;
          }
        }

        //Editing based on Peak volume
        if(currMonth.pvp) {
          let pvMult = getPerMult(currMonth.pvp);
          let upAns = await Daily.updateMany({cc: {$in: selMpan}, m: currMonth.month, y:currMonth.year, day:{$in: weekdays}, du: docUser}, 
                                 {$mul: {pv: pvMult, dv: pvMult}});
          if(upAns.matchedCount > 0) {
            winstonLogger.info(`----Updated PV & DV (Weekdays only) - ${docUser}----`); 
            updFlag = true;
          } 
        }

        //Editing based on Off Peak volume
        if(currMonth.opvp) {
          let wvMult = getPerMult(currMonth.opvp);
          let upAns = await Daily.updateMany({cc: {$in: selMpan}, m: currMonth.month, y:currMonth.year, du:docUser}, 
                                 {$mul: {opv: wvMult, wv: wvMult}});
          if(upAns.matchedCount > 0) {
            winstonLogger.info(`----Updated WV & OPV (weekly) - ${docUser}----`);
            updFlag = true;
          }
        }

        //Editing based on Duos volume
        if(currMonth.dvp) {
          let daysData = await Daily.find({cc: {$in: selMpan}, m: currMonth.month, y:currMonth.year, day:{$in: weekdays}, du:docUser},
                                          {dv:1});
          if(daysData.length > 0) {
            let dvMult = getPerMult(currMonth.dvp);
            for(let i=0;i<daysData.length;i++) {
              let newDv = daysData[i].dv * dvMult;
              let diff = newDv - daysData[i].dv;
              await Daily.findByIdAndUpdate(daysData[i]._id, 
                                            {$mul: {dv: dvMult}, $inc: {pv: diff}});
            }
            winstonLogger.info(`----Updated DV & PV - ${docUser}----`);
            updFlag = true;
          }                                
        }

        if(updFlag) {
          //---Lastly updating total vol based on above changes in Peak and Offpeak Vols
          let allDays = await Daily.find({cc: {$in: selMpan}, m: currMonth.month, y:currMonth.year, du:docUser},
                                         {opv: 1, pv: 1});
          if(allDays.length > 0) {
            for(let i=0;i<allDays.length;i++) {
              await Daily.findByIdAndUpdate(allDays[i]._id,
                                            {tv: (allDays[i].opv + allDays[i].pv).toFixed(2)});
            }
            winstonLogger.info(`----Finally Updated TV - ${docUser}----`);
          }
        }
      }
    }
    if(updFlag) winstonLogger.info(`Updated daily values in DB - ${docUser}`);
    else winstonLogger.info(`No updates to values - ${docUser}`);
    
    let ansArr = [];

    if(updFlag) {
      for(let i=0;i<editedVals.length;i++) {
        let edVal = editedVals[i];
  
        let valMonth = edVal.month;
        let valYear = edVal.year;
        let optiObj = await OptiMap.find({cc: {$in:selMpan}, y: valYear, m:valMonth, du:docUser},
                                         {pvi:1,dvi:1,opvi:1,wvi:1});
        for(let j=0;j<optiObj.length;j++) {
          if(edVal.tvp) {
            let multi = getPerMult(edVal.tvp)
            let idxArr = [...optiObj[j].pvi, ...optiObj[j].opvi];
    
            ansArr.push({
              idxArr: idxArr, multi: multi
            });
          } else {
            // Pushing Peak vol indexes with their multiplier
            if(edVal.pvp) ansArr.push(getIdxArrObj(edVal.pvp,'pvi',optiObj[j]));
    
            // Pushing Duos vol indexes with their multiplier
            if(edVal.dvp) ansArr.push(getIdxArrObj(edVal.dvp,'dvi',optiObj[j]));
    
            // Pushing Offpeak vol indexes with their multiplier
            if(edVal.opvp) ansArr.push(getIdxArrObj(edVal.opvp,'opvi',optiObj[j]));
  
            // Pushing Weekend vol indexes with their multiplier
            if(edVal.wvp) ansArr.push(getIdxArrObj(edVal.wvp,'wvi',optiObj[j]));
          }
        }
      }
    }

    // console.log(ansArr);
    // let ansSamp = [
    //   {idvArr: [1,2,3,4], mult: 0.8},
    //   {idvArr: [1,2,3,4], mult: 0.8},
    //   {idvArr: [1,2,3,4], mult: 0.8},
    //   {idvArr: [1,2,3,4], mult: 0.8},
    //   {idvArr: [1,2,3,4], mult: 0.8},
    // ]
    winstonLogger.info(`Sent indexArr response - ${docUser}`)
    res.status(200).json(ansArr);
    // res.status(200).json({success: true, msg: "Data updated successfully"});
  } catch(error) {
    next(error);
  }
}

/*Get Updated Monthly Data*/
exports.getUpdatedMonthly = async(req,res,next) => {
  try {
    let selMpans;
    try {
      selMpans = JSON.parse(req.query.sm);
    } catch(err) {
      err.message = 'Empty URL query string';
      err.status = 400;
      throw err;
    }
    if(!selMpans || selMpans.length == 0) {
      let err = new Error('Empty URL query string');
      err.status = 400;
      throw err;
    }
    let docUser = checkAuthName(req,res);
    let dailyData = await Daily.find({cc: {$in:selMpans}, du:docUser},{_id:0,__v:0,du:0}).lean();
    if(dailyData.length  == 0) {
      let err = new Error('No Updated Monthly found');
      err.status = 404;
      throw err;
    }
    let monthlyData = monthlyViewData(dailyData);
    winstonLogger.info(`Updated Monthly data displayed - ${docUser}`);
    res.status(200).json(monthlyData);
  } catch(error) {
    if(error.status) next(error);
    else {
      error.message += ' - In getUpdatedMonthly';
      next(error);
    }
  }
}

/*Deleting collections from DB*/
exports.deleteCollections = async(req,res,next) => {
  try {
    let docUser = checkAuthName(req,res);
    let dailyDelCount = (await Daily.deleteMany({du:docUser})).deletedCount;
    let mpanDelCount = (await Mpan.deleteMany({du:docUser})).deletedCount;
    let optiDelCount = (await OptiMap.deleteMany({du:docUser})).deletedCount;
    if(dailyDelCount > 0 || mpanDelCount > 0 || optiDelCount > 0) {
      winstonLogger.info(`Data deleted successfully - ${docUser}`);
      res.status(200).json({msg: 'Data deleted successfully'});
    } else {
      let err = new Error("User Data doesn't exist");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    if(error.status) next(error);
    else {
      error.message += " - In deleteCollections";
      next(error);
    }
  }
}

exports.invalidRoute = async(req,res,next) => {
  try {
    let err = new Error('Invalid route, check and try again');
    err.status = 404;
    throw err;
  } catch (error) {
    if(!error.status) error.message += ' - In invalid route';
    next(error);
  }
}