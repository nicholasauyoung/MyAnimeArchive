import React, { useState } from 'react';

const LoginContext = React.createContext();

const useLoginContext = () => {
  const context = React.useContext(LoginContext);
  if (!context) {
    throw new Error('useLoginContext must be used within a LoginProvider');
  }
  return context;
};

const LoginProvider = props => {
  const [user, set_user] = useState("");
  const [is_logged_in, set_is_logged_in] = useState(false)

  return (
    <LoginContext.Provider
      value={{
        user,
        set_user,
        is_logged_in,
        set_is_logged_in
      }}
      {...props}
    />
  );
};

export { LoginProvider, useLoginContext };