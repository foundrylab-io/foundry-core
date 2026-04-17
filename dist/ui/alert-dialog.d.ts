import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
declare const AlertDialog: React.FC<AlertDialogPrimitive.AlertDialogProps>;
declare const AlertDialogTrigger: React.ForwardRefExoticComponent<AlertDialogPrimitive.AlertDialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const AlertDialogPortal: React.FC<AlertDialogPrimitive.AlertDialogPortalProps>;
declare function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Action>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>): import("react/jsx-runtime").JSX.Element;
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel, };
//# sourceMappingURL=alert-dialog.d.ts.map