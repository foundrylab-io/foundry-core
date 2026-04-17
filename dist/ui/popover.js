"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Popover as PopoverPrimitive } from "radix-ui";
import { cn } from "../lib/utils.js";
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
function PopoverContent({ className, align = "center", sideOffset = 4, ...props }) {
    return (_jsx(PopoverPrimitive.Portal, { children: _jsx(PopoverPrimitive.Content, { align: align, sideOffset: sideOffset, className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className), ...props }) }));
}
export { Popover, PopoverTrigger, PopoverContent };
//# sourceMappingURL=popover.js.map