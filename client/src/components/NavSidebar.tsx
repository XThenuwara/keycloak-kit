import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuAlt1Icon } from "@heroicons/react/outline";
import { bottomLinks, links } from "../lib/routerData";
import ReactIcon from "../assets/keycloak.png";
import { Link } from "react-router-dom";

export function NavSideBar() {
  return (
    <Sheet modal>
      <SheetTrigger asChild>
        <MenuAlt1Icon className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Logo */}
          <div className="mt-5 h-8 flex-shrink-0 px-4 text-heading flex gap-2">
            <img src={ReactIcon} alt="" className="h-8 w-8" />
            <h3 className="text-xl font-medium">KeyCloak-Kit</h3>
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
                  {link.label}
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
                {link.label}
              </Link>
            );
          })}
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
