import { createContext, useState } from "react";

const ProfessionalIdContext = createContext();

const ProfessionalIdContextWrapper = ({ children }) => {
  const [professionalId, setProfessionalId] = useState("");

  const contextValue = {
    professionalId,
    setProfessionalId,
  };

  return (
    <ProfessionalIdContext.Provider value={contextValue}>
      {children}
    </ProfessionalIdContext.Provider>
  );
};

export { ProfessionalIdContext, ProfessionalIdContextWrapper };
