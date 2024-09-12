import React, { createContext } from "react";
import { Toaster } from "react-hot-toast";

const AppContext = createContext(null);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppContext.Provider value={null}>
      {children} <Toaster position="bottom-center" />
    </AppContext.Provider>
  );
};

export default AppProvider;
