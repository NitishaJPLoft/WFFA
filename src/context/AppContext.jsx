import React, { createContext, useState } from 'react';

export const AppContext = createContext(); // create context
export const AppContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [isNightMode, setIsNightMode] = useState(
    !!localStorage.getItem('nightmode')
  );
  const [isAuth, setIsAuth] = useState(false);
  const [siteID, setSiteID] = useState(null);
  const [appID, setAppID] = useState(null);
  const [user, setUser] = useState({});
  const [userType, setUserType] = useState({});
  const [activeApp, setActiveApp] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  // create context object
  const context = {
    isAuthenticated,
    setIsAuthenticated,
    isNightMode,
    setIsNightMode,
    activeApp,
    setActiveApp,
    activeMenu,
    setActiveMenu,
    isAuth,
    setIsAuth,
    siteID,
    setSiteID,
    appID,
    setAppID,
    user,
    setUser,
    userType,
    setUserType,
  };
  // create provider
  const AppContextProvider = AppContext.Provider;
  return (
    <AppContextProvider value={{ ...context }}>
      {props.children}
    </AppContextProvider>
  );
};
