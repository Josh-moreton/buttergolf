/**
 * UI Test Page
 *
 * A demo page showcasing all components from @buttergolf/ui-web.
 * This page uses ONLY the new Tailwind-based components, no Tamagui.
 *
 * Visit: http://localhost:3000/ui-test
 */

import {
  Button,
  Text,
  Heading,
  Label,
  Input,
  Textarea,
  Card,
  Badge,
  Row,
  Column,
  Container,
  Spacer,
  Divider,
  Spinner,
} from "@buttergolf/ui-web";

export default function UITestPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <Container size="xl" padding="lg">
        <Column gap="3xl">
          {/* Header */}
          <Column gap="md" align="center">
            <Heading level={1}>ButterGolf UI Web</Heading>
            <Text size="lg" color="secondary">
              A demonstration of all components from @buttergolf/ui-web
            </Text>
            <Row gap="sm">
              <Badge variant="success">Tailwind CSS</Badge>
              <Badge variant="info">React 19</Badge>
              <Badge variant="primary">Web Only</Badge>
            </Row>
          </Column>

          <Divider />

          {/* Typography Section */}
          <Card variant="outlined" padding="lg">
            <Column gap="lg">
              <Heading level={2}>Typography</Heading>

              <Column gap="md">
                <Heading level={3}>Headings</Heading>
                <Heading level={1}>Heading Level 1</Heading>
                <Heading level={2}>Heading Level 2</Heading>
                <Heading level={3}>Heading Level 3</Heading>
                <Heading level={4}>Heading Level 4</Heading>
                <Heading level={5}>Heading Level 5</Heading>
                <Heading level={6}>Heading Level 6</Heading>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Text Sizes</Heading>
                <Text size="xs">Extra Small Text (11px)</Text>
                <Text size="sm">Small Text (13px)</Text>
                <Text size="base">Base Text (14px) - Default</Text>
                <Text size="md">Medium Text (15px)</Text>
                <Text size="lg">Large Text (16px)</Text>
                <Text size="xl">Extra Large Text (18px)</Text>
                <Text size="2xl">2XL Text (20px)</Text>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Text Weights</Heading>
                <Text weight="normal">Normal weight text</Text>
                <Text weight="medium">Medium weight text</Text>
                <Text weight="semibold">Semibold weight text</Text>
                <Text weight="bold">Bold weight text</Text>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Text Colors</Heading>
                <Text color="default">Default color (primary text)</Text>
                <Text color="secondary">Secondary color (muted)</Text>
                <Text color="primary">Primary color (brand)</Text>
                <Text color="success">Success color</Text>
                <Text color="error">Error color</Text>
              </Column>
            </Column>
          </Card>

          {/* Buttons Section */}
          <Card variant="outlined" padding="lg">
            <Column gap="lg">
              <Heading level={2}>Buttons</Heading>

              <Column gap="md">
                <Heading level={3}>Button Variants</Heading>
                <Row gap="md" wrap>
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Button Sizes</Heading>
                <Row gap="md" align="center" wrap>
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Button States</Heading>
                <Row gap="md" align="center" wrap>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button fullWidth>Full Width</Button>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Button with Icons</Heading>
                <Row gap="md" wrap>
                  <Button
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    }
                  >
                    Add Item
                  </Button>
                  <Button
                    variant="outline"
                    iconAfter={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    }
                  >
                    Continue
                  </Button>
                </Row>
              </Column>
            </Column>
          </Card>

          {/* Form Components Section */}
          <Card variant="outlined" padding="lg">
            <Column gap="lg">
              <Heading level={2}>Form Components</Heading>

              <Column gap="md">
                <Heading level={3}>Input Sizes</Heading>
                <Row gap="md" wrap align="end">
                  <Column gap="xs" className="flex-1 min-w-[200px]">
                    <Label>Small Input</Label>
                    <Input size="sm" placeholder="Small size" />
                  </Column>
                  <Column gap="xs" className="flex-1 min-w-[200px]">
                    <Label>Medium Input</Label>
                    <Input size="md" placeholder="Medium size (default)" />
                  </Column>
                  <Column gap="xs" className="flex-1 min-w-[200px]">
                    <Label>Large Input</Label>
                    <Input size="lg" placeholder="Large size" />
                  </Column>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Input States</Heading>
                <Row gap="md" wrap align="start">
                  <Column gap="xs" className="flex-1 min-w-[200px]">
                    <Label>Default</Label>
                    <Input placeholder="Default input" />
                  </Column>
                  <Column gap="xs" className="flex-1 min-w-[200px]">
                    <Label>Error State</Label>
                    <Input
                      error
                      placeholder="Error input"
                      helperText="This field is required"
                    />
                  </Column>
                  <Column gap="xs" className="flex-1 min-w-[200px]">
                    <Label>Success State</Label>
                    <Input
                      success
                      placeholder="Success input"
                      helperText="Looking good!"
                    />
                  </Column>
                  <Column gap="xs" className="flex-1 min-w-[200px]">
                    <Label>Disabled</Label>
                    <Input disabled placeholder="Disabled input" />
                  </Column>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Input with Icons</Heading>
                <Row gap="md" wrap>
                  <Column gap="xs" className="flex-1 min-w-[250px]">
                    <Label>Search</Label>
                    <Input
                      placeholder="Search..."
                      startIcon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      }
                    />
                  </Column>
                  <Column gap="xs" className="flex-1 min-w-[250px]">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      endIcon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      }
                    />
                  </Column>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Textarea</Heading>
                <Column gap="xs">
                  <Label>Description</Label>
                  <Textarea placeholder="Enter a description..." />
                </Column>
                <Column gap="xs">
                  <Label>Error State</Label>
                  <Textarea
                    error
                    placeholder="Error textarea"
                    helperText="Please provide more details"
                  />
                </Column>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Labels</Heading>
                <Row gap="lg" wrap>
                  <Label>Standard Label</Label>
                  <Label required>Required Label</Label>
                  <Label disabled>Disabled Label</Label>
                </Row>
              </Column>
            </Column>
          </Card>

          {/* Cards Section */}
          <Card variant="outlined" padding="lg">
            <Column gap="lg">
              <Heading level={2}>Cards</Heading>

              <Row gap="lg" wrap>
                <Card variant="elevated" className="flex-1 min-w-[280px]">
                  <Card.Header>
                    <Heading level={4}>Elevated Card</Heading>
                  </Card.Header>
                  <Card.Body>
                    <Text>
                      This card has a shadow for depth. It's great for
                      highlighting important content.
                    </Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button size="sm">Learn More</Button>
                  </Card.Footer>
                </Card>

                <Card variant="outlined" className="flex-1 min-w-[280px]">
                  <Card.Header>
                    <Heading level={4}>Outlined Card</Heading>
                  </Card.Header>
                  <Card.Body>
                    <Text>
                      This card has a border instead of shadow. Ideal for
                      grouping related content.
                    </Text>
                  </Card.Body>
                  <Card.Footer align="right">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Card.Footer>
                </Card>

                <Card variant="filled" className="flex-1 min-w-[280px]">
                  <Card.Header noBorder>
                    <Heading level={4}>Filled Card</Heading>
                  </Card.Header>
                  <Card.Body>
                    <Text>
                      A subtle filled background with no shadow. Clean and
                      minimal.
                    </Text>
                  </Card.Body>
                  <Card.Footer noBorder align="center">
                    <Button size="sm" variant="ghost">
                      Dismiss
                    </Button>
                  </Card.Footer>
                </Card>
              </Row>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Interactive Card</Heading>
                <Card variant="outlined" interactive className="max-w-md">
                  <Card.Body>
                    <Row gap="md" align="center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        BG
                      </div>
                      <Column gap="xs">
                        <Text weight="semibold">ButterGolf Pro</Text>
                        <Text size="sm" color="secondary">
                          Click to select this plan
                        </Text>
                      </Column>
                      <Spacer />
                      <Badge variant="primary">$29/mo</Badge>
                    </Row>
                  </Card.Body>
                </Card>
              </Column>
            </Column>
          </Card>

          {/* Badges Section */}
          <Card variant="outlined" padding="lg">
            <Column gap="lg">
              <Heading level={2}>Badges</Heading>

              <Column gap="md">
                <Heading level={3}>Badge Variants</Heading>
                <Row gap="sm" wrap>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="neutral">Neutral</Badge>
                  <Badge variant="outline">Outline</Badge>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Badge Sizes</Heading>
                <Row gap="sm" align="center">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Dot Badges</Heading>
                <Row gap="md" align="center">
                  <Row gap="sm" align="center">
                    <Badge variant="success" dot />
                    <Text>Online</Text>
                  </Row>
                  <Row gap="sm" align="center">
                    <Badge variant="warning" dot />
                    <Text>Away</Text>
                  </Row>
                  <Row gap="sm" align="center">
                    <Badge variant="error" dot />
                    <Text>Offline</Text>
                  </Row>
                </Row>
              </Column>
            </Column>
          </Card>

          {/* Layout Section */}
          <Card variant="outlined" padding="lg">
            <Column gap="lg">
              <Heading level={2}>Layout Components</Heading>

              <Column gap="md">
                <Heading level={3}>Row (Horizontal Layout)</Heading>
                <Row gap="md" className="p-4 bg-gray-200 rounded-md">
                  <div className="px-4 py-2 bg-primary text-white rounded">
                    Item 1
                  </div>
                  <div className="px-4 py-2 bg-primary text-white rounded">
                    Item 2
                  </div>
                  <div className="px-4 py-2 bg-primary text-white rounded">
                    Item 3
                  </div>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Row with Justify</Heading>
                <Row
                  gap="md"
                  justify="between"
                  className="p-4 bg-gray-200 rounded-md"
                >
                  <div className="px-4 py-2 bg-secondary text-white rounded">
                    Left
                  </div>
                  <div className="px-4 py-2 bg-secondary text-white rounded">
                    Center
                  </div>
                  <div className="px-4 py-2 bg-secondary text-white rounded">
                    Right
                  </div>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Column (Vertical Layout)</Heading>
                <Column gap="md" className="p-4 bg-gray-200 rounded-md">
                  <div className="px-4 py-2 bg-success text-white rounded">
                    Item 1
                  </div>
                  <div className="px-4 py-2 bg-success text-white rounded">
                    Item 2
                  </div>
                  <div className="px-4 py-2 bg-success text-white rounded">
                    Item 3
                  </div>
                </Column>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Spacer</Heading>
                <Row className="p-4 bg-gray-200 rounded-md">
                  <div className="px-4 py-2 bg-info text-white rounded">
                    Left
                  </div>
                  <Spacer />
                  <div className="px-4 py-2 bg-info text-white rounded">
                    Right (pushed by Spacer)
                  </div>
                </Row>
              </Column>
            </Column>
          </Card>

          {/* Feedback Section */}
          <Card variant="outlined" padding="lg">
            <Column gap="lg">
              <Heading level={2}>Feedback Components</Heading>

              <Column gap="md">
                <Heading level={3}>Spinner</Heading>
                <Row gap="lg" align="center">
                  <Column gap="xs" align="center">
                    <Spinner size="sm" />
                    <Text size="sm">Small</Text>
                  </Column>
                  <Column gap="xs" align="center">
                    <Spinner size="md" />
                    <Text size="sm">Medium</Text>
                  </Column>
                  <Column gap="xs" align="center">
                    <Spinner size="lg" />
                    <Text size="sm">Large</Text>
                  </Column>
                  <Column gap="xs" align="center">
                    <Spinner size="xl" />
                    <Text size="sm">XL</Text>
                  </Column>
                </Row>
              </Column>

              <Divider variant="subtle" />

              <Column gap="md">
                <Heading level={3}>Spinner Colors</Heading>
                <Row gap="lg" align="center">
                  <Column gap="xs" align="center">
                    <Spinner color="primary" />
                    <Text size="sm">Primary</Text>
                  </Column>
                  <Column gap="xs" align="center">
                    <Spinner color="secondary" />
                    <Text size="sm">Secondary</Text>
                  </Column>
                  <Column gap="xs" align="center">
                    <div className="p-2 bg-secondary rounded">
                      <Spinner color="white" />
                    </div>
                    <Text size="sm">White</Text>
                  </Column>
                </Row>
              </Column>
            </Column>
          </Card>

          {/* Footer */}
          <Column gap="md" align="center">
            <Text color="secondary">
              All components above are from @buttergolf/ui-web
            </Text>
            <Text size="sm" color="secondary">
              Built with React, TypeScript, and Tailwind CSS
            </Text>
          </Column>
        </Column>
      </Container>
    </main>
  );
}
