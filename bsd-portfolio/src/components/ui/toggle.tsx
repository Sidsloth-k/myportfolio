"use client";

import * as React from "react";

const Toggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={className} {...props} />
));
Toggle.displayName = "Toggle";

export { Toggle };
