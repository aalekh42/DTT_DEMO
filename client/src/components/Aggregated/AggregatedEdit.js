import React,{useEffect} from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setMonthly } from "../../redux";
import AggregatedTable from "./AggregatedTable";

function AggregatedEdit({setMonthly}) {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(()=>{
    setMonthly(state.monthlyView)
  },[])

  return (
    <div className="container edit-container">
      <div style={{textAlign:'center'}}>
      <h4 style={{ fontWeight: "700", color: "#1161AB" }}>EDIT VIEW</h4>
      </div>
      <div >
      <AggregatedTable monthlyView={state.monthlyView}/>

      </div>
      {/* <button className="btn btn-primary" onClick={() => navigate(-1)}>
        Go back
      </button> */}
    </div>
  );
}


const mapDispatchToProps=(dispatch)=>{
  return{
    setMonthly: (data) => dispatch(setMonthly(data)),
  }
}

export default connect(null,mapDispatchToProps)(AggregatedEdit)