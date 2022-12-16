import axios from "axios";
import React, { useEffect, useState } from "react";
import { encodedToken, makeid, username } from "../utils/generic";
import "../css/home.css";
import { connect } from "react-redux";
import {
  deleteCollection,
  postTransformData,
  setFileName,
} from "../redux/actionCreators/Actions";
import { Navigate } from "react-router";
import { MoonLoader } from "react-spinners";
import { Buffer } from "buffer";

function UploadCsv({
  postTransformData,
  loading,
  postSuccess,
  conversionDone,
  setFileName,
  error,
  fileName
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);

  useEffect(() => {
    //deleteCollection(token);
  }, []);

  const handleUpload = () => {
    if (!isFilePicked) return;
    const formData = new FormData();
    formData.append("File", selectedFile);
    let id = makeid();
    const password = "./xqj5ddt0";
    const token = `${id}:${password}`;
    const encodedToken = Buffer.from(token).toString("base64");
    postTransformData(formData, encodedToken);
  };

  const fireDelCollecReq = () => {
    axios({
      url: "http://localhost:4000/dropCollecs",
      method: "delete",
      headers: { Authorization: "Basic " + encodedToken },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fileHandler = (e) => {
    setSelectedFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    e.target.files[0] && setIsFilePicked(true);
  };

  console.log("New", postSuccess,loading,conversionDone);
  return (
    <>
      {(!postSuccess && !loading)? (
        <div className="home-container fluid-container">
          <div className="row">
            <div className="col-12 home-heading">
              <h2>DATA TRANSFORMATION TOOL</h2>
            </div>
          </div>
          <div className="row">
            <div
              className="col-12"
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <input
                type="file"
                className="file-upload"
                name="csvInput"
                onChange={fileHandler}
              />
              <button
                className="btn btn-primary"
                onClick={handleUpload}
                style={{ background: "#1161AB", marginLeft: "5px" }}
                disabled={!selectedFile}
              >
                Upload
              </button>
              {/* <button
            className="btn btn-primary"
            style={{ background: "#1161AB" }}
            onClick={fireDelCollecReq}
          >
            Delete
          </button> */}
            </div>
            {error && (
              <div
                className="col-12"
                style={{ color: "red", textAlign: "center", fontWeight: "600" }}
              >
                <p>{error}</p>
              </div>
            )}
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
    loading: state.demo.loading,
    postSuccess: state.demo.postSuccess,
    token: state.demo.token,
    conversionDone: state.demo.conversionDone,
    error: state.demo.error,
    fileName:state.demo.fileName,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    postTransformData: (data, token) =>dispatch(postTransformData(data, token)),
    deleteCollection: (token) => dispatch(deleteCollection(token)),
    setFileName:(filename)=>dispatch(setFileName(filename)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadCsv);
