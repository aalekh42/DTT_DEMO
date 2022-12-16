import React, { useEffect,useState } from "react";
import { useTable} from "react-table";
import { MONTHLYCOLUMNS } from "./MonthlyColumn";
import MonthlyChart from "./MonthlyChart";


function MonthlyTable({ perDayData, category }) {
  const [monthValue,setMonthValue] = useState('');
  const [mpanValue,setMpanValue] = useState('');

  const handleChangeMonth = (e) => {
    setMonthValue(e.target.value);
  };
  const handleChangeMpans = (e) => {
    setMpanValue(e.target.value);
  };
  const checkedCategory = category && category?.filter((elem)=>elem.isChecked===true);
  const mpans = checkedCategory && checkedCategory.map((elem) => elem.name);
  //const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",];
  const uniqueMonths=perDayData && new Set(perDayData?.map(x=>x.m));
  const allMonths= [...uniqueMonths]

  const dailyView =
  perDayData &&
  perDayData.filter(
    (elem) =>
      elem.m === `${monthValue}` &&
      elem.cc === `${mpanValue}`
  );

  const options =
  allMonths &&
  allMonths.map((month, index) => (
    <option key={index} value={month}>
      {month}
    </option>
  ));
  const columns = React.useMemo(() => MONTHLYCOLUMNS, []);
  const data = React.useMemo(() => dailyView, [dailyView]);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
      <div className="upload3-container fluid-container">
      <h4 style={{ fontWeight: "700", color: "#1161AB" }}>Monthly breakdown </h4>
      <select value={monthValue} onChange={(e)=>handleChangeMonth(e)}>
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
          {monthValue && (
            <span style={{ fontSize: "14px", color: "teal" }}>
              {monthValue},
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
        <MonthlyChart perDayData={perDayData} selectedMpan={mpanValue} dailyView={dailyView}/>
      </div>
  );
}

export default MonthlyTable;