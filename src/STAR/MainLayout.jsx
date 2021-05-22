import React from "react";
import { withRouter } from "react-router";

function MainLayout({ children }) {
  return (
    <>
      <div>{children}</div>
    </>
  );
}

export default withRouter(MainLayout);
