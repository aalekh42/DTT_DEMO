import React, { useMemo, useState } from "react";
import {
  createTable,
  useTableInstance,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import "../../css/table.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fireUpdatedMonthly, putDailyEdited } from "../../redux/actionCreators/Actions";

const table = createTable();

const EditableCell = ({ getValue, instance, row, column }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [bg, setBg] = useState(false);
  const onBlur = () => {
    instance.options.meta.updateData(row.index, column.id, value);
  };
  const onChange = (e) => {
    setValue(e.target.value);
    setBg(true);
  };
  const columnNames=["y","m","tv","opv","pv","wv","dv"] //list of non editable columns
  if (columnNames.includes(column.id)) {
    return value;
  }
  return (
    <input
      className={!bg ? "table-input" : "table-input2"}
      type="number"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

const defaultColumn = {
  cell: (props) => <EditableCell {...props} />,
};

const AggregatedTable = ({ monthlyView,getUpdatedDaily,filteredMpan,token}) => {

  const [data, setData] = useState([...monthlyView]);
  const editedAggregated = data
    .filter((elem) => elem.isEdited)
    .map((e) => {
      return {
        month: e.m,
        year: e.y,
        tvp: e.tvp,
        opvp: e.opvp,
        pvp: e.pvp,
        dvp: e.dvp,
        wvp: e.wvp,
      };
    });
  const mpanChecked=filteredMpan?.filter(e=>e.isChecked).map(e=>e.name);

  const edited=Object.assign({},{selectedMpans:mpanChecked},{editedVals:editedAggregated})
  console.log("hello edited just now",edited)
  const columns = useMemo(
    () => [
      table.createDataColumn("y", {
        id: "y",
        header: "Year",
      }),
      table.createDataColumn("m", {
        id: "m",
        header: "Month",
      }),
      table.createDataColumn("tv", {
        id: "tv",
        header: "Total Volume",
        enableGrouping: false,
        aggregatedCell: ({ getValue }) => (
          <span style={{ color: "red" }}>{getValue()}</span>
        ), // to style aggregated cells
        //aggregationFn:'count' //just to count
      }),
      table.createDataColumn("tvp", {
        id: "tvp",
        header: "Total Volume (+/-) % ",
        enableGrouping: false,
      }),
      table.createDataColumn("opv", {
        id: "opv",
        header: "Offpeak Volume",
        enableGrouping: false,
      }),
      table.createDataColumn("opvp", {
        id: "opvp",
        header: "Offpeak Volume (+/-) % ",
        enableGrouping: false,
      }),
      table.createDataColumn("pv", {
        id: "pv",
        header: "Peak Volume",
        enableGrouping: false,
      }),
      table.createDataColumn("pvp", {
        id: "pvp",
        header: "Peak Volume (+/-) % ",
        enableGrouping: false,
      }),
      table.createDataColumn("wv", {
        id: "wv",
        header: "Weekend Volume",
        enableGrouping: false,
      }),
      table.createDataColumn("wvp", {
        id: "wvp",
        header: "Weekend Volume (+/-) % ",
        enableGrouping: false,
      }),
      table.createDataColumn("dv", {
        id: "dv",
        header: "Duos Volume",
        enableGrouping: false,
      }),
      table.createDataColumn("dvp", {
        id: "dvp",
        header: "Duos Volume (+/-) %",
        enableGrouping: false,
      }),
    ],
    []
  ); //mention something in dependency array to reflect the updated monthly

  const [grouping, setGrouping] = useState([]);
  const instance = useTableInstance(table, {
    data,
    columns,
    defaultColumn,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value, //dynamic
                isEdited: true,
              };
            }
            return row;
          })
        );
      },
    },
    state: {
      grouping,
    },
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });
 //console.log("Row model", instance.options.data);

  return (
    <>
      <table border={1}>
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : header.renderHeader()}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Link className="btn-linked" to="/compare" state={{ data: data}}>
          <button
            className="btn btn-primary"
            style={{ margin: "8px" }}
            // onClick={() =>
            //   navigate("./compare", {
            //     state: {
            //       data,
            //     },
            //   })
            // }
            onClick={()=>{getUpdatedDaily(edited,token);}}
          >
            Save
          </button>
        </Link>
        {/* 
        <Link className="btn-linked" to="/tabs">
        <button
          className="btn btn-primary"
          style={{ margin: "8px" }}
          onClick={() =>
            navigate(-1)
          }
        >
          Close
        </button>
        </Link>  */}
      </div>
    </>
  );
};
const mapStateToProps = (state) => {
  return {
    filteredMpan: state.demo.mpans,
    token:state.demo.token,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getUpdatedDaily: (data,token) => dispatch(putDailyEdited(data,token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AggregatedTable);
