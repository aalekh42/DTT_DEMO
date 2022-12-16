import React, { useEffect, useState } from "react";
import { JsonToTable } from "react-json-to-table";

function Table({ hhData }) {
  console.log("HhData=", hhData); //hhData here is array containing multiple arrays
  const [hhJson, setHHjson] = useState("");

  useEffect(() => {
    convertCsvToJson(hhData);
  }, [hhData]);

  const convertCsvToJson = (hhData) => {
    var temp = hhData && hhData.slice(1);
    var hhDataJson =
      temp &&
      temp?.map((elem) => ({
        Mpan: elem[0],
        FromDateTime: elem[1],
        Value: elem[2],
      }));
    setHHjson(hhDataJson);
  };
  return (
    <div className="table table-container container-fluid">
      <div className="row">
        <div className="col-12">
          <h2>Aggregated View</h2>
          <JsonToTable json={hhJson} />
        </div>
      </div>
    </div>
  );
}

export default Table;
