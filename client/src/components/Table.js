import React from "react";
import { MONTHLYCOLUMNS } from "./Columns";
import {
  useTable,
  useExpanded,
  useGroupBy,
  useSortBy,
  usePagination,
} from "react-table";
import AggregatedChart from "./Aggregated/AggregatedChart";
import { BsFillCaretRightFill } from "react-icons/bs";
import { AiFillCaretDown } from "react-icons/ai";
import { useNavigate,Link } from "react-router-dom";

function Table({ ans, monthlyView, categoryItems }) {
  const columns = React.useMemo(() => MONTHLYCOLUMNS, []);
  const data = React.useMemo(() => ans, [ans]);
  const navigate = useNavigate();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, //for pagination use page instead of rows
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    state,
    prepareRow,
  } = useTable(
    { columns, data },
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination
  );
  const { pageIndex, pageSize } = state;
  return (
    <>
      <div className="container">
        {/* <p style={{ fontWeight: "700", color: "#1161AB" }}>Aggregated View</p> */}
        <table {...getTableProps()} border={1}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getGroupByToggleProps())}
                  >
                    {column.canGroupBy ? (
                      <span style={{ padding: "0px 12px" }}>
                        {column.isGrouped ? (
                          <AiFillCaretDown />
                        ) : (
                          <BsFillCaretRightFill />
                        )}
                      </span>
                    ) : null}
                    {column.render("Header")}
                    {/* {column.isSorted
                    ? column.isSortedDesc
                      ? " ▼"
                      : " ▲"
                    : ""} */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.isGrouped ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <span
                              style={{ padding: "0px 12px" }}
                              {...row.getToggleRowExpandedProps()}
                            >
                              {row.isExpanded ? (
                                <AiFillCaretDown />
                              ) : (
                                <BsFillCaretRightFill />
                              )}
                            </span>
                            {cell.render("Cell")} ({row.subRows.length})
                          </>
                        ) : cell.isAggregated ? (
                          // If the cell is aggregated
                          cell.render("Aggregated")
                        ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          cell.render("Cell")
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          style={{ display: "flex", justifyContent: "center", margin: "8px" }}
        >
          <span style={{margin:"8px"}}>
            Page
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          {/* <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))}>
            {[12,24,36,48].map(pageSize=>(
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select> */}
          <button
            className="btn btn-primary"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            style={{ background: "#1161AB" }}
          >
            Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={() => nextPage()}
            disabled={!canNextPage}
            style={{ background: "#1161AB" }}
          >
            Next
          </button>
          <br />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <Link className="btn-linked" to="/aggregatedEdit" state={{ monthlyView: monthlyView }}>
          <button
            className="btn btn-primary"
            style={{ background: "#1161AB" }}
          >
            Edit
          </button>
          </Link>
        </div>
        <div className="row">
          <div className="col-12">
            <h2 className="aggregated-heading" style={{ paddingTop: "40px" }}>
              Visualized View
            </h2>
            {monthlyView && (
              <AggregatedChart
                aggregatedView={monthlyView}
                categoryItems={categoryItems}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Table;
