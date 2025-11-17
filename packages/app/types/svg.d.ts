/**
 * SVG module type declarations
 * Enables TypeScript to resolve .svg imports as React components
 */
declare module '*.svg' {
    import React from 'react';
    const content: React.FC<React.SVGProps<SVGSVGElement>>;
    export default content;
}
