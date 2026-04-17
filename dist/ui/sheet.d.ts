import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
declare const Sheet: React.FC<SheetPrimitive.DialogProps>;
declare const SheetTrigger: React.ForwardRefExoticComponent<SheetPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare const SheetClose: React.ForwardRefExoticComponent<SheetPrimitive.DialogCloseProps & React.RefAttributes<HTMLButtonElement>>;
declare const SheetPortal: React.FC<SheetPrimitive.DialogPortalProps>;
declare function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>): import("react/jsx-runtime").JSX.Element;
declare const sheetVariants: (props?: ({
    side?: "top" | "bottom" | "left" | "right" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface SheetContentProps extends React.ComponentProps<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {
}
declare function SheetContent({ side, className, children, ...props }: SheetContentProps): import("react/jsx-runtime").JSX.Element;
declare function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
declare function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
declare function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>): import("react/jsx-runtime").JSX.Element;
declare function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription, };
//# sourceMappingURL=sheet.d.ts.map