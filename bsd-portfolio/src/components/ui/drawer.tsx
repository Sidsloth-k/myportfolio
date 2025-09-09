"use client";

import * as React from "react";

const Drawer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Drawer.displayName = "Drawer";

export { Drawer };
