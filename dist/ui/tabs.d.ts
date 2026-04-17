import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
declare const Tabs: React.ForwardRefExoticComponent<TabsPrimitive.TabsProps & React.RefAttributes<HTMLDivElement>>;
declare function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>): import("react/jsx-runtime").JSX.Element;
declare function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
export { Tabs, TabsList, TabsTrigger, TabsContent };
//# sourceMappingURL=tabs.d.ts.map