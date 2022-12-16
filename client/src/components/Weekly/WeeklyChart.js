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

export default class WeeklyChart extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { weekly, category } = this.props;
    return (
      <>
        <ResponsiveContainer width="100%" aspect={3}>
          <ComposedChart
            width={500}
            height={400}
            data={weekly}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis xAxisId="0" dataKey="monthWeek" scale="band" angle={-45} interval={0} dy={15} dx={-10} style={{fontSize:"8px"}}/>

            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Area type="monotone" dataKey="TotalVol" fill="#99BEB6" stroke="#8884d8" /> */}
            <Bar dataKey="pv" barSize={20} stackId="a" fill="#7edee7" />

            <Bar dataKey="opv" barSize={20} stackId="a" fill="#1b8690" />

            <Line type="monotone" dataKey="maxKwh" stroke="blue" dot={{ r: 2 }}/> 
            {/* <Line type="monotone" dataKey="monthlyBase" stroke="red" strokeWidth={3} dot={{ r: 0 }}/> */}

            {/* <Line type="monotone" dataKey="annualVol" stroke='darkred' strokeDasharray="5 5" />  */}
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
}
