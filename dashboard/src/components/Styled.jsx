import { FaPlus, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { AiOutlineFileAdd, AiOutlineFileSync } from "react-icons/ai";
import { MdOutlineEditCalendar } from "react-icons/md";
import "./Styled.css";
import { useTranslation } from "react-i18next";

const AddButton = ({ onClick, disabled, counter }) => {
  const { t } = useTranslation();
  return (
    <div className="relative inline-block">
      <button
        className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-sky-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-500"
        onClick={onClick}
        disabled={disabled}
      >
        <span className="absolute -end-full transition-all group-hover:end-4">
          <FaPlus />
        </span>
        <span className="pr-2">{t("Add")}</span>
      </button>
      {counter >= 0 && (
        <span className="absolute w-7 h-7 z-10 top-1 right-3 inline-flex items-center justify-center font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-sky-900 rounded-full">
          {counter > 99 ? 99 : counter}
        </span>
      )}
    </div>
  );
};

const SaveButton = ({ onClick, disabled }) => {
  const { t } = useTranslation();
  return (
    <button
      type="submit"
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-sky-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-500"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <FaPlus />
      </span>
      <span className="pr-2">{t("Add")}</span>
    </button>
  );
};

const SubmitButton = ({ onClick, disabled }) => {
  const { t } = useTranslation();
  return (
    <button
      type="submit"
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-sky-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-500"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <MdOutlineEditCalendar />
      </span>
      <span className="pr-2">{t("Submit")}</span>
    </button>
  );
};

const AddButtonWithTitle = ({ onClick, disabled, children }) => {
  return (
    <button
      className="w-full group relative inline-flex items-center overflow-hidden rounded bg-sky-600 px-4 py-1 text-white focus:outline-none focus:ring active:bg-sky-500"
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
  const { t } = useTranslation();
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
      <span className="pr-2">{t("Remove Selected")}</span>
    </button>
  );
};

const RegisterButton = ({ onClick, disabled }) => {
  const { t } = useTranslation();
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-sky-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <AiOutlineFileAdd />
      </span>
      <span className="pr-2">{t("Register")}</span>
    </button>
  );
};

const UpdateButton = ({ onClick, disabled }) => {
  const { t } = useTranslation();
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-sky-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      <span className="absolute -end-full transition-all group-hover:end-4">
        <AiOutlineFileSync />
      </span>
      <span className="pr-2">{t("Update")}</span>
    </button>
  );
};

const LoadingRegisterButton = ({ onClick, disabled, isRegistering }) => {
  const { t } = useTranslation();
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-sky-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      {isRegistering ? (
        <span className="flex items-center justify-center">
          <FaSpinner className="animate-spin mr-2" />
          {t("Registering...")}
        </span>
      ) : (
        <>
          <span className="absolute -end-full transition-all group-hover:end-4">
            <AiOutlineFileAdd />
          </span>
          <span className="pr-2">{t("Register")}</span>
        </>
      )}
    </button>
  );
};

const LoadingUpdateButton = ({ onClick, disabled, isUpdating }) => {
  const { t } = useTranslation();
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-sky-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      {isUpdating ? (
        <span className="flex items-center justify-center">
          <FaSpinner className="animate-spin mr-2" />
          {t("Updating...")}
        </span>
      ) : (
        <>
          <span className="absolute -end-full transition-all group-hover:end-4">
            <AiOutlineFileSync />
          </span>
          <span className="pr-2">{t("Update")}</span>
        </>
      )}
    </button>
  );
};

const LoadingUploadButton = ({ onClick, disabled, isUploading }) => {
  const { t } = useTranslation();
  return (
    <button
      className="mx-1 group relative inline-flex items-center overflow-hidden rounded bg-sky-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-sky-500"
      onClick={onClick}
      disabled={disabled}
      type="submit"
    >
      {isUploading ? (
        <span className="flex items-center justify-center">
          <FaSpinner className="animate-spin mr-2" />
          {t("Uploading...")}
        </span>
      ) : (
        <>
          <span className="absolute -end-full transition-all group-hover:end-4">
            <AiOutlineFileAdd />
          </span>
          <span className="pr-2">{t("Upload")}</span>
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
  "w-full rounded-lg bg-gray-600 outline-sky-600 p-3 text-sm";

const SpecialInputLightStyle =
  "w-1/2 sm:w-14 py-2 px-2 text-center focus:outline-none rounded-lg border-none text-gray-800 bg-white text-sm";
const SpecialInputDarkStyle =
  "w-1/2 sm:w-14 py-2 px-2 text-center focus:outline-none rounded-lg bg-gray-700 outline-sky-600 text-sm";

const NoWidthInputLightStyle =
  "rounded-lg border-none text-gray-800 bg-white p-3 text-sm";
const NoWidthInputDarkStyle =
  "rounded-lg bg-gray-600 outline-sky-600 p-3 text-sm";

const IconInputLightStyle =
  "w-full rounded-lg border border-gray-400 text-gray-800 bg-white p-3 pl-7 text-sm";
const IconInputDarkStyle =
  "w-full rounded-lg bg-gray-600 outline-sky-600 p-3 pl-7 text-sm";

const titleLightStyle = `text-2xl font-bold mb-5 text-center bg-white px-6 py-4 rounded-md shadow`;

const titleDarkStyle = `text-2xl font-bold mb-5 text-center bg-gray-800 text-white" px-6 py-4 rounded-md shadow`;

const tapLightStyle = `text-lg font-bold mb-5 text-center bg-white px-6 py-4 rounded-md shadow flex justify-center items-center`;

const tapDarkStyle = `text-lg font-bold mb-5 text-center bg-gray-800 text-white" px-6 py-4 rounded-md shadow flex justify-center items-center`;

export {
  AddButton,
  AddButtonWithTitle,
  SaveButton,
  SubmitButton,
  RemoveSelectedButton,
  RegisterButton,
  UpdateButton,
  LoadingRegisterButton,
  LoadingUploadButton,
  LoadingUpdateButton,
  Hourglass,
  DefaultInputDarkStyle,
  DefaultInputLightStyle,
  SpecialInputDarkStyle,
  SpecialInputLightStyle,
  NoWidthInputDarkStyle,
  NoWidthInputLightStyle,
  IconInputLightStyle,
  IconInputDarkStyle,
  titleLightStyle,
  titleDarkStyle,
  tapLightStyle,
  tapDarkStyle
};
