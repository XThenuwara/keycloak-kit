import { HomeIcon, ChartSquareBarIcon, TrendingUpIcon, UsersIcon, CogIcon, LogoutIcon, BellIcon, MoonIcon, SearchIcon, MenuAlt1Icon, XIcon, UserIcon, PlusCircleIcon } from "@heroicons/react/outline";
import CreateUsersPage from "../pages/CreateUsersPage";
import HomePage from "../pages/HomePage";
import PageNotFound from "../components/PageNotFound";
import ViewUsersPage from "../pages/ViewUsersPage";
import { DashboardIcon } from "@radix-ui/react-icons";

export const links = [
  { label: "Home", icon: HomeIcon, path: "", children: null, element: HomePage },
  {
    label: "Create",
    icon: PlusCircleIcon,
    path: "/create",
    element: CreateUsersPage,
    children: null,
  },
  {
    label: "View",
    icon: UsersIcon,
    path: "/view",
    element: ViewUsersPage,
    children: null,
  },
];

export const bottomLinks = [
  {
    label: "Settings",
    icon: CogIcon,
    path: "#",
    element: CreateUsersPage,
    children: null,
  },
];
