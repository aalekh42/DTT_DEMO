import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AggregatedChart from "./Aggregated/AggregatedChart";
import { CSVLink } from "react-csv";
import ComparisonTable from "./ComparisonTable";
import { MoonLoader } from "react-spinners";
import {
  fireUpdatedMonthly,
  getDaily,
  getMonthly,
  putDailyEdited,
  setFileName,
  setHhData,
} from "../redux/actionCreators/Actions";
import axios from "axios";
import { encodedToken } from "../utils/generic";
import ExportModal from "./ExportModal";

function Comparison({
  monthly,
  token,
  hhData,
  optiMapArr,
  setHhData,
  filteredMpan,
  fireUpdatedMonthly,
  getUpdatedMonthly,
  newMonthly,
  loading,
  fileName,
  setFileName,
}) {
  const [exported, setExported] = useState(false);
  const [updatedHH, setUpdatedHH] = useState(hhData);
  const [updatedMonth, setUpdatedMonth] = useState(newMonthly);
  const [showModal,setShowModal]= useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedMpans = JSON.stringify(
    filteredMpan?.filter((e) => e.isChecked).map((e) => e.name)
  );
  console.log("selectedMpans",selectedMpans)
  let tempObj = hhData;

  const headers = [
    { label: "CurveCode", key: "curveCode" },
    { label: "FromDateTime", key: "FromDateTime" },
    { label: "Value", key: "value" },
  ];

  useEffect(() => {
    /*TO DISABLE BACK */
    // window.history.pushState(null, document.title, window.location.href);
    // window.addEventListener('popstate', function(event) {
    //   window.history.pushState(null, document.title, window.location.href);
    // });
    setTimeout(()=>getUpdatedMonthly(selectedMpans,token),3000)
    ;
  }, [selectedMpans]);

  const fireUpdMonthlyGetReq = async () => {
    try {
      const res = await axios({
        url: `http://localhost:4000/getUpdMonthly/?sm=${selectedMpans}`,
        method: "get",
        headers: { Authorization: "Basic " + token },
      });
      setUpdatedMonth(res.data);
      console.log("Upd Monthly data", res.data);
    } catch (error) {
      console.log(error);
    }
  };
  /*CONVERSION */
  const getUpdatedHH = (optiMapArr) => {
    for (let i = 0; i < optiMapArr.length; i++) {
      let multi = parseFloat(optiMapArr[i].multi);
      let indexArr = optiMapArr[i].idxArr;
      for (let i = 0; i < indexArr.length; i++) {
        let idx = indexArr[i] - 1;
        let newVal = (tempObj[idx].value * multi).toFixed(2);
        tempObj[idx].value = parseFloat(newVal);
      }
    }
    setUpdatedHH(tempObj);
    setExported(true);
  };
  console.log('filename',updatedMonth);
  return (
    <>
    {loading ?(
        <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        {/* <Spinner animation="border" variant="primary" /> */}
        <MoonLoader color="#1161AB" />
        <h6 style={{ color: "#1161AB" }}>Updating,Please Wait!!</h6>
      </div>
    ):(
      <div className="container-fluid comparison-container">
        <div className="row">
          <div className="col-12">
            <p
              style={{
                textAlign: "center",
                fontWeight: "700",
                color: "#1161AB",
              }}
            >
              COMPARISON SCREEN
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <span style={{ fontWeight: "700", color: "#1161AB" }}>Before</span>
            <ComparisonTable monthlyView={state.data} />
          </div>
          <div className="col-6">
            <span style={{ fontWeight: "700", color: "#1161AB" }}>After</span>
            <ComparisonTable monthlyView={newMonthly} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h2 className="aggregated-heading" style={{ paddingTop: "40px" }}>
              Visualized View
            </h2>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <span style={{ fontWeight: "700", color: "#1161AB" }}>Before</span>
            <AggregatedChart aggregatedView={state.data} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <span style={{ fontWeight: "700", color: "#1161AB" }}>After</span>
            <AggregatedChart aggregatedView={newMonthly} />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {exported ? (
                <CSVLink
                  data={updatedHH}
                  headers={headers}
                  filename={`amended_${fileName}`}
                  className="btn btn-primary"
                  style={{ background: "#1161AB" }}
                  onClick={(event) => {
                    console.log("You clicked the link");
                    setShowModal(true);
                    //navigate('/tabs', { replace: true })
                  }}
                >
                  Export
                </CSVLink>
              ) : (
                <button
                  className="btn btn-primary"
                  style={{ background: "#1161AB", marginRight: "10px" }}
                  onClick={() => getUpdatedHH(optiMapArr)}
                >
                  Convert
                </button>
              )}
            </div>
            {showModal && <ExportModal showModal={showModal}/> }
          </div>
        </div>
      </div>
    )}

    </>
  );
}

const mapStateToProps = (state) => {
  return {
    hhData: state.demo.hhData,
    daily: state.demo.daily,
    monthly: state.demo.monthly,
    category: state.common.category,
    filteredMpan: state.demo.mpans,
    error: state.demo.error,
    optiMapArr: state.demo.optiMapArr,
    token:state.demo.token,
    fileName:state.demo.fileName,
    newMonthly:state.demo.updatedMonth,
    loading:state.demo.updatedMonthlyLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setHhData: () => dispatch(setHhData()),
    setFileName:(filename)=>dispatch(setFileName(filename)),
    getUpdatedMonthly:(mpans,token)=>dispatch(fireUpdatedMonthly(mpans,token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Comparison);
