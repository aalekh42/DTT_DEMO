import React, { useState } from "react";
import * as XLSX from "xlsx";

function Upload() {
  const [items, setItems] = useState([]);
  const [mpan,setMpan] = useState([]);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const workBook = XLSX.read(bufferArray, { type: "buffer" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const data = XLSX.utils.sheet_to_json(workSheet);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((data) => {
      console.log(data);
      setItems(data,"Mpans",mpan);
    });
  };
  //console.log("Items", items.CurveCode);
  return (
    <div className="upload-container fluid-container">
      <div className="row">
        <div
          className="col-12"

        >
          <form>
            <input
              type="file"
              required
              style={{ border: "2px solid blue" }}
              onChange={(e) => {
                const file = e.target.files[0];
                readExcel(file);
              }}
            ></input>
            {/* <button className='btn btn-primary'>UPLOAD</button> */}
          </form>
        </div>
        {items?.map((item)=>{
          setMpan(item.CurveCode)//won't work
          return(

          console.log("Items=",item.CurveCode,"Mpans",mpan),
          <>
            <h2>item.CurveCode</h2>
          </>
        )})}
      </div>
    </div>
  );
}

export default Upload;
