import React from "react";
import { useTable } from "react-table";
import "../css/table.css";
import { COLUMNS } from "./Aggregated/Columns";

function ComparisonTable({ monthlyView }) {
  const columns = React.useMemo(() => COLUMNS, []);
  const data = React.useMemo(() => monthlyView, [monthlyView]);

  const tableInstance = useTable({
    columns,
    data,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="comparison-container fluid-container">
      {/* <span style={{ fontWeight: "700", color: "#1161AB" }}>Aggregated View</span> */}

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
            //console.log("compare row",row)
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
    </div>
  );
}

export default ComparisonTable;
