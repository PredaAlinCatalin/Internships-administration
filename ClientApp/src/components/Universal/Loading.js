import React from "react";
import Loader from "react-loader-spinner";

const Loading = (props) => {
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
      <Loader type="ThreeDots" color="#1B6EC2" height="100" width="100" />
    </div>
  );
};

export default Loading;
