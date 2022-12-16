import React, { PureComponent } from "react";
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

export default class AggregatedChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      monthValue: "",
      mpanValue: "",
    };
  }
  handleChangeMpans = (e) => {
    this.setState({
      mpanValue: e.target.value,
    });
  };
  render() {
    const { aggregatedView } = this.props;
    console.log("Aggregated Chart",aggregatedView)
    return (
      <>

        <ResponsiveContainer width="100%" aspect={3} >
          <ComposedChart
            width={500}
            height={400}
            data={aggregatedView}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
            style={{border:'2px solid #1161AB',fontWeight:"bold"}}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="my" scale="band" angle={-45} interval={0} dy={15} dx={5} style={{fontSize:"8px"}}/>
            <YAxis />
            <Tooltip />
            <Legend />
            {/* <Area type="monotone" dataKey="TotalVol" fill="#99BEB6" stroke="#8884d8" /> */}
            <Bar dataKey="pv" barSize={20} stackId="a" fill="#7edee7" />
            <Bar dataKey="opv" barSize={20} stackId="a" fill="#1b8690" />
            <Line type="monotone" dataKey="maxKwh" stroke="blue" />

            {/* <Line type="monotone" dataKey="offPeakVol" stroke="#1b8690" /> */}
            {/* <Scatter dataKey="weekendVol" fill="red" /> */}
            <Line
              type="monotone"
              dataKey="mBase"
              stroke="red"
              strokeDasharray="5 5"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
}
