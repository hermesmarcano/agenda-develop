import { createContext, useState, useEffect } from "react";
import instance from "../axiosConfig/axiosConfig";

const Section1Context = createContext();

const Section1ContextWrapper = ({ children }) => {
  const [section1Data, setSection1Data] = useState({
    title: "Lorem Ipsum",
    image: "https://via.placeholder.com/600x400",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consequat lorem id congue dignissim. Sed vitae diam euismod, bibendum tortor eu, ultrices velit. Nullam in eros sit amet nisi luctus laoreet. Curabitur varius pharetra ex, ac mattis nibh commodo et. Integer laoreet mauris at convallis lacinia. Donec posuere augue a lacinia faucibus. Suspendisse potenti. Aenean semper velit velit, nec fringilla ex interdum eu. Proin ullamcorper, enim ac egestas euismod, augue justo tristique justo, non posuere libero enim non orci. Sed ut magna aliquam, volutpat tellus id, rhoncus tellus. In vulputate quis elit ut dapibus. Cras mollis erat vel justo auctor, vel interdum tellus dignissim. In at turpis pharetra, malesuada diam vel, elementum elit. Integer sollicitudin augue nec sapien luctus, eget vestibulum sem dictum. Fusce rutrum nisl id turpis maximus congue. Sed vel augue vitae nibh gravida lobortis vel at ipsum.",
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await instance.get("admin");
      if (response.data.admin.section1Data) {
        setSection1Data((prev) => (response.data.admin.section1Data))
        if(response.data.admin.section1Data.image === null || response.data.admin.section1Data.image === ""){
          setSection1Data((prev) => ({...prev, image: "https://via.placeholder.com/600x400"}))
        }
      }
    } catch (error) {
      console.log(error);
    }    
  };

  const contextValue = {
    section1Data,
    setSection1Data,
  };

  return (
    <Section1Context.Provider value={contextValue}>
      {children}
    </Section1Context.Provider>
  );
};

export { Section1Context, Section1ContextWrapper };
