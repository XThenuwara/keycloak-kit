import { Route, RouterProvider, Routes, createBrowserRouter, createHashRouter } from "react-router-dom";
import { bottomLinks, links } from "./lib/routerData";

const routesObj = [
  ...links.map((link) => {
    return {
      path: link.path,
      element: link.element,
    };
  }),
  ...bottomLinks.map((link) => {
    return {
      path: link.path,
      element: link.element,
    };
  }),
];

const Router = () => {
  return (
    <Routes>
      {routesObj.map((route) => {
        return <Route key={route.path} path={route.path} Component={route.element} />;
      })}
    </Routes>
  );
};

export default Router;
