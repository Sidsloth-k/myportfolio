"use client";

import * as React from "react";

const HoverCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
HoverCard.displayName = "HoverCard";

export { HoverCard };
