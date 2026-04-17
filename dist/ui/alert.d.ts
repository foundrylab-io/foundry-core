import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const alertVariants: (props?: ({
    variant?: "default" | "destructive" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Alert({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>): import("react/jsx-runtime").JSX.Element;
declare function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>): import("react/jsx-runtime").JSX.Element;
declare function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>): import("react/jsx-runtime").JSX.Element;
export { Alert, AlertTitle, AlertDescription };
//# sourceMappingURL=alert.d.ts.map