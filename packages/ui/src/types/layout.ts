/**
 * Layout Component Type Utilities
 *
 * Helper types and utilities for working with layout components (Row, Column, Container)
 * with full type safety and better developer experience.
 *
 * @example
 * ```tsx
 * import { LayoutComponent, FlexProps } from '@buttergolf/ui/types/layout'
 *
 * function MyComponent({ Layout }: { Layout: LayoutComponent }) {
 *   return <Layout gap="$md">{children}</Layout>
 * }
 * ```
 */

import type { ComponentType, ReactNode } from "react";
import type { RowProps, ColumnProps, ContainerProps } from "../components/Layout";

/**
 * Union type for all layout component props
 * Use this when you need to accept any layout component props
 */
export type LayoutProps = RowProps | ColumnProps | ContainerProps;

/**
 * Union type for Row and Column props specifically (excludes Container)
 * Use this when you need flex layout props only
 */
export type FlexLayoutProps = RowProps | ColumnProps;

/**
 * Type for components that can be used as layout containers
 * Use this when accepting layout components as props
 *
 * @example
 * ```tsx
 * function Card({ wrapper: Wrapper }: { wrapper: LayoutComponent }) {
 *   return <Wrapper gap="$md">{children}</Wrapper>
 * }
 * ```
 */
export type LayoutComponent<T extends LayoutProps = LayoutProps> = ComponentType<T>;

/**
 * Type for Row components specifically
 * Use when you need to ensure a Row component is passed
 */
export type RowComponent = ComponentType<RowProps>;

/**
 * Type for Column components specifically
 * Use when you need to ensure a Column component is passed
 */
export type ColumnComponent = ComponentType<ColumnProps>;

/**
 * Type for Container components specifically
 * Use when you need to ensure a Container component is passed
 */
export type ContainerComponent = ComponentType<ContainerProps>;

/**
 * Props for a component that renders children within a layout component
 *
 * @example
 * ```tsx
 * function Section({ children, layoutProps }: LayoutWrapperProps<RowProps>) {
 *   return <Row {...layoutProps}>{children}</Row>
 * }
 * ```
 */
export interface LayoutWrapperProps<T extends LayoutProps = LayoutProps> {
  children?: ReactNode;
  layoutProps?: T;
}

/**
 * Props for a generic layout component that can switch between Row/Column
 *
 * @example
 * ```tsx
 * function FlexContainer({ horizontal, children, ...props }: FlexContainerProps) {
 *   const Layout = horizontal ? Row : Column
 *   return <Layout {...props}>{children}</Layout>
 * }
 * ```
 */
export interface FlexContainerProps extends Omit<FlexLayoutProps, "flexDirection"> {
  horizontal?: boolean;
  children?: ReactNode;
}

/**
 * Common alignment values used across layout components
 */
export type Alignment = "start" | "center" | "end" | "stretch" | "baseline";

/**
 * Common justify values used across layout components
 */
export type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

/**
 * Helper type for components that accept gap spacing
 */
export interface GapProps {
  gap?: string; // Use tokens like "$xs", "$sm", "$md", "$lg", "$xl"
}

/**
 * Helper type for components that can be full width
 */
export interface FullWidthProps {
  fullWidth?: boolean;
}

/**
 * Helper type for components that can be full height
 */
export interface FullHeightProps {
  fullHeight?: boolean;
}

/**
 * Type guard to check if props are for a Row component
 */
export function isRowProps(props: LayoutProps): props is RowProps {
  return "flexDirection" in props && props.flexDirection === "row";
}

/**
 * Type guard to check if props are for a Column component
 */
export function isColumnProps(props: LayoutProps): props is ColumnProps {
  return "flexDirection" in props && props.flexDirection === "column";
}

/**
 * Type guard to check if props are for a Container component
 */
export function isContainerProps(props: LayoutProps): props is ContainerProps {
  return "maxWidth" in props;
}

/**
 * Utility type for extracting variant values from layout components
 * Useful when you need to work with variant values in a type-safe way
 */
export type LayoutVariant<
  T extends LayoutProps,
  K extends keyof T,
> = T[K] extends infer V ? V : never;

/**
 * Props for a responsive layout component
 * Allows different layouts for different breakpoints
 */
export interface ResponsiveLayoutProps {
  mobile?: LayoutComponent;
  tablet?: LayoutComponent;
  desktop?: LayoutComponent;
  children?: ReactNode;
}

/**
 * Type for layout component ref
 * Use when you need to forward refs to layout components
 */
export type LayoutRef = HTMLDivElement;

/**
 * Props for a layout component with ref forwarding
 */
export interface LayoutComponentWithRef<T extends LayoutProps = LayoutProps>
  extends LayoutWrapperProps<T> {
  ref?: React.Ref<LayoutRef>;
}
