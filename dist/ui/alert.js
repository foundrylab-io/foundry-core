import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils.js";
const alertVariants = cva("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function Alert({ className, variant, ...props }) {
    return (_jsx("div", { role: "alert", className: cn(alertVariants({ variant }), className), ...props }));
}
function AlertTitle({ className, ...props }) {
    return (_jsx("h5", { className: cn("mb-1 font-medium leading-none tracking-tight", className), ...props }));
}
function AlertDescription({ className, ...props }) {
    return (_jsx("div", { className: cn("text-sm [&_p]:leading-relaxed", className), ...props }));
}
export { Alert, AlertTitle, AlertDescription };
//# sourceMappingURL=alert.js.map