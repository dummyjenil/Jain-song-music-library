import React, { useState } from "react";
import { X, Download } from "lucide-react";

interface DownloadAlertProps {
  onClose: () => void;
  onDownload: (format: string) => void;
}

const DownloadAlert: React.FC<DownloadAlertProps> = ({ onClose, onDownload }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Select Download Format</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={20} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <button
            onClick={() => onDownload("MP3")}
            className="w-full text-center py-2 px-4 border border-gray-300 rounded-md text-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          >
            MP3
          </button>
          <button
            onClick={() => onDownload("OPUS")}
            className="w-full text-center py-2 px-4 border border-gray-300 rounded-md text-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none"
          >
            OPUS
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadAlert;
