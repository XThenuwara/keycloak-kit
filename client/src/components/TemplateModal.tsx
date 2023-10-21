import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from "@/components/ui/dialog";

export interface TemplateModalProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  action: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'| '3xl' | '4xl' | '5xl' | '6xl';
}

const TemplateModal = React.forwardRef<HTMLDivElement, TemplateModalProps>(({ className, ...props }, ref) => {
  const { trigger, title, description, children, action, size = '3xl' } = props;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={`sm:max-w-${size} max-w-3xl `}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="sm:justify-start">
            {action}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default TemplateModal;
