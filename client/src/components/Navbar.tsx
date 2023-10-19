import { MenuAlt1Icon, MoonIcon } from "@heroicons/react/outline";
import React, { useContext, useState } from "react";
import PopoverSearch from "./PopoverSearch";
import { useTheme } from "../lib/provider/ThemeProvider";
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "@/components/ui/navigation-menu";
import AuthenticationDrawer from "./AuthenticationDrawer";
import { UserContext } from "../lib/provider/UserContextProvider";
import { Button } from "./ui/button";
import { NavSideBar } from "./NavSidebar";

const Navbar = () => {
  const {user} = useContext(UserContext)
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <nav className="relative z-20 flex h-16 flex-1  shrink-0 items-center space-x-2 bg-layer-2 px-4 bg-gray-50 dark:bg-gray-900 sm:px-6">
      <div className="flex items-center space-x-2 md:hidden">
        <div
          className="inline-flex cursor-pointer items-center justify-center rounded-xl border-none border-transparent bg-transparent p-2.5 font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text">
            <NavSideBar/>
        </div>
      </div>
      <div className="flex flex-1">
      
      </div>
      <div className="flex flex-shrink-0 items-center space-x-3">
        <div className="hidden md:block">
          <div className="flex flex-1 gap-i items-center gap-1">
            <Button className="text-md font-semibold dark:bg-background dark:text-back p-1 px-2 rounded-md">
          {user?.realm}
            </Button>
            <PopoverSearch />
            {/* <NavigationMenuComponent /> */}
          </div>
        </div>
        <button
          onClick={() => toggleTheme()}
          type="button"
          className="inline-flex hidden cursor-pointer items-center justify-center rounded-xl border-none border-transparent bg-transparent p-2.5 font-semibold text-text hover:bg-heading/5 hover:text-heading focus:bg-heading/5 focus:outline-none focus:ring-2 focus:ring-heading/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text sm:flex">
          <MoonIcon className="h-6 w-6" />
        </button>
        <AuthenticationDrawer />
      </div>
    </nav>
  );
};

const NavigationMenuComponent = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Documentation</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>Link</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};


export default Navbar;
