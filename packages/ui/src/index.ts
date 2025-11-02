/**
 * Butter Golf UI Component Library
 * 
 * A production-ready, cross-platform component library built on Tamagui.
 * Provides consistent, accessible, and themeable components for web and mobile.
 */

// Re-export all Tamagui primitives
export * from 'tamagui'
export * from '@tamagui/toast'

// Export configuration
export { config } from '@buttergolf/config'
export type { AppConfig } from '@buttergolf/config'

// Button Components
export { Button } from './components/Button'
export type { ButtonProps } from './components/Button'

// Typography Components
export { Text, Heading, Label } from './components/Text'
export type { TextProps, HeadingProps, LabelProps } from './components/Text'

// Layout Components (re-exports of Tamagui base components)
export { XStack, YStack, View } from './components/Layout'
export type { XStackProps, YStackProps, ViewProps } from './components/Layout'

// Card Components
export { Card, CardHeader, CardBody, CardFooter } from './components/Card'
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './components/Card'

// Form Components
export { Input } from './components/Input'
export type { InputProps } from './components/Input'

// Feedback Components
export { Badge } from './components/Badge'
export type { BadgeProps } from './components/Badge'
export { Spinner } from './components/Spinner'
export type { SpinnerProps } from './components/Spinner'

// Media Components
export { Image } from './components/Image'
export type { ImageProps } from './components/Image'
export { ScrollView } from './components/ScrollView'
export type { ScrollViewProps } from './components/ScrollView'
