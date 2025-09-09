"use client";

import * as React from "react";

const Popover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Popover.displayName = "Popover";

export { Popover };
