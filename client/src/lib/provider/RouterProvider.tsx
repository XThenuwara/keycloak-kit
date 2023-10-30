import React from "react";
import { HashRouter } from "react-router-dom";

const RouterProvider = (props: any) => {
  return <HashRouter>{props.children}</HashRouter>;
};

export default RouterProvider;
