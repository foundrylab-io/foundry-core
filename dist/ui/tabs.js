"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "../lib/utils.js";
const Tabs = TabsPrimitive.Root;
function TabsList({ className, ...props }) {
    return (_jsx(TabsPrimitive.List, { className: cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className), ...props }));
}
function TabsTrigger({ className, ...props }) {
    return (_jsx(TabsPrimitive.Trigger, { className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm", className), ...props }));
}
function TabsContent({ className, ...props }) {
    return (_jsx(TabsPrimitive.Content, { className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className), ...props }));
}
export { Tabs, TabsList, TabsTrigger, TabsContent };
//# sourceMappingURL=tabs.js.map