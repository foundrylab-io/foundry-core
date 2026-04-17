"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "../lib/utils.js";
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
    return (_jsx(SeparatorPrimitive.Root, { decorative: decorative, orientation: orientation, className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className), ...props }));
}
export { Separator };
//# sourceMappingURL=separator.js.map