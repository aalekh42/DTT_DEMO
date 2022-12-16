import moment from "moment";
import {Buffer} from 'buffer';
import axios from 'axios';

//-----creating encoded token for basic auth-----
// export const getToken=(id)=>{
// //const username = 'admin';
// const password = './xqj5ddt0';
// const token =`${id}:${password}`;
// const encodedToken =  Buffer.from(token).toString('base64');
// return encodedToken
// }
export const makeid = () => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_!@#abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for ( var i = 0; i < 10; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const username = makeid();
const password = './xqj5ddt0';
const token =`${username}:${password}`;
export const encodedToken =  Buffer.from(token).toString('base64');

//-----!creating encoded token for basic auth-----

export const getWeekNum = (d) => {
    var dated = new Date(d);
    var weekOfMonth = (0 | dated.getDate() / 7)+1;
    return weekOfMonth
  }
export const mapper = (single) => {
  let date = moment(single.FromDateTime).format("YYYY-MM-DD");
  let month = moment(single.FromDateTime).format("MMM");
  let year = moment(single.FromDateTime).format("YYYY");
  let value = parseFloat(single.value);
  let day = moment(date).format("ddd");
  let time = moment(single.FromDateTime, moment.defaultFormat).format(
    "YYYY-MM-DD HH:mm"
  );
  var d = moment(`${time}`);
  var peakStart = moment(`${date} 07:00`);
  var peakEnd = moment(`${date} 19:00`);

  var duosStart = moment(`${date} 16:00`);
  var duosEnd = moment(`${date} 19:00`);

  var peakCondition1 =
    0 <= d.diff(peakStart, "hours") && d.diff(peakStart, "hours") <= 12; //should be true (only true if result is between 0-12)
  var peakCondition2 =
    0 <= peakEnd.diff(d, "hours") && peakEnd.diff(d, "hours") <= 12;
  var weekday = moment(date).isoWeekday() <= 5;
  var peakVol = peakCondition1 && peakCondition2 && weekday ? value : 0;

  var duosCondition1 =
    0 <= d.diff(duosStart, "hours") && d.diff(duosStart, "hours") <= 3; //should be true (only true if result is between 0-3)
  var duosCondition2 =
    0 <= duosEnd.diff(d, "hours") && duosEnd.diff(d, "hours") <= 3;
  var duosVol = duosCondition1 && duosCondition2 && weekday ? value : 0;
  var weekendVol = !weekday ? value : 0;
  var offPeak = !peakCondition1 && !peakCondition2 && weekday ? value : 0;
  var offPeakVol = weekendVol + offPeak;
  let daysInMonth = moment(date).daysInMonth();
  let weekNo = getWeekNum(date);
  return {
    CurveCode: single.CurveCode,
    FromDateTime: moment(single.FromDateTime).format("DD-MM-YYYY"),
    years: year,
    Month: month,
    TotalVol: value,
    peakVol: peakVol,
    duosVol: duosVol,
    weekendVol: weekendVol,
    offPeakVol: offPeakVol,
    daysInMonth: daysInMonth,
    MonthYear: `${month} ${year}`,
    weekNo: weekNo,
    day: day,
    dayDate: day + moment(date).format("DD-MM-YYYY"),
  };
};

export const getDays = (group, current) => {
  let i = group.findIndex(
    (single) => single.date === current.date &&
    single.cc === current.cc
  );
  if (i === -1) {
    return [...group, current];
  }
  group[i].tv = parseInt(group[i].tv + current.tv);
  group[i].pv = parseInt(group[i].pv + current.pv);
  group[i].dv = parseInt(group[i].dv + current.dv);
  group[i].opv = parseInt(group[i].opv + current.opv);
  group[i].wv = parseInt(group[i].wv + current.wv);

  return group;
};

export const getMonths = (group, current) => { 
  //update getMonths from generic(backend) to include %,mw,mw etc
  let i = group.findIndex(
    (single) => single.my === current.my
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

export const getAnnual = (group, current) => {
  let i = group.findIndex((single) => single.y === current.y);
  if (i === -1) {
    return [...group, current];
  }
  group[i].yearlyDays = parseInt(group[i].daysInMonth + current.daysInMonth); //returns totalVolume

  return group.yearlyDays;
};
export const getWeeks = (group, current) => {
  let i = group.findIndex(
    (single) =>
      single.my === current.my &&
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
export const getMonthlyBaseWeekly = (group, current) => {
  let i = group.findIndex(
    (single) =>
      single.my === current.my
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
