import React, { useState, useRef } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import config from "../config";

const FileExplorer: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgreess, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB chunks

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        console.log("Selected file:", file.name, "Size:", file.size, "Type:", file.type);
        setUploadedFile(file);
      } else {
        console.log("No file selected");
      }
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
    }
  };


  const uploadFile = async () => {
    if (!uploadedFile) return;
    const organization = localStorage.getItem("organization");
    if (!organization) return;
    try {      
      const blobServiceClient = new BlobServiceClient(config.api.azure_storage_connection_string);
      console.log("BlobServiceClient created");
      
      const containerClient = blobServiceClient.getContainerClient(organization);
      console.log("ContainerClient created");
      
      const blockBlobClient = containerClient.getBlockBlobClient(uploadedFile.name);
      console.log("BlockBlobClient created");

      const totalSize = uploadedFile.size;
      let uploadedSize = 0;
      const blockList: string[] = [];

      for (let i = 0; i < totalSize; i += CHUNK_SIZE) {
        const chunk = uploadedFile.slice(i, Math.min(i + CHUNK_SIZE, totalSize));
        // const blockId = btoa(String(i)).replace(/=/g, '');
        console.log(`Uploading chunk ${i / CHUNK_SIZE + 1}`);
        // await blockBlobClient.stageBlock(blockId, chunk, chunk.size);
        // blockList.push(blockId);

        await blockBlobClient.uploadData(chunk, {
          blockSize: CHUNK_SIZE,
          onProgress: (progress) => {
            uploadedSize += progress.loadedBytes;
            console.log(`Uploaded ${uploadedSize} of ${totalSize} bytes`);
          }
        });
        
        // uploadedSize += chunk.size;
        setUploadProgress((uploadedSize / totalSize) * 100);
      }

      console.log("All chunks uploaded, committing block list");
      await blockBlobClient.commitBlockList(blockList);

      console.log("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="file-explorer  w-full mx-auto bg-cyan-100 p-8 rounded-lg shadow-md overflow-hidden">
      {/* <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Your File Explorer</h1> */}
      
      <div className="upload-section mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Upload your data</h2>
        
        <div className="upload-area bg-blue-50 p-6 rounded-lg border border-blue-300 text-center mb-6 flex flex-col items-center">
          <p className="text-lg text-gray-600 mb-4">Drag and drop your file here, or</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>
        </div>

        {uploadedFile && (
          <div className="uploaded-file-info bg-gray-100 p-4 rounded-lg flex items-center mb-6">
            <span className="mr-3 text-blue-500">📄</span>
            <span className="flex-grow">{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
            <button
              className="ml-auto text-red-500 hover:text-red-700 transition duration-200"
              onClick={handleRemoveFile}
            >
              ×
            </button>
          </div>
        )}

        {uploadedFile && (
          <div className="upload-progress flex items-center mt-4">
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-lg mr-4 hover:bg-green-700 transition duration-200"
              onClick={uploadFile}
            >
              Upload
            </button>
            {uploadProgreess > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-blue-600 h-full text-white text-center text-sm leading-6"
                  style={{ width: `${uploadProgreess}%` }}
                >
                  {uploadProgreess.toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default FileExplorer;
