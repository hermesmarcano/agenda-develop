import { FaPlus, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { AiOutlineFileAdd, AiOutlineFileSync } from "react-icons/ai";
import "./Styled.css";

const AddButton = ({ onClick, disabled }) => {
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-teal-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-teal-500"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <FaPlus />
      </span>
      <span className="pr-2">Add</span>
    </button>
  );
};

const SaveButton = ({ onClick, disabled }) => {
  return (
    <button
      type="submit"
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-teal-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-teal-500"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <FaPlus />
      </span>
      <span className="pr-2">Add</span>
    </button>
  );
};

const AddButtonWithTitle = ({ onClick, disabled, children }) => {
  return (
    <button
      className="w-full group relative inline-flex items-center overflow-hidden rounded bg-teal-600 px-4 py-1 text-white focus:outline-none focus:ring active:bg-teal-500"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <FaPlus />
      </span>
      <span className="pr-2">{children}</span>
    </button>
  );
};


const RemoveSelectedButton = ({ onClick, disabled }) => {
  return (
    <button
      className={`mx-1 group relative inline-flex items-center overflow-hidden rounded ${
        disabled ? "bg-red-400" : "bg-red-700"
      } px-8 py-3 text-white ${
        !disabled && "focus:outline-none focus:ring active:bg-red-600"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {!disabled && (
        <span className="absolute -end-full transition-all group-hover:end-4">
          <FaTrashAlt />
        </span>
      )}
      <span className="pr-2">Remove Selected</span>
    </button>
  );
};

const RegisterButton = ({ onClick, disabled }) => {
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-teal-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-teal-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <AiOutlineFileAdd />
      </span>
      <span className="pr-2">Register</span>
    </button>
  );
};

const UpdateButton = ({ onClick, disabled }) => {
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-teal-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-teal-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <AiOutlineFileSync />
      </span>
      <span className="pr-2">Update</span>
    </button>
  );
};

const LoadingRegisterButton = ({ onClick, disabled, isRegistering }) => {
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-teal-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-teal-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      {isRegistering ? (
        <span className="flex items-center justify-center">
          <FaSpinner className="animate-spin mr-2" />
          Registering...
        </span>
      ) : (
        <>
          <span className="absolute -end-full transition-all group-hover:end-4">
            <AiOutlineFileAdd />
          </span>
          <span className="pr-2">Register</span>
        </>
      )}
    </button>
  );
};


const LoadingUpdateButton = ({ onClick, disabled, isUpdating }) => {
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-teal-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-teal-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      {isUpdating ? (
        <span className="flex items-center justify-center">
          <FaSpinner className="animate-spin mr-2" />
          Updating...
        </span>
      ) : (
        <>
          <span className="absolute -end-full transition-all group-hover:end-4">
          <AiOutlineFileSync />
          </span>
          <span className="pr-2">Update</span>
        </>
      )}
    </button>
  );
};

const LoadingUploadButton = ({ onClick, disabled, isUploading }) => {
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-teal-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-teal-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      {isUploading ? (
        <span className="flex items-center justify-center">
          <FaSpinner className="animate-spin mr-2" />
          uploading...
        </span>
      ) : (
        <>
          <span className="absolute -end-full transition-all group-hover:end-4">
            <AiOutlineFileAdd />
          </span>
          <span className="pr-2">Upload</span>
        </>
      )}
    </button>
  );
};

const Hourglass = () => {
  return (
    <div className="hourglassBackground">
      <div className="hourglassContainer">
        <div className="hourglassCurves"></div>
        <div className="hourglassCapTop"></div>
        <div className="hourglassGlassTop"></div>
        <div className="hourglassSand"></div>
        <div className="hourglassSandStream"></div>
        <div className="hourglassCapBottom"></div>
        <div className="hourglassGlass"></div>
      </div>
    </div>
  );
};

const DefaultInputLightStyle =
  "w-full rounded-lg border border-gray-400 text-gray-800 bg-white p-3 text-sm";
const DefaultInputDarkStyle =
  "w-full rounded-lg bg-gray-600 outline-teal-600 p-3 text-sm";

const IconInputLightStyle =
  "w-full rounded-lg border border-gray-400 text-gray-800 bg-white p-3 pl-7 text-sm";
const IconInputDarkStyle =
  "w-full rounded-lg bg-gray-600 outline-teal-600 p-3 pl-7 text-sm";

const titleLightStyle = `text-2xl font-bold mb-5 text-center bg-white px-6 py-4 rounded-md shadow`;

const titleDarkStyle = `text-2xl font-bold mb-5 text-center bg-gray-800 text-white" px-6 py-4 rounded-md shadow`;

export {
  AddButton,
  AddButtonWithTitle,
  SaveButton,
  RemoveSelectedButton,
  RegisterButton,
  UpdateButton,
  LoadingRegisterButton,
  LoadingUploadButton,
  LoadingUpdateButton,
  Hourglass,
  DefaultInputDarkStyle,
  DefaultInputLightStyle,
  IconInputLightStyle,
  IconInputDarkStyle,
  titleLightStyle,
  titleDarkStyle,
};
