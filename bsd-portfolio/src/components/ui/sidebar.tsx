"use client";

import * as React from "react";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Sidebar.displayName = "Sidebar";

export { Sidebar };
