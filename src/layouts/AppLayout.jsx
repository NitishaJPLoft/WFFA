import React, { useEffect, useState } from 'react';
import Header from './header/Header';

const AppLayout = props => {
  const [user, setUser] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (!isInitialized) {
      const data = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : {};

      setUser(data);
      setIsInitialized(true);
    }
  }, [isInitialized, setUser, setIsInitialized]);
  return (
    <React.Fragment>
      <Header user={user} />
      {props.children}
    </React.Fragment>
  );
};

export default AppLayout;
