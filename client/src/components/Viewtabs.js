import React,{ useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "../css/home.css";
import MonthlyTable from "./Monthly/MonthlyTable";
import Filter from "./Filter";
import { getMonths, getDays, getWeeks } from "../utils/generic";
import _ from "lodash";
import WeeklyTable from "./Weekly/WeeklyTable";
import Table from "./Table";
import { connect } from "react-redux";
import { deleteCollection, getMonthly, getMpans, setDaily, setMonthly, updateMpan,getDaily } from "../redux";
import { getWeekly, setWeekly } from "../redux/actionCreators/Actions";

function Viewtabs({
  token,
  getDaily,
  daily,
  deleteCollection,
  getMpans,
  mpans,
  weekly,
  monthly,
  getMonthly,
  getWeekly,
  setDaily,
  setWeekly,
  setMonthly,
  updateFilteredMpan,
  initialDaily,
  initialWeekly,
  initialMonthly,
  filterDaily,
  filterMonthly
}) {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
    getDaily(token);
    getMpans(token);
    getMonthly(token);
    getWeekly(token);
    // window.history.pushState(null, document.title, window.location.href);
    // window.addEventListener('popstate', function(event) {
    //   window.history.pushState(null, document.title, window.location.href);
    // });
  },[])
 
    /* FILTERING FUNCTIONALITY */
  const filterItems = (e) => {
    const { name, checked } = e.target;
    if (name === "all select") {
      let temp = mpans?.map((elem) => {
        return {
          ...elem,
          isChecked: checked,
        };
      });
      updateFilteredMpan(temp);
      //setItems({ ...items, monthly: data.monthly });

      if (checked) {
        setDaily(initialDaily);
        setMonthly(initialMonthly);
        setWeekly(initialWeekly);
      } else {
        setDaily([]);
        setMonthly([]);
        setWeekly([]);
      }
    } else {
      let temp = mpans?.map((elem) =>
        elem.name === name ? { ...elem, isChecked: checked } : elem
      );
      // const tempDaily=daily?daily:filterDaily
      const res1 =initialDaily.filter((page1) =>
        temp.find(
          (page2) => page1.cc === page2.name && page2.isChecked === true
        )
      );
      const copy = _.cloneDeep(res1);
      const copy2 = _.cloneDeep(res1);
      const res2 = initialDaily && copy.reduce(getMonths, []);
      const weekly2 = initialWeekly && copy2.reduce(getWeeks,[]);
      const peakKwh = initialDaily && res2?.map((x) => x.pv);
      const maxKwh = Math.max(...peakKwh);
      res2 &&
        res2?.map((elem, index) => {
          // elem.MonthlyBase = (elem.tv / elem.dim).toFixed(2);
          // elem.Monthly_MW = (
          //   elem.tv /
          //   1000 /
          //   elem.dim /
          //   24
          // ).toFixed(4);
          elem.maxKwh = maxKwh;
          elem.tvp=0;
          elem.pvp=0;
          elem.opvp=0;
          elem.dvp=0;
          elem.wvp=0;
        });
      updateFilteredMpan(temp);
      setDaily(res1);
      setMonthly(res2);
      setWeekly(weekly2);
    }
  };
  return (
    <>
      {/* <Box sx={{ width: "100%", typography: "body1" }}> */}
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab
              className="tab-name"
              style={{ fontWeight: 700 }}
              label="Aggregated"
              value="1"
            />
            <Tab
              className="tab-name"
              style={{ fontWeight: 700 }}
              label="Monthly"
              value="2"
            />
            <Tab
              className="tab-name"
              style={{ fontWeight: 700 }}
              label="Weekly"
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className="row">
            <div className="col-2">
              {/* <Filter filterItems={filterItems} categoryItems={mpans} /> */}
              <Filter filterItems={filterItems} categoryItems={mpans} />

            </div>
            <div className="col-10 upload-block">

                <Table
                  ans={daily}
                  monthlyView={monthly}
                  uniqueCat={mpans}
                />
            </div>
          </div>
        </TabPanel>
        <TabPanel value="2">
          <MonthlyTable
            perDayData={daily}
            category={mpans}
          />
        </TabPanel>
        <TabPanel value="3">
          <WeeklyTable weekly={weekly} category={mpans} />
        </TabPanel>
      </TabContext>
      {/* </Box> */}
      {/* <button className="btn btn-primary" onClick={()=>deleteCollection()}>DELETE</button> */}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    daily:state.demo.daily,
    loading:state.demo.loading,
    error:state.demo.error,
    mpans:state.demo.mpans,
    weekly:state.demo.weekly,
    monthly:state.demo.monthly,
    initialDaily:state.demo.initialDaily,
    initialWeekly:state.demo.initialWeekly,
    initialMonthly:state.demo.initialMonthly,
    filterDaily:state.common.filterDaily,
    filterMonthly:state.common.filterMonthly,
    token:state.demo.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFilteredMpan: (mpan) => dispatch(updateMpan(mpan)),
    getDaily:(token)=>dispatch(getDaily(token)),
    deleteCollection:()=>dispatch(deleteCollection()),
    getMpans:(token)=>dispatch(getMpans(token)),
    getWeekly:(token)=>dispatch(getWeekly(token)),
    getMonthly:(token)=>dispatch(getMonthly(token)),
    setDaily:(daily)=>dispatch(setDaily(daily)),
    setWeekly:(weekly) =>dispatch(setWeekly(weekly)),
    setMonthly:(monthly)=>dispatch(setMonthly(monthly))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Viewtabs);