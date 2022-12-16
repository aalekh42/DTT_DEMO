import React, { useState } from "react";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

export default function ExportContainer() {
  const [file, setFile] = useState("");

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const uploadFile = async () => {
    //let storageAccountName = "dttdevuks001";
    // let sasToken =
    //   "?sv=2021-06-08&ss=b&srt=sco&sp=rwlaciytfx&se=2022-11-24T15:10:58Z&st=2022-11-24T07:10:58Z&spr=https&sig=6ZQ6Ilsx1bTEH641pVZefG%2BZGIRTx4hiwNdLfHX%2FA4c%3D";
    let storageAccountName = "ddtstorage";
    let sasToken="sp=racwdli&st=2022-11-30T11:42:58Z&se=2022-11-30T19:42:58Z&sip=0.0.0.0&spr=https&sv=2021-06-08&sr=c&sig=WFTNVqUz0tXqEvGy9K%2BO%2BSUOdI5Rg3VVZI2ko1K2rX4%3D"
    const blobService = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );

    //get Container -full public read access
    const ContainerClient = blobService.getContainerClient("frontend");
    await ContainerClient.createIfNotExists({
      access: "container",
    });

    //create blob client for container
    const blobClient = ContainerClient.getBlockBlobClient(file.name);

    //set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.type } };

    //upload file
    await blobClient.uploadBrowserData(file, options);
  };
  return (<>
    <div>Upload to Blob</div>
    <div>
        <input onChange={()=>onFileChange} type="file"></input>
        <button onClick={()=>uploadFile()}>Upload</button>
    </div>
    </>)
}
