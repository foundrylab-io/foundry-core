"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
import { cn } from "../lib/utils.js";
function ScrollArea({ className, children, ...props }) {
    return (_jsxs(ScrollAreaPrimitive.Root, { className: cn("relative overflow-hidden", className), ...props, children: [_jsx(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children: children }), _jsx(ScrollBar, {}), _jsx(ScrollAreaPrimitive.Corner, {})] }));
}
function ScrollBar({ className, orientation = "vertical", ...props }) {
    return (_jsx(ScrollAreaPrimitive.ScrollAreaScrollbar, { orientation: orientation, className: cn("flex touch-none select-none transition-colors", orientation === "vertical" &&
            "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" &&
            "h-2.5 flex-col border-t border-t-transparent p-[1px]", className), ...props, children: _jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" }) }));
}
export { ScrollArea, ScrollBar };
//# sourceMappingURL=scroll-area.js.map