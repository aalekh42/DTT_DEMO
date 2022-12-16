import React, { PureComponent } from "react";
import moment from "moment";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
  BarChart,
} from "recharts";
import '../../css/chart.css'
import _ from "lodash";


export default class MonthlyChart extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { dailyView,perDayData, selectedMpan} = this.props;
    const perDayCopy =_.cloneDeep(dailyView)
    const peakKwh = perDayCopy && perDayCopy?.map((x) => x.pv);
    const maxKwh = peakKwh && Math.max(...peakKwh);
    const daysInMonth =perDayCopy && perDayCopy?.map((x) =>moment(x.date).daysInMonth())[0];
    //const totalDaysInYear=perDayData && new Set(perDayData?.map((x)=>days_of_a_year(x.years)));
    const TotalVol = perDayCopy && perDayCopy.reduce(
      (accum, curr) => accum + curr.tv,
      0
    );
    const annualVol= perDayData && perDayData?.filter(x=>x.cc === `${selectedMpan}`).reduce((accum,curr)=>accum+curr.tv,0)

    const dailyUpdated =
    perDayCopy &&
    perDayCopy.map((elem) => {
        let op = Object.assign(elem, { maxKwh: maxKwh,dayDate:`${elem.day} ${elem.date}`,daysInMonth:daysInMonth,monthlyBase:TotalVol/daysInMonth ,annualVol:annualVol/365});
        return op;
      });
    //console.log("Chart dailyUpdated",dailyUpdated,daysInMonth,perDayCopy);
    return (
      <>
        <ResponsiveContainer width="100%" aspect={3}>
          <ComposedChart
            width={500}
            height={400}
            data={dailyUpdated}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            {/* <XAxis xAxisId="0" dataKey="FromDateTime" label={{ value: "Date ", position: "insideBottom", dy: 40}} scale="band" angle={-45} interval={0} dy={15} dx={-10} style={{fontSize:"12px"}}/> */}
            <XAxis xAxisId="0" dataKey="dayDate" scale="band" angle={-45} interval={0} dy={15} dx={-10} style={{fontSize:"8px"}}/>

            <YAxis />
            <Tooltip />
            {/* <Area type="monotone" dataKey="TotalVol" fill="#99BEB6" stroke="#8884d8" /> */}
            <Bar dataKey="pv" barSize={20} stackId="a" fill="#7edee7" />

            <Bar dataKey="opv" barSize={20} stackId="a" fill="#1b8690" />

            <Line type="monotone" dataKey="maxKwh" stroke="blue" dot={{ r: 2 }}/> 
            <Line type="monotone" dataKey="monthlyBase" stroke="red" strokeWidth={3} dot={{ r: 0 }}/> 

            <Line type="monotone" dataKey="annualVol" stroke='darkred' strokeDasharray="5 5" />
            <Legend/>

          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
}
