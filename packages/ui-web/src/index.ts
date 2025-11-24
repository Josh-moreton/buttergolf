/**
 * ButterGolf UI Web Component Library
 *
 * A web-only component library built with React and Tailwind CSS.
 * Provides consistent, accessible, and themeable components for the Next.js web app.
 *
 * @example
 * ```tsx
 * import { Button, Text, Card, Input, Badge } from "@buttergolf/ui-web";
 *
 * function MyComponent() {
 *   return (
 *     <Card variant="elevated">
 *       <Card.Header>
 *         <Heading level={3}>Welcome</Heading>
 *       </Card.Header>
 *       <Card.Body>
 *         <Text>Enter your details below</Text>
 *         <Input placeholder="Email" />
 *       </Card.Body>
 *       <Card.Footer>
 *         <Button variant="primary">Submit</Button>
 *       </Card.Footer>
 *     </Card>
 *   );
 * }
 * ```
 */

// Utilities
export { cn } from "./utils/cn";

// Button Components
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";

// Typography Components
export { Text, Heading, Label } from "./components/Text";
export type { TextProps, HeadingProps, LabelProps } from "./components/Text";

// Form Components
export { Input, Textarea } from "./components/Input";
export type { InputProps, TextareaProps } from "./components/Input";

// Card Components
export { Card } from "./components/Card";
export type {
  CardProps,
  CardHeaderPropsType as CardHeaderProps,
  CardBodyPropsType as CardBodyProps,
  CardFooterPropsType as CardFooterProps,
} from "./components/Card";

// Badge Component
export { Badge } from "./components/Badge";
export type { BadgeProps } from "./components/Badge";

// Layout Components
export { Row, Column, Container, Spacer, Divider } from "./components/Layout";
export type {
  RowProps,
  ColumnProps,
  ContainerProps,
  SpacerProps,
  DividerProps,
} from "./components/Layout";

// Feedback Components
export { Spinner } from "./components/Spinner";
export type { SpinnerProps } from "./components/Spinner";
