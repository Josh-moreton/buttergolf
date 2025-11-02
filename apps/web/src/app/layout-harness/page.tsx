'use client'

import {
  Row,
  Column,
  Container,
  Spacer,
  Card,
  Button,
  Text,
  Heading,
  Badge,
  Input,
  Spinner,
} from '@buttergolf/ui'

export default function LayoutHarnessPage() {
  return (
    <Column fullWidth backgroundColor="$background" minHeight="100vh">
      {/* Page Header */}
      <Container maxWidth="xl" padding="lg">
        <Column gap="md" fullWidth>
          <Heading level={1}>Layout Harness - Tamagui v4</Heading>
          <Text color="secondary">
            Testing all layout components with semantic variants and tokens
          </Text>
        </Column>
      </Container>

      {/* Test Section 1: Row Component */}
      <Container maxWidth="xl" padding="lg">
        <Card variant="elevated" padding="lg" fullWidth>
          <Column gap="md" fullWidth>
            <Heading level={2}>Row Component</Heading>
            
            <Column gap="sm" fullWidth>
              <Text weight="semibold">Gap variants:</Text>
              <Row gap="xs" wrap>
                <Badge variant="primary">xs gap</Badge>
                <Badge variant="primary">xs gap</Badge>
                <Badge variant="primary">xs gap</Badge>
              </Row>
              <Row gap="sm" wrap>
                <Badge variant="secondary">sm gap</Badge>
                <Badge variant="secondary">sm gap</Badge>
                <Badge variant="secondary">sm gap</Badge>
              </Row>
              <Row gap="md" wrap>
                <Badge variant="success">md gap</Badge>
                <Badge variant="success">md gap</Badge>
                <Badge variant="success">md gap</Badge>
              </Row>
              <Row gap="lg" wrap>
                <Badge variant="info">lg gap</Badge>
                <Badge variant="info">lg gap</Badge>
                <Badge variant="info">lg gap</Badge>
              </Row>
            </Column>

            <Column gap="sm" fullWidth>
              <Text weight="semibold">Alignment variants:</Text>
              <Row gap="md" align="start" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>align="start"</Text>
                <Text size="xl">Large</Text>
                <Text size="sm">small</Text>
              </Row>
              <Row gap="md" align="center" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>align="center"</Text>
                <Text size="xl">Large</Text>
                <Text size="sm">small</Text>
              </Row>
              <Row gap="md" align="end" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>align="end"</Text>
                <Text size="xl">Large</Text>
                <Text size="sm">small</Text>
              </Row>
            </Column>

            <Column gap="sm" fullWidth>
              <Text weight="semibold">Justify variants:</Text>
              <Row gap="md" justify="between" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>justify="between"</Text>
                <Text>middle</Text>
                <Text>end</Text>
              </Row>
              <Row gap="md" justify="around" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>justify="around"</Text>
                <Text>middle</Text>
                <Text>end</Text>
              </Row>
              <Row gap="md" justify="evenly" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>justify="evenly"</Text>
                <Text>middle</Text>
                <Text>end</Text>
              </Row>
            </Column>
          </Column>
        </Card>
      </Container>

      {/* Test Section 2: Column Component */}
      <Container maxWidth="xl" padding="lg">
        <Card variant="elevated" padding="lg" fullWidth>
          <Column gap="md" fullWidth>
            <Heading level={2}>Column Component</Heading>
            
            <Row gap="lg" wrap fullWidth>
              <Column gap="xs" borderWidth={1} borderColor="$border" padding="md" flex={1}>
                <Text weight="semibold">gap="xs"</Text>
                <Badge variant="primary">Item 1</Badge>
                <Badge variant="primary">Item 2</Badge>
                <Badge variant="primary">Item 3</Badge>
              </Column>
              
              <Column gap="sm" borderWidth={1} borderColor="$border" padding="md" flex={1}>
                <Text weight="semibold">gap="sm"</Text>
                <Badge variant="secondary">Item 1</Badge>
                <Badge variant="secondary">Item 2</Badge>
                <Badge variant="secondary">Item 3</Badge>
              </Column>
              
              <Column gap="md" borderWidth={1} borderColor="$border" padding="md" flex={1}>
                <Text weight="semibold">gap="md"</Text>
                <Badge variant="success">Item 1</Badge>
                <Badge variant="success">Item 2</Badge>
                <Badge variant="success">Item 3</Badge>
              </Column>
              
              <Column gap="lg" borderWidth={1} borderColor="$border" padding="md" flex={1}>
                <Text weight="semibold">gap="lg"</Text>
                <Badge variant="info">Item 1</Badge>
                <Badge variant="info">Item 2</Badge>
                <Badge variant="info">Item 3</Badge>
              </Column>
            </Row>

            <Column gap="sm" fullWidth>
              <Text weight="semibold">Alignment variants:</Text>
              <Column gap="xs" align="start" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>align="start"</Text>
                <Badge variant="primary">Badge</Badge>
              </Column>
              <Column gap="xs" align="center" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>align="center"</Text>
                <Badge variant="secondary">Badge</Badge>
              </Column>
              <Column gap="xs" align="end" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>align="end"</Text>
                <Badge variant="success">Badge</Badge>
              </Column>
            </Column>
          </Column>
        </Card>
      </Container>

      {/* Test Section 3: Container Component */}
      <Container maxWidth="xl" padding="lg">
        <Card variant="elevated" padding="lg" fullWidth>
          <Column gap="md" fullWidth>
            <Heading level={2}>Container Component</Heading>
            <Text color="secondary">Shows max-width constraints with different sizes</Text>
            
            <Column gap="sm" fullWidth>
              <Container maxWidth="sm" padding="sm">
                <Card variant="filled" padding="sm" fullWidth>
                  <Text>maxWidth="sm" (640px)</Text>
                </Card>
              </Container>
              
              <Container maxWidth="md" padding="sm">
                <Card variant="filled" padding="sm" fullWidth>
                  <Text>maxWidth="md" (768px)</Text>
                </Card>
              </Container>
              
              <Container maxWidth="lg" padding="sm">
                <Card variant="filled" padding="sm" fullWidth>
                  <Text>maxWidth="lg" (1024px)</Text>
                </Card>
              </Container>
              
              <Container maxWidth="xl" padding="sm">
                <Card variant="filled" padding="sm" fullWidth>
                  <Text>maxWidth="xl" (1280px)</Text>
                </Card>
              </Container>
            </Column>
          </Column>
        </Card>
      </Container>

      {/* Test Section 4: Spacer Component */}
      <Container maxWidth="xl" padding="lg">
        <Card variant="elevated" padding="lg" fullWidth>
          <Column gap="md" fullWidth>
            <Heading level={2}>Spacer Component</Heading>
            
            <Column gap="sm" fullWidth>
              <Text weight="semibold">Flexible spacer (flex=true, default):</Text>
              <Row gap="md" fullWidth borderWidth={1} borderColor="$border" padding="sm">
                <Text>Left</Text>
                <Spacer />
                <Text>Right</Text>
              </Row>
            </Column>

            <Column gap="sm" fullWidth>
              <Text weight="semibold">Fixed size spacers:</Text>
              <Row gap="none" fullWidth borderWidth={1} borderColor="$border" padding="sm" align="center">
                <Text>xs</Text>
                <Spacer size="xs" flex={false} />
                <Text>|</Text>
                <Spacer size="sm" flex={false} />
                <Text>sm</Text>
                <Spacer size="md" flex={false} />
                <Text>md</Text>
                <Spacer size="lg" flex={false} />
                <Text>lg</Text>
              </Row>
            </Column>
          </Column>
        </Card>
      </Container>

      {/* Test Section 5: Card Compound Components */}
      <Container maxWidth="xl" padding="lg">
        <Card variant="elevated" fullWidth>
          <Card.Header padding="md">
            <Heading level={2}>Card Compound Components</Heading>
          </Card.Header>
          
          <Card.Body padding="md">
            <Column gap="md" fullWidth>
              <Text>
                Testing the compound component pattern with Card.Header, Card.Body, and Card.Footer.
              </Text>
              
              <Row gap="md" wrap fullWidth>
                <Card variant="outlined" padding="none" style={{ minWidth: 280 }}>
                  <Card.Header padding="sm">
                    <Text weight="bold">Outlined Card</Text>
                  </Card.Header>
                  <Card.Body padding="sm">
                    <Text size="sm">Body content here</Text>
                  </Card.Body>
                  <Card.Footer padding="sm" align="right">
                    <Button size="sm" tone="outline">Action</Button>
                  </Card.Footer>
                </Card>

                <Card variant="filled" padding="none" style={{ minWidth: 280 }}>
                  <Card.Header padding="sm">
                    <Text weight="bold">Filled Card</Text>
                  </Card.Header>
                  <Card.Body padding="sm">
                    <Text size="sm">Body content here</Text>
                  </Card.Body>
                  <Card.Footer padding="sm" align="right">
                    <Button size="sm" tone="primary">Action</Button>
                  </Card.Footer>
                </Card>

                <Card variant="ghost" padding="none" style={{ minWidth: 280 }}>
                  <Card.Header padding="sm" noBorder>
                    <Text weight="bold">Ghost Card</Text>
                  </Card.Header>
                  <Card.Body padding="sm">
                    <Text size="sm">Body content here</Text>
                  </Card.Body>
                  <Card.Footer padding="sm" align="right" noBorder>
                    <Button size="sm" tone="ghost">Action</Button>
                  </Card.Footer>
                </Card>
              </Row>
            </Column>
          </Card.Body>
          
          <Card.Footer padding="md" align="center">
            <Text size="sm" color="muted">
              All card variants working correctly with compound components
            </Text>
          </Card.Footer>
        </Card>
      </Container>

      {/* Test Section 6: Form Layout Example */}
      <Container maxWidth="xl" padding="lg">
        <Card variant="elevated" padding="lg" fullWidth>
          <Column gap="lg" fullWidth>
            <Heading level={2}>Form Layout Example</Heading>
            
            <Column gap="md" fullWidth>
              <Column gap="xs" fullWidth>
                <Row gap="xs" align="center">
                  <Text weight="semibold">Email</Text>
                  <Text color="error">*</Text>
                </Row>
                <Input
                  placeholder="Enter your email"
                  size="md"
                  fullWidth
                />
              </Column>
              
              <Column gap="xs" fullWidth>
                <Row gap="xs" align="center">
                  <Text weight="semibold">Password</Text>
                  <Text color="error">*</Text>
                </Row>
                <Input
                  placeholder="Enter your password"
                  secureTextEntry
                  size="md"
                  fullWidth
                />
              </Column>
              
              <Row gap="md" justify="between" align="center" fullWidth>
                <Text size="sm" color="muted">
                  All fields are required
                </Text>
                <Row gap="sm">
                  <Button size="md" tone="outline">
                    Cancel
                  </Button>
                  <Button size="md" tone="primary">
                    Submit
                  </Button>
                </Row>
              </Row>
            </Column>
          </Column>
        </Card>
      </Container>

      {/* Test Section 7: Responsive Layout */}
      <Container maxWidth="xl" padding="lg">
        <Card variant="elevated" padding="lg" fullWidth>
          <Column gap="md" fullWidth>
            <Heading level={2}>Responsive Layout (Media Queries)</Heading>
            <Text color="secondary">
              These layouts adapt based on screen size using $gtSm, $gtMd breakpoints
            </Text>
            
            <Row
              gap="md"
              wrap
              fullWidth
            >
              <Card variant="filled" padding="md" flex={1} style={{ minWidth: 250 }}>
                <Column gap="sm">
                  <Badge variant="primary">Card 1</Badge>
                  <Text size="sm">
                    This card will stack on mobile and sit side-by-side on larger screens
                  </Text>
                </Column>
              </Card>
              
              <Card variant="filled" padding="md" flex={1} style={{ minWidth: 250 }}>
                <Column gap="sm">
                  <Badge variant="secondary">Card 2</Badge>
                  <Text size="sm">
                    Flex layout automatically handles wrapping when space is constrained
                  </Text>
                </Column>
              </Card>
              
              <Card variant="filled" padding="md" flex={1} style={{ minWidth: 250 }}>
                <Column gap="sm">
                  <Badge variant="success">Card 3</Badge>
                  <Text size="sm">
                    Test by resizing your browser window to see the responsive behavior
                  </Text>
                </Column>
              </Card>
            </Row>
          </Column>
        </Card>
      </Container>

      {/* Test Section 8: Loading State */}
      <Container maxWidth="xl" padding="lg">
        <Card variant="elevated" padding="lg" fullWidth>
          <Column gap="md" align="center" fullWidth>
            <Heading level={2}>Loading States</Heading>
            <Row gap="lg" align="center">
              <Column gap="sm" align="center">
                <Spinner size="small" />
                <Text size="sm">Small</Text>
              </Column>
              <Column gap="sm" align="center">
                <Spinner size="large" />
                <Text size="sm">Large</Text>
              </Column>
            </Row>
          </Column>
        </Card>
      </Container>

      {/* Bottom Spacing */}
      <Spacer size="xl" flex={false} />
    </Column>
  )
}
