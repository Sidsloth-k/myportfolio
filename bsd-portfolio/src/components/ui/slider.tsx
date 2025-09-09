"use client";

import * as React from "react";

const Slider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Slider.displayName = "Slider";

export { Slider };
