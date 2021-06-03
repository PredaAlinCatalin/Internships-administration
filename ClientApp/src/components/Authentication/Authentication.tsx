import React, { createContext, useContext, useState } from "react";

// Hook-based access to authentication state.
// Implementation based on https://usehooks.com/useAuth/

/**
 * User roles defined by the application
 */
export enum UserRole {
  Student = "Student",
  Company = "Company",
  Admin = "Admin",
}

/**
 * Converts a string to a role.
 *
 * Throws an error if string isn't a valid role.
 */
const parseRole = (role: string): UserRole => {
  if (role in UserRole) {
    return UserRole[role as keyof typeof UserRole];
  } else {
    throw new Error(`Nume sau parolă greșite`);
  }
};

/**
 * Information about the currently logged-in user.
 */
export type User = {
  id: string;
  role: UserRole;
};

type SignInFunction = (email: string, password: string) => Promise<void>;
type SignOutFunction = () => Promise<void>;

export type AuthenticationState = {
  /**
   * The logged-in user, if any.
   */
  user?: User;
  /**
   * Callback which asynchronously signs-in the user with
   * the given email and password combination.
   */
  signIn: SignInFunction;
  signOut: SignOutFunction;
};

const AuthenticationContext = createContext<AuthenticationState>({
  user: undefined,
  signIn: () => {
    throw new Error();
  },
  signOut: () => {
    throw new Error();
  },
});

export const ProvideAuthentication: React.FC = ({ children }) => {
  const auth = useProvideAuthentication();
  return (
    <AuthenticationContext.Provider value={auth}>
      {children}
    </AuthenticationContext.Provider>
  );
};

const useProvideAuthentication = () => {
  const [user, setUser] = useState<User | undefined>(() => {
    // On initialization, try to read the saved user data from session storage
    const user = sessionStorage.getItem("user");

    if (user) {
      return JSON.parse(user);
    }
  });

  const signIn: SignInFunction = async (email, password) => {
    const body = { email, password };
    const response = await fetch("api/Auth/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    type LoginResponse = {
      userId: string;
      userRole: string;
    };
    const data = (await response.json()) as LoginResponse;
    const id = data.userId;
    const role = parseRole(data.userRole);

    const user = { id, role };

    sessionStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  };

  const signOut: SignOutFunction = async () => {
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

/**
 * Hook returning the current authentication status.
 */
export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};

/**
 * Hook returning true if the current user is logged into a student account.
 */
export const useIsStudent = () => {
  const auth = useAuthentication();
  return auth.user?.role === UserRole.Student;
};

/**
 * Hook returning true if the current user is logged into a company account.
 */
export const useIsCompany = () => {
  const auth = useAuthentication();
  return auth.user?.role === UserRole.Company;
};

export const useIsAdmin = () => {
  const auth = useAuthentication();
  return auth.user?.role === UserRole.Admin;
};
