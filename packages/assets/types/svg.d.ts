/**
 * SVG Module Declarations
 * Allows TypeScript to import .svg files as React components
 */
declare module "*.svg" {
  import React from "react";
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
