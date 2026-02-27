import React, { createContext, useContext, useState } from "react";

const ApplicationContext = createContext();

export function ApplicationProvider({ children }) {
  const [applicationData, setApplicationData] = useState(null);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  return (
    <ApplicationContext.Provider value={{ 
      applicationData, 
      setApplicationData,
      currentAnalysis,
      setCurrentAnalysis
    }}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplicationContext() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplicationContext must be used within ApplicationProvider");
  }
  return context;
}
