import React, { useEffect, useState } from "react";
import { useCSVReader } from "react-papaparse";
import "../css/home.css";
import { connect } from "react-redux";
import {
  deleteCollection,
  getDaily,
  postDaily,
  setHhData,
  setInitialHhDump,
  updateMpan,
} from "../redux";
import { Navigate } from "react-router";
import { Spinner } from "react-bootstrap";
import { MoonLoader } from "react-spinners";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  browseFile: {
    width: "20%",
    color: "white",
    border: "1px solid white",
    backgroundColor: "#1161AB",
  },
  acceptedFile: {
    border: "2px solid #1161AB",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  },
  acceptedFileRemoved: {
    display: "none",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
    color: "white",
    border: "1px solid white",
    backgroundColor: "#1161AB",
  },
  progressBarBackgroundColor: {
    backgroundColor: "#1161AB",
  },
};
function Home({ postDaily, loading, deleteCollection, postSuccess }) {
  const { CSVReader } = useCSVReader();
  const [hhData, setHhData] = useState("");

  return (
    <>
      {!postSuccess && !loading ? (
                <div className="home-container fluid-container">
                <div className="row">
                  <div className="col-12 home-heading">
                    <h2>DATA TRANSFORMATION TOOL</h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 upload-block">
                    <CSVReader
                      onUploadAccepted={(results) => {
                        //console.log(results.data);
                        //setHhData(results.data)
                        postDaily(results.data);
                      }}
                    >
                      {({
                        getRootProps,
                        acceptedFile,
                        ProgressBar,
                        getRemoveFileProps,
                      }) => (
                        <>
                          <div style={styles.csvReader}>
                            <button
                              type="button"
                              {...getRootProps()}
                              style={styles.browseFile}
                            >
                              Browse file
                            </button>
                            <div style={styles.acceptedFile}>
                              {acceptedFile && acceptedFile.name}
                            </div>
                            {/* <button
                          {...getRemoveFileProps()}
                          style={styles.remove}
                          onClick={() => setAns("")}
                        >
                          Remove
                        </button> */}
                            {/* <button className="btn btn-primary"  style={{ background: "#1161AB" }} onClick={()=>postDaily(hhData)}>UPLOAD</button> */}
                          </div>
                          {/* <ProgressBar style={styles.progressBarBackgroundColor} /> */}
                        </>
                      )}
                    </CSVReader>
                    <button
                      className="btn btn-primary"
                      onClick={() => deleteCollection()}
                    >
                      DELETE
                    </button>
                  </div>
                </div>
              </div>
      ) : loading ? (
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
          <h6 style={{ color: "#1161AB" }}>Processing file, please wait!!</h6>
        </div>
      ) : (
        <Navigate to="/tabs" />

      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    daily: state.demo.daily,
    loading: state.demo.loading,
    postSuccess: state.demo.postSuccess,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateHhData: (data) => dispatch(setHhData(data)),
    updateInitialHhDump: (data) => dispatch(setInitialHhDump(data)),
    updateFilteredMpan: (mpan) => dispatch(updateMpan(mpan)),
    postDaily: (daily) => dispatch(postDaily(daily)),
    getDaily: () => dispatch(getDaily()),
    deleteCollection: () => dispatch(deleteCollection()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
