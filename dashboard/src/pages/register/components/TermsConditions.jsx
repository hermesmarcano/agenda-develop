import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DarkModeContext } from "../../../context/DarkModeContext";

const TermsConditions = ({ isOpen, onClose }) => {
  const {isDarkMode} = useContext(DarkModeContext);
  const { t } = useTranslation();

  return (
    <>
      {isOpen && (
        <div
          className={`fixed z-10 inset-0 overflow-y-auto max-w-[950px] max-h-[70%] my-auto rounded mx-auto`}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-gray-500 opacity-75"
              onClick={onClose}
            ></div>
            <div
              className={`rounded-lg shadow-xl p-3 overflow-auto relative w-11/12 md:w-1/2 lg:w-2/3  ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h1 className="text-2xl font-bold mb-4">
                {t("Preview your Terms & Conditions")}
              </h1>
              <h2 className="text-lg font-semibold mb-2">
                {t("Terms and Conditions")}
              </h2>
              <p className="text-base mb-4">{t("Welcome to icuts!")}</p>

              <p>
                {t(
                  "These terms and conditions outline the rules and regulations for the use of icuts's Website, located at www.icuts.net."
                )}
              </p>

              <p>
                {t(
                  "By accessing this website we assume you accept these terms and conditions. Do not continue to use icuts if you do not agree to take all of the terms and conditions stated on this page."
                )}
              </p>

              <p>
                {t(
                  "The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements:"
                )}
              </p>
              <p>
                <span className="font-semibold">{t("Client")}</span>,{" "}
                <span className="font-semibold">{t("You")}</span>, and{" "}
                <span className="font-semibold">{t("Your")}</span>{" "}
                {t(
                  "refers to you, the person log on this website and compliant to the Company's terms and conditions."
                )}
                . <br />
                <span className="font-semibold">{t("The Company")}</span>,{" "}
                <span className="font-semibold">{t("Ourselves")}</span>,{" "}
                <span className="font-semibold">{t("We")}</span>,{" "}
                <span className="font-semibold">{t("Our")}</span>, and{" "}
                <span className="font-semibold">{t("Us")}</span>{" "}
                {t("refers to our Company.")}. <br />
                <span className="font-semibold">{t("Party")}</span>,{" "}
                <span className="font-semibold">{t("Parties")}</span>, or{" "}
                <span className="font-semibold">{t("Us")}</span>{" "}
                {t(
                  "refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client's needs in respect of provision of the Company's stated services, in accordance with and subject to, prevailing law of es. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same."
                )}
                .
              </p>

              <h2 className="text-lg font-semibold mt-4">{t("Cookies")}</h2>

              <p>
                {t(
                  "We employ the use of cookies. By accessing icuts, you agreed to use cookies in agreement with the icuts's Privacy Policy."
                )}
              </p>

              <p>
                {t(
                  "Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies."
                )}
              </p>

              <h2 className="text-lg font-semibold mt-4">{t("License")}</h2>

              <p>
                {t(
                  "Unless otherwise stated, icuts and/or its licensors own the intellectual property rights for all material on icuts. All intellectual property rights are reserved. You may access this from icuts for your own personal use subjected to restrictions set in these terms and conditions."
                )}
              </p>

              <p className="font-semibold">{t("You must not:")}</p>
              <ul>
                <li>{t("Republish material from icuts")}</li>
                <li>{t("Sell, rent or sub-license material from icuts")}</li>
                <li>{t("Reproduce, duplicate or copy material from icuts")}</li>
                <li>{t("Redistribute content from icuts")}</li>
              </ul>

              <p>
                {t(
                  "This Agreement shall begin on the date hereof. Our Terms and Conditions were created with the help of the Free Terms and Conditions Generator."
                )}
              </p>

              <p>
                {t(
                  "Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. icuts does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of icuts, its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, icuts shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website."
                )}
              </p>

              <p>
                {t(
                  "icuts reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions."
                )}
              </p>

              <p className="font-semibold">
                {t("You warrant and represent that:")}
              </p>
              <ul>
                <li>
                  {t(
                    "You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;"
                  )}
                </li>
                <li>
                  {t(
                    "The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;"
                  )}
                </li>
                <li>
                  {t(
                    "The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy"
                  )}
                </li>
                <li>
                  {t(
                    "The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity."
                  )}
                </li>
              </ul>
              <p>
                {t(
                  "You hereby grant icuts a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media."
                )}
              </p>

              <h2 className="text-lg font-semibold mt-4">
                {t("Hyperlinking to our Content")}
              </h2>

              <p>
                {t(
                  "The following organizations may link to our Website without prior written approval:"
                )}
              </p>
              <ul>
                <li>{t("Government agencies;")}</li>
                <li>{t("Search engines;")}</li>
                <li>{t("News organizations;")}</li>
                <li>
                  {t(
                    "Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and"
                  )}
                </li>
                <li>
                  {t(
                    "System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site."
                  )}
                </li>
              </ul>
              <p>
                {t(
                  "These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site."
                )}
              </p>

              <p>
                {t(
                  "We may consider and approve other link requests from the following types of organizations:"
                )}
              </p>
              <ul>
                <li>
                  {t(
                    "commonly-known consumer and/or business information sources;"
                  )}
                </li>
                <li>{t("dot.com community sites;")}</li>
                <li>
                  {t("associations or other groups representing charities;")}
                </li>
                <li>{t("online directory distributors;")}</li>
                <li>{t("internet portals;")}</li>
                <li>{t("accounting, law and consulting firms; and")}</li>
                <li>{t("educational institutions and trade associations.")}</li>
              </ul>
              <p>
                {t(
                  "We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of icuts; and (d) the link is in the context of general resource information."
                )}
              </p>
              <p>
                {t(
                  "These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site."
                )}
              </p>
              <p>
                {t(
                  "If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to icuts. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response."
                )}
              </p>

              <p>
                {t(
                  "Approved organizations may hyperlink to our Website as follows:"
                )}
              </p>
              <ul>
                <li>{t("By use of our corporate name; or")}</li>
                <li>
                  {t(
                    "By use of the uniform resource locator being linked to; or"
                  )}
                </li>
                <li>
                  {t(
                    "By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party's site."
                  )}
                </li>
              </ul>
              <p className="font-semibold">
                {t(
                  "No use of icuts's logo or other artwork will be allowed for linking absent a trademark license agreement."
                )}
              </p>

              <h2 className="text-lg font-semibold mt-4">{t("iFrames")}</h2>

              <p>
                {t(
                  "Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website."
                )}
              </p>

              <h2 className="text-lg font-semibold mt-4">
                {t("Content Liability")}
              </h2>

              <p>
                {t(
                  "We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights."
                )}
              </p>

              <h2 className="text-lg font-semibold mt-4">
                {t("Reservation of Rights")}
              </h2>

              <p>
                {t(
                  "We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions."
                )}
              </p>

              <h2 className="text-lg font-semibold mt-4">
                {t("Removal of links from our website")}
              </h2>

              <p>
                {t(
                  "If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to do so or to respond to you directly."
                )}
              </p>

              <p>
                {t(
                  "We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date."
                )}
              </p>

              <h2 className="text-lg font-semibold mt-4">{t("Disclaimer")}</h2>

              <p>
                {t(
                  "To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:"
                )}
              </p>
              <ul>
                <li>
                  {t(
                    "limit or exclude our or your liability for death or personal injury;"
                  )}
                </li>
                <li>
                  {t(
                    "limit or exclude our or your liability for fraud or fraudulent misrepresentation;"
                  )}
                </li>
                <li>
                  {t(
                    "limit any of our or your liabilities in any way that is not permitted under applicable law; or"
                  )}
                </li>
                <li>
                  {t(
                    "exclude any of our or your liabilities that may not be excluded under applicable law."
                  )}
                </li>
              </ul>
              <p>
                {t(
                  "The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort, and for breach of statutory duty."
                )}
              </p>
              <p>
                {t(
                  "As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature."
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsConditions;
