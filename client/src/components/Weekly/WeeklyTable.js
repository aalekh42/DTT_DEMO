import React,{useState} from "react";
import { useTable } from "react-table";
import { WEEKLYCOLUMN } from "../Weekly/WeeklyColumn";
import WeeklyChart from "./WeeklyChart";
import _ from "lodash";


function WeeklyTable({ weekly, category }) {
  const [yearValue,setYearValue] = useState('');
  const [mpanValue,setMpanValue] = useState('');

  const handleChangeYear = (e) => {
    setYearValue(e.target.value);
  };
  const handleChangeMpans = (e) => {
    setMpanValue(e.target.value);
  };
  const checkedCategory = category && category?.filter((elem)=>elem.isChecked===true);
  const mpans = checkedCategory && checkedCategory.map((elem) => elem.name);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
  const weeklyCopy = _.cloneDeep(weekly)
  const weeklyView =
  weeklyCopy &&
  weeklyCopy.filter(
    (elem) =>
      elem.y === `${yearValue}` &&
      elem.cc === `${mpanValue}`
  );
  const uniqueYears=weeklyCopy && new Set(weeklyCopy?.map(x=>x.y)); //used weeklyCopy (as uniqueYear is set to empty if only 1 year. So, not choosing weeklyView)
  const peakKwh = weeklyView && weeklyView?.map((x) => x.pv);
  const maxKwh = peakKwh && Math.max(...peakKwh);
  //const copy2=_.cloneDeep(weeklyCopy);
  //const newWeekly = copy.reduce(getMonthlyBaseWeekly, []);

  //MonthlyBase,AnnualBase and  in x-axis adjust all in one line 
  const allYears= [...uniqueYears];
  const options =
  allYears &&
  allYears.map((year, index) => (
      <option key={index} value={year}>
        {year}
      </option>
    ));
  //const annualVol = weeklyView && weeklyView?.reduce((accum,curr)=>accum+curr.tv,0)
  weeklyView &&
  weeklyView.map((elem) => {
      let op = Object.assign(elem, { monthWeek:`${elem.m} week ${elem.wn}`,maxKwh:maxKwh});
      return op;
    });
  const columns = React.useMemo(() => WEEKLYCOLUMN, []);
  const data = React.useMemo(() => weeklyView, [weeklyView]);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="upload3-container fluid-container">
      <h4 style={{ fontWeight: "700", color: "#1161AB" }}>Weekly breakdown :</h4>
      <select value={yearValue} onChange={(e)=>handleChangeYear(e)}>
          <option value="">Select option</option>
          {options}
        </select>
        <select
          value={mpanValue}
          onChange={(e)=>handleChangeMpans(e)}
          style={{ marginLeft: "15px" }}
        >
          <option value="">Select option</option>

          {mpans &&
            mpans.map((mpan, index) => (
              <option key={index} value={mpan}>
                {mpan}
              </option>
            ))}
        </select>
        <p>
          Selected:
          {yearValue && (
            <span style={{ fontSize: "14px", color: "teal" }}>
              {yearValue},
            </span>
          )}
          {mpanValue && (
            <span style={{ fontSize: "14px", color: "teal" }}>
              Mpan:{mpanValue}
            </span>
          )}
        </p>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <h4 style={{ fontWeight: "700", color: "#1161AB" }}>Visualized View</h4>
      <WeeklyChart weekly={weeklyView} category={checkedCategory}  />
    </div>
  );
}

export default WeeklyTable;
