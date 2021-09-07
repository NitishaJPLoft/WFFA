import React, { createContext, useState } from 'react';

export const SystemContext = createContext(); // create context
export const SystemContextProvider = props => {
  const [activeApp, setActiveApp] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  // create context object
  const context = {
    activeApp,
    setActiveApp,
    activeMenu,
    setActiveMenu,
  };

  // create provider
  const SystemContextProvider = SystemContext.Provider;
  return (
    <SystemContextProvider value={{ ...context }}>
      {props.children}
    </SystemContextProvider>
  );
};
