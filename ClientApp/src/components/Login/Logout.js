import React, { useEffect, useState } from "react";
import { useAuthentication } from "../Authentication/Authentication";
import { useHistory } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "../Universal/LoadingIndicator";
import Loader from "react-loader-spinner";

const Logout = () => {
  const [error, setError] = useState("");
  const auth = useAuthentication();
  const history = useHistory();
  useEffect(() => {
    async function LogoutFunction() {
      try {
        await auth.signOut("/auth/logout");
        history.push("/login");
      } catch (error) {
        const response = error?.response;
        if (response && response.status === 400) {
          const identityErrors = response.data;
          const errorDescriptions = identityErrors.map((error) => error.description);
          setError(errorDescriptions.join(" "));
        } else {
          setError("Eroare la comunicarea cu serverul");
        }
      }
    }
    LogoutFunction();
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Loader type="ThreeDots" color="#1b6ec2" height="100" width="100" /> */}
    </div>
  );
};

export default Logout;
