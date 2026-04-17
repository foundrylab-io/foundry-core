import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
declare const Popover: React.FC<PopoverPrimitive.PopoverProps>;
declare const PopoverTrigger: React.ForwardRefExoticComponent<PopoverPrimitive.PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>>;
declare function PopoverContent({ className, align, sideOffset, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
export { Popover, PopoverTrigger, PopoverContent };
//# sourceMappingURL=popover.d.ts.map