import React from "react";
import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AggregatedEdit from "./components/Aggregated/AggregatedEdit";
import ErrorBoundary from "./components/ErrorBoundary";
import Viewtabs from "./components/Viewtabs";
import Comparison from "./components/Comparison";
import UploadCsv from "./components/UploadCsv";
import ExportContainer from "./components/ExportContainer";

const LazyViewtabs = React.lazy(() => import("./components/Viewtabs"));

export default function App() {
  return (
    <>
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* <Route exact path="/" element={<Home />}></Route> */}
            <Route exact path="/" element={<UploadCsv />}></Route>
            <Route exact path="/export" element={<ExportContainer />}></Route>
            <Route
              exact
              path="aggregatedEdit"
              element={<AggregatedEdit />}
            ></Route>
            <Route
              exact
              path="tabs"
              element={
                <React.Suspense
                  fallback={
                    <h4 style={{ textAlign: "center", fontSize: "18px" }}>
                      Loading........
                    </h4>
                  }
                >
                  {<LazyViewtabs />}
                </React.Suspense>
              }
            ></Route>
            <Route exact path="compare" element={<Comparison />}></Route>
          </Routes>
        </ErrorBoundary>
      </Router>
    </>
  );
}
