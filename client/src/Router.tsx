import { RouterProvider, createBrowserRouter, createHashRouter } from "react-router-dom";
import { bottomLinks, links } from "./lib/routerData";


const routesObj = [
  ...links.map((link) => { 
    return {
      path: link.path,
      element: <link.element />,
    };
  }),
  ...bottomLinks.map((link) => {
    return {
      path: link.path,
      element: <link.element />,
    };
  }),
];
  
const router = createBrowserRouter(routesObj);

const Router = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default Router;