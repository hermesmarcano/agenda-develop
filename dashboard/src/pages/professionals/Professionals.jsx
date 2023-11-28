import React, { useState, useContext, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Popup from "../../components/Popup";
import RegisterProfessional from "./components/RegisterProfessional";
import { FaEdit, FaSearch, FaUserTie } from "react-icons/fa";
import UpdateProfessional from "./components/UpdateProfessional";
import { SidebarContext } from "../../context/SidebarContext";
import { DarkModeContext } from "../../context/DarkModeContext";
import instance from "../../axiosConfig/axiosConfig";
import Drawer from "../../components/Drawer";
import {
  AddButton,
  RemoveSelectedButton,
  titleDarkStyle,
  titleLightStyle,
} from "../../components/Styled";
import ProfessionalCard from "./components/ProfessionalCard";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import UpgradePlan from "../../components/upgeadePlan";

const Professionals = () => {
  const { t } = useTranslation();
  const { shopId } = useContext(SidebarContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [professionalsPerPage, setProfessionalsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [professionals, setProfessionals] = useState([]);
  const token = localStorage.getItem("ag_app_shop_token");
  const [registerModelState, setRegisterModelState] = useState(false);
  const [updateModelState, setUpdateModelState] = useState(false);
  const [selectiedProfessionalId, setSelectiedProfessionalId] = useState("");
  const [isDeleting, setDeleting] = useState(false);
  const [workingHours, setWorkingHours] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext);
  const [view, setView] = useState("table");
  const [professionalPlanCounter, setProfessionalPlanCounter] = useState(0);
  const [upgradePlan, setUpgradePlan] = useState(false);

  useEffect(() => {
    instance
      .get(`professionals/shop?shopId=${shopId}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setProfessionals([...response.data.data].reverse());
      })
      .catch((error) => console.error(error.message));
  }, [registerModelState, updateModelState, isDeleting]);

  useEffect(() => {
    instance
      .get("managers/id", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setWorkingHours(response.data.workingHours);
        console.log(response.data);
        setProfessionalPlanCounter(response.data?.plan?.professionals);
      });
  }, []);

  const filteredProfessionals = professionals.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(
    filteredProfessionals.length / professionalsPerPage
  );
  const lastProfessionalIndex = currentPage * professionalsPerPage;
  const firstProfessionalIndex = lastProfessionalIndex - professionalsPerPage;
  const currentProfessionals = filteredProfessionals.slice(
    firstProfessionalIndex,
    lastProfessionalIndex
  );
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleProfessionalsPerPageChange = (event) => {
    setProfessionalsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pagination = [];
  for (let i = 1; i <= totalPages; i++) {
    pagination.push(
      <button
        key={i}
        className={`${
          currentPage === i
            ? "bg-gray-200 text-gray-700"
            : "bg-gray-100 text-gray-600"
        } px-4 py-2 mx-1 rounded-md`}
        onClick={() => handlePageClick(i)}
      >
        {i}
      </button>
    );
  }

  const [selectedIds, setSelectedIds] = useState([]);

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === currentProfessionals.length) {
      setSelectedIds([]);
    } else {
      const allIds = currentProfessionals.map(
        (professional) => professional._id
      );
      setSelectedIds(allIds);
    }
  };

  const handleRemoveSelected = () => {
    selectedIds.forEach((id) => {
      instance
        .delete(`professionals/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setDeleting(false);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const handleCancel = () => {
    setDeleting(false);
  };

  const handleProfessionalActiveState = () => {};

  const handleSelectProfessional = (profId) => {
    if (selectedIds.includes(profId)) {
      const filteredIds = selectedIds.filter(
        (selectedId) => selectedId !== profId
      );
      setSelectedIds(filteredIds);
    } else {
      setSelectedIds((prev) => [...prev, profId]);
    }
  };

  function getCurrentLanguage() {
    return i18next.language || "en";
  }

  return (
    <>
      <Drawer
        modelState={updateModelState}
        setModelState={setUpdateModelState}
        title={t("Update Professional")}
        children={
          <UpdateProfessional
            setModelState={setUpdateModelState}
            professionalId={selectiedProfessionalId}
            workingHours={workingHours}
          />
        }
      />
      <Popup
        isOpen={upgradePlan}
        onClose={() => setUpgradePlan(!upgradePlan)}
        children={<UpgradePlan />}
      />
      <div className="p-6 overflow-y-auto h-full">
        <div className={isDarkMode ? titleDarkStyle : titleLightStyle}>
          <div className="flex items-center justify-center">
            <FaUserTie className="mr-2 text-xl" />
            <span>{t("Professionals")}</span>
          </div>
        </div>
        <div className="relative w-full">
          <label className="sr-only" htmlFor="search">
            {" "}
            {t("Search")}{" "}
          </label>

          <input
            className="h-10 w-full rounded-lg border-none bg-white pe-10 ps-4 text-sm shadow-sm outline-teal-600"
            id="search"
            type="search"
            placeholder={t("Search professional...")}
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />

          <span className="absolute end-1 top-1/2 -translate-y-1/2 rounded-md bg-gray-100 p-2 text-gray-600 transition hover:text-gray-700">
            <span className="sr-only">{t("Search")}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
        <div className="flex items-center my-4">
          <AddButton
            counter={professionalPlanCounter || 0}
            onClick={() => {professionalPlanCounter > 0 ? setRegisterModelState(true) : setUpgradePlan(true)}}
          />
          <Drawer
            modelState={registerModelState}
            setModelState={setRegisterModelState}
            title={"Register Professional"}
            children={
              <RegisterProfessional
                setModelState={setRegisterModelState}
                workingHours={workingHours}
                professionalPlanCounter={professionalPlanCounter}
                setProfessionalPlanCounter={setProfessionalPlanCounter}
              />
            }
          />
          <RemoveSelectedButton
            onClick={() => setDeleting(true)}
            disabled={selectedIds.length === 0}
          />
          <Popup
            isOpen={isDeleting}
            onClose={() => setDeleting(!isDeleting)}
            children={
              <div className="bg-white rounded-md p-4 flex justify-center items-center">
                <p className="text-gray-700">
                  {t("Are you sure you want to delete the selected items?")}
                </p>
                <div className="flex mt-4">
                  <button
                    className="ml-2 bg-red-500 hover:bg-red-700 text-white text-sm font-semibold py-2 px-4 rounded"
                    onClick={handleRemoveSelected}
                  >
                    {t("Confirm")}
                  </button>
                  <button
                    className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold py-2 px-4 rounded"
                    onClick={handleCancel}
                  >
                    {t("Cancel")}
                  </button>
                </div>
              </div>
            }
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="mb-6">
            <label
              htmlFor="clients-per-page"
              className="mr-4 font-medium text-sm"
            >
              {t("Show")}:
            </label>
            <select
              id="clients-per-page"
              className={`border border-gray-300 rounded px-2 py-1 mr-4 text-sm ${
                isDarkMode
                  ? "bg-gray-500 text-white"
                  : "bg-gray-50 text-gray-500"
              }`}
              value={professionalsPerPage}
              onChange={handleProfessionalsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className={`${isDarkMode ? "text-white" : "text-gray-600"}`}>
              {`${firstProfessionalIndex + 1}-${Math.min(
                lastProfessionalIndex,
                filteredProfessionals.length
              )} ${t("of")} ${filteredProfessionals.length}`}
            </span>
          </div>
          <div className="flex rounded shadow">
            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-l ${
                isDarkMode
                  ? view === "cards"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-800 text-white"
                  : view === "cards"
                  ? "bg-teal-100 text-gray-600"
                  : "bg-white text-gray-600"
              } transition hover:bg-gray-50 hover:text-gray-700`}
              onClick={() => setView("cards")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
            </button>

            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-r ${
                isDarkMode
                  ? view === "table"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-800 text-white"
                  : view === "table"
                  ? "bg-teal-100 text-gray-600"
                  : "bg-white text-gray-600"
              } transition hover:bg-gray-50 hover:text-gray-700`}
              onClick={() => setView("table")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {view === "table" ? (
            <table
              className={`w-full table-auto border ${
                isDarkMode
                  ? "border-gray-700 divide-gray-700"
                  : "border-gray-200 divide-gray-200"
              }`}
            >
              <thead>
                <tr
                  className={`text-xs uppercase tracking-wider ${
                    isDarkMode
                      ? "bg-gray-500 text-gray-800"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  <th className="py-3 pl-4 text-start">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === currentProfessionals.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-3 pl-2 text-left">{t("Name")}</th>
                  <th className="py-3 px-4 text-center">{t("Office Hours")}</th>
                  <th className="py-3 pl-2 pr-6 text-left">
                    {t("Description")}
                  </th>
                  <th className="py-3 pr-6 text-center">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white"
                }`}
              >
                {currentProfessionals.map((professional, index) => (
                  <tr
                    key={professional.name}
                    className="border-b border-gray-300  text-xs"
                  >
                    <td className="py-2 pl-4 text-start">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(professional._id)}
                        onChange={() => handleCheckboxChange(professional._id)}
                      />
                    </td>
                    <td className="py-2 px-3 text-left">{professional.name}</td>
                    <td className="py-2 pl-2 text-center">
                      {professional.officeHours &&
                        professional.officeHours?.length > 0 &&
                        professional.officeHours?.map((officeHour) => {
                          return (
                            <span className="block" key={officeHour._id}>
                              {new Intl.DateTimeFormat(getCurrentLanguage(), {
                                timeStyle: "short",
                              }).format(
                                new Date().setHours(officeHour?.startHour, 0)
                              ) +
                                " - " +
                                new Intl.DateTimeFormat(getCurrentLanguage(), {
                                  timeStyle: "short",
                                }).format(
                                  new Date().setHours(officeHour?.endHour, 0)
                                )}
                            </span>
                          );
                        })}
                    </td>
                    <td className="py-2 pl-2">{professional.description}</td>
                    <td className="py-2 text-center pr-4">
                      <button
                        className="text-teal-500 hover:text-teal-700"
                        onClick={() => {
                          setUpdateModelState(!updateModelState);
                          setSelectiedProfessionalId(professional._id);
                        }}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <>
              <div
                className={`w-full ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } mb-2 py-2 pl-4 flex justify-start items-center rounded-md shadow`}
              >
                <label className="font-semibold mr-2">{t("Select All")}</label>
                <input
                  type="checkbox"
                  checked={selectedIds.length === currentProfessionals.length}
                  onChange={handleSelectAll}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {currentProfessionals.map((professional, index) => {
                  return (
                    <button
                      key={[professional._id]}
                      onClick={() => handleSelectProfessional(professional._id)}
                    >
                      <ProfessionalCard
                        key={professional._id}
                        professional={professional}
                        selectedIds={selectedIds}
                        handleCheckboxChange={handleCheckboxChange}
                        handleProfessionalActiveState={
                          handleProfessionalActiveState
                        }
                        updateModelState={updateModelState}
                        setUpdateModelState={setUpdateModelState}
                        setSelectiedProfessionalId={setSelectiedProfessionalId}
                      />
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {professionals.length === 0 && (
            <div className="flex flex-col items-center justify-center w-full mt-4">
              <div className="text-center">
                <FaSearch className="mx-auto text-gray-500 text-5xl mb-4" />
                <p className="text-gray-800 text-lg mb-2">
                  {t("No professionals found")}
                </p>
                <p className="text-gray-500 text-sm">
                  {t(
                    "We couldn't find any professionals that match your search"
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <div className="flex">
            <button
              className={`${
                currentPage === 1
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-300"
              } px-4 py-2 mx-1 rounded-md`}
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
            {pagination}
            <button
              className={`${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-300"
              } px-4 py-2 mx-1 rounded-md`}
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Professionals;
