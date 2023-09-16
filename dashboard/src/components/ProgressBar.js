import React from "react";
import { FaSpinner } from "react-icons/fa";

const ProgressBar = ({ progress }) => {
  return (
    <div>
      <span id="ProgressLabel" className="sr-only">
        Loading
      </span>

      <span
        role="progressbar"
        aria-labelledby="ProgressLabel"
        aria-valuenow={progress}
        className="block rounded-full bg-gray-200"
      >
        <span
          className="block h-3 rounded-full bg-[repeating-linear-gradient(45deg,_var(--tw-gradient-from)_0,_var(--tw-gradient-from)_20px,_var(--tw-gradient-to)_20px,_var(--tw-gradient-to)_40px)] from-teal-400 to-teal-600"
          style={{ width: `${progress}%` }}
        ></span>
      </span>
      {progress < 100 ? (
        <span className="block mt-2 text-center">
          {progress.toFixed(0)}%
        </span>
      ) : (
        <span className="block mt-2 text-center">
          <FaSpinner className="animate-spin mr-2" /> 100%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
