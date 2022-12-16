import React from 'react';
import moment from 'moment';
import { JsonToTable } from 'react-json-to-table';


function BasicUpload({ans}) {

  const mapper = (single) => {
    let date = moment(single.FromDateTime).format('YYYY-MM-DD');
    let month = moment(single.FromDateTime).format('MMM');
    let year = moment(single.FromDateTime).format('YYYY');
    let value = parseFloat(single.value);
    let time = moment(single.FromDateTime, moment.defaultFormat).format(
      'YYYY-MM-DD HH:mm'
    );
    var d = moment(`${time}`);
    var peakStart = moment(`${date} 07:00`);
    var peakEnd = moment(`${date} 19:00`);

    var duosStart = moment(`${date} 16:00`);
    var duosEnd = moment(`${date} 19:00`);

    var peakCondition1 =
      0 <= d.diff(peakStart, 'hours') && d.diff(peakStart, 'hours') <= 12; //should be true (only true if result is between 0-12)
    var peakCondition2 =
      0 <= peakEnd.diff(d, 'hours') && peakEnd.diff(d, 'hours') <= 12;
    var weekday = moment(date).isoWeekday() <= 5;
    var peakVol = peakCondition1 && peakCondition2 && weekday ? value : 0;

    var duosCondition1 =
      0 <= d.diff(duosStart, 'hours') && d.diff(duosStart, 'hours') <= 3; //should be true (only true if result is between 0-3)
    var duosCondition2 =
      0 <= duosEnd.diff(d, 'hours') && duosEnd.diff(d, 'hours') <= 3;
    var duosVol = duosCondition1 && duosCondition2 && weekday ? value : 0;
    var weekendVol = !weekday ? value : 0;
    var offPeak = !peakCondition1 && !peakCondition2 && weekday ? value : 0;
    var offPeakVol = weekendVol + offPeak;

    return {
      CurveCode: single.CurveCode,
      FromDateTime: date,
      years: year,
      Month: month,
      value: value,
      peakVol: peakVol,
      duosVol: duosVol,
      weekendVol: weekendVol,
      offPeakVol: offPeakVol,

    };
  };

  const getDays = (group, current) => {
    let i = group.findIndex(
      (single) => single.FromDateTime === current.FromDateTime
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].value += current.value;
    group[i].peakVol += current.peakVol;
    group[i].duosVol +=current.duosVol;
    //Can include weekends,offPeak value as well
    return group;
  };

  const getMonths = (group, current) => {
    let i = group.findIndex(
      (single) =>
        single.Month === current.Month && single.years === current.years
    );
    if (i === -1) {
      return [...group, current];
    }
    group[i].value += current.value; //returns totalVolume
    group[i].peakVol += current.peakVol; //returns peakVol
    group[i].duosVol += current.duosVol; //returns duosVol
    group[i].weekendVol += current.weekendVol; //returns weekendVol
    group[i].offPeakVol += current.offPeakVol; //returns offPeakVol

    return group;
  };


  const perDayData = ans && ans?.map(mapper).reduce(getDays, []);
  const perDayCopy = ans && JSON.parse(JSON.stringify(perDayData));
  const monthlyView = ans && perDayCopy.reduce(getMonths, []);
  //Sorting
  let sorted= ans && ans?.sort(function(a,b){
    return new Date(a.FromDateTime) - new Date(b.FromDateTime)});
  // ans && console.log("Sorted=",sorted);
  // ans && console.log("PerDayData",perDayData)
  return <JsonToTable json={monthlyView} />
}

export default BasicUpload;
