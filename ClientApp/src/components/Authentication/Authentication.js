import React, { createContext, useContext, useState } from "react";

const UserRole = [
  "Student",
  "Company",
  "Admin"
]

const parseRole = (role) => {
  if (UserRole.find(x => x === role) !== undefined) {
    return role
  } else {
    throw new Error(`Nume sau parolă greșite`);
  }
};


const AuthenticationContext = createContext({
  user: undefined,
  signIn: () => {
    throw new Error();
  },
  signOut: () => {
    throw new Error();
  },
});

export const ProvideAuthentication = ({ children }) => {
  const auth = useProvideAuthentication();
  return (
    <AuthenticationContext.Provider value={auth}>
      {children}
    </AuthenticationContext.Provider>
  );
};

const useProvideAuthentication = () => {
  const [user, setUser] = useState(() => {

    const user = sessionStorage.getItem("user");

    if (user) {
      return JSON.parse(user);
    }
  });

  const signIn = async (email, password) => {
    const body = { email, password };
    const response = await fetch("api/Auth/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json()
    const id = data.userId;
    const role = parseRole(data.userRole);

    const user = { id, role };

    sessionStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  };

  const signOut = async () => {
    const response = await fetch("api/Auth/Logout", {
      method: "POST",
    });
    if (response.ok) {
      const user = undefined;
      sessionStorage.removeItem("user");
      setUser(user);
    }
  };

  return { user, signIn, signOut };
};

export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};

export const useIsStudent = () => {
  const auth = useAuthentication();
  return auth.user?.role === "Student";
};

export const useIsCompany = () => {
  const auth = useAuthentication();
  return auth.user?.role === "Company";
};

export const useIsAdmin = () => {
  const auth = useAuthentication();
  return auth.user?.role === "Admin";
};
