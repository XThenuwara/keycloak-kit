
import React from "react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";


export interface TemplateSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    trigger: React.ReactNode;
    title: string;
    description: string;
    action: React.ReactNode;
}

const TemplateSidebar = React.forwardRef<HTMLDivElement, TemplateSidebarProps>(({ className,...props }, ref) => {
    const { trigger, title, description, children, action } = props;

    return (
      <Sheet modal>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          {children}
          <SheetFooter>
            <SheetClose asChild>{action}</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
});


export default TemplateSidebar;