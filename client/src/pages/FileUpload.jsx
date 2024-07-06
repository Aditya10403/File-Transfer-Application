// client/src/pages/FileUpload.jsx

import React, { useState } from "react";
import FileUploader from "../components/FileUploader";

const FileUpload = () => {
  const [downloadUrl, setDownloadUrl] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl sm:shadow-xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900">
                Upload File
              </h2>
              <FileUploader setDownloadUrl={setDownloadUrl} />
            </div>
            {downloadUrl && (
              <div className="mt-4">
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
