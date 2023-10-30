import React from "react";
import { bottomLinks, links } from "../lib/routerData";
import ReactIcon from "../assets/keycloak.png";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="relative z-30 flex h-full flex-col bg-layer-2 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Logo */}
        <div className="mt-5 h-8 flex-shrink-0 px-4 text-heading">
          <img src={ReactIcon} alt="" />
        </div>
        <div className="mt-5 space-y-1 px-1 sm:px-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                to={link.path}
                className={"text-text hover:bg-layer-3 hover:text-heading group relative flex items-center rounded-xl px-2 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-heading/80"}>
                <Icon className="mr-3 h-6 w-6 flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
      <div className="mb-2 space-y-1 px-1 sm:px-2">
        {bottomLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              to={link.path}
              className={
                "bg-layer-3 text-heading text-text hover:bg-layer-3 hover:text-heading group relative flex items-center rounded-xl px-2 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-heading/80"
              }>
              <Icon className="mr-3 h-6 w-6 flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
