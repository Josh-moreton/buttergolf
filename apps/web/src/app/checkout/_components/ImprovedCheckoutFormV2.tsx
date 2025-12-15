"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Button,
  Card,
  Column,
  Row,
  Text,
  Heading,
  Image,
  Input,
  Spinner,
} from "@buttergolf/ui";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

interface CheckoutFormProps {
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
  };
}

interface ShippingRate {
  carrier: string;
  service: string;
  rate: string; // Price in cents
  rateDisplay: string; // Formatted price for display
  estimatedDays: number;
  deliveryDate?: string;
  id?: string; // EasyPost rate ID
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  street1: string;
  street2?: string;
  city: string;
  county: string; // UK: county instead of state
  postcode: string; // UK: postcode instead of zip
  country: string;
  phone?: string;
}

// UK postcode validation regex
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

function isValidUKPostcode(postcode: string): boolean {
  return UK_POSTCODE_REGEX.test(postcode.trim());
}

function formatUKPostcode(postcode: string): string {
  // Remove all spaces and convert to uppercase
  const cleaned = postcode.replace(/\s/g, "").toUpperCase();
  // Insert space before last 3 characters (UK format: SW1A 1AA)
  if (cleaned.length > 3) {
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
  }
  return cleaned;
}

// Form Label component
const FormLabel = ({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <Row gap="$xs" marginBottom="$xs">
    <Text size="$3" weight="medium" color="$text">
      {children}
    </Text>
    {required && <Text color="$error">*</Text>}
  </Row>
);

// Payment form component that uses Stripe Elements
function PaymentForm({
  product,
  selectedRate,
  onBack,
}: Readonly<{
  product: CheckoutFormProps["product"];
  selectedRate: ShippingRate;
  onBack: () => void;
}>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const calculateTotal = () => {
    const shippingCost = Number.parseInt(selectedRate.rate) / 100;
    return product.price + shippingCost;
  };

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment");
        setIsProcessing(false);
      } else {
        // Payment succeeded and Stripe is redirecting
        setIsRedirecting(true);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  // Show full-screen loading overlay during redirect
  if (isRedirecting) {
    return (
      <Card variant="outlined" padding="$xl">
        <Column gap="$lg" alignItems="center" paddingVertical="$xl">
          <Spinner size="lg" color="$primary" />
          <Column gap="$sm" alignItems="center">
            <Text size="$6" weight="semibold">
              Payment Successful!
            </Text>
            <Text color="$textSecondary" textAlign="center">
              Redirecting to your order confirmation...
            </Text>
          </Column>
        </Column>
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding="$lg">
      <Column gap="$lg">
        <Row justifyContent="space-between" alignItems="center">
          <Heading level={4}>Payment Details</Heading>
          <Button chromeless size="$3" onPress={onBack} disabled={isProcessing}>
            ← Edit Shipping
          </Button>
        </Row>

        <PaymentElement />

        {errorMessage && <Text color="$error">{errorMessage}</Text>}

        <Button
          size="$5"
          backgroundColor="$primary"
          color="$textInverse"
          width="100%"
          disabled={!stripe || isProcessing}
          onPress={handlePaymentSubmit}
        >
          {isProcessing
            ? "Processing payment..."
            : `Pay £${calculateTotal().toFixed(2)}`}
        </Button>

        <Text size="$3" color="$textMuted" textAlign="center">
          Your payment is secure and encrypted. By completing this purchase, you
          agree to our terms of service.
        </Text>
      </Column>
    </Card>
  );
}

export function CheckoutForm({ product }: Readonly<CheckoutFormProps>) {
  const [step, setStep] = useState<"address" | "shipping" | "payment">(
    "address",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Address state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    street1: "",
    street2: "",
    city: "",
    county: "",
    postcode: "",
    country: "GB",
    phone: "",
  });

  // Postcode validation state
  const [postcodeError, setPostcodeError] = useState<string | null>(null);

  // Shipping rates
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleAddressSubmit = async () => {
    // Validate required fields
    if (
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.street1 ||
      !shippingAddress.city ||
      !shippingAddress.postcode
    ) {
      setErrorMessage("Please fill in all required address fields");
      return;
    }

    // Validate UK postcode format
    if (!isValidUKPostcode(shippingAddress.postcode)) {
      setPostcodeError("Please enter a valid UK postcode (e.g., SW1A 1AA)");
      return;
    }

    // Format postcode correctly
    const formattedPostcode = formatUKPostcode(shippingAddress.postcode);
    const addressToSubmit = {
      ...shippingAddress,
      postcode: formattedPostcode,
      // Combine first and last name for API (legacy support)
      name: `${shippingAddress.firstName} ${shippingAddress.lastName}`.trim(),
    };

    setErrorMessage(null);
    setPostcodeError(null);
    setLoadingRates(true);

    try {
      // Calculate shipping rates
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          toAddress: {
            ...addressToSubmit,
            // Map UK fields to API expected fields for backward compatibility
            state: shippingAddress.county,
            zip: formattedPostcode,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to calculate shipping rates");
      }

      const data = await response.json();
      setShippingRates(data.rates || []);

      // Auto-select cheapest rate if available
      if (data.rates && data.rates.length > 0) {
        setSelectedRate(data.rates[0]);
      }

      setStep("shipping");
    } catch (error) {
      console.error("Error calculating shipping:", error);
      setErrorMessage("Failed to calculate shipping rates. Please try again.");
    } finally {
      setLoadingRates(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!selectedRate) {
      setErrorMessage("Please select a shipping option");
      return;
    }

    setErrorMessage(null);
    setLoadingRates(true);

    try {
      // Create payment intent with shipping details
      const response = await fetch("/api/checkout/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          shippingAddress,
          selectedRateId: selectedRate.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep("payment");
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to proceed to payment",
      );
    } finally {
      setLoadingRates(false);
    }
  };

  const calculateTotal = () => {
    const shippingCost = selectedRate
      ? Number.parseInt(selectedRate.rate) / 100
      : 0;
    return product.price + shippingCost;
  };

  return (
    <Column gap="$lg">
      <Column gap="$lg">
        <Heading level={2}>Checkout</Heading>

        {/* Product Summary - Always visible */}
        <Card variant="outlined" padding="$lg">
          <Row gap="$md" alignItems="flex-start">
            {product.imageUrl && (
              <Image
                source={{ uri: product.imageUrl }}
                width={80}
                height={80}
                borderRadius="$md"
                alt={product.title}
              />
            )}
            <Column gap="$xs" flex={1}>
              <Text size="$6" weight="semibold">
                {product.title}
              </Text>
              <Row gap="$md" justifyContent="space-between">
                <Text color="$textSecondary">Product</Text>
                <Text weight="medium">£{product.price.toFixed(2)}</Text>
              </Row>
              {selectedRate && (
                <Row gap="$md" justifyContent="space-between">
                  <Text color="$textSecondary">
                    Shipping ({selectedRate.carrier} {selectedRate.service})
                  </Text>
                  <Text weight="medium">{selectedRate.rateDisplay}</Text>
                </Row>
              )}
              {selectedRate && (
                <Row
                  gap="$md"
                  justifyContent="space-between"
                  paddingTop="$sm"
                  borderTopWidth={1}
                  borderTopColor="$border"
                >
                  <Text weight="semibold">Total</Text>
                  <Text weight="bold" size="$6" color="$primary">
                    £{calculateTotal().toFixed(2)}
                  </Text>
                </Row>
              )}
            </Column>
          </Row>
        </Card>

        {/* Step 1: Shipping Address */}
        {step === "address" && (
          <Card variant="outlined" padding="$lg">
            <Column gap="$lg">
              <Heading level={4}>Shipping Address</Heading>

              <Column gap="$md">
                {/* Name Row - First and Last */}
                <Row gap="$md" flexWrap="wrap">
                  <Column gap="$xs" flex={1} minWidth={150}>
                    <FormLabel required>First Name</FormLabel>
                    <Input
                      value={shippingAddress.firstName}
                      onChangeText={(value) =>
                        setShippingAddress({ ...shippingAddress, firstName: value })
                      }
                      placeholder="John"
                      size="$4"
                      autoComplete="given-name"
                    />
                  </Column>
                  <Column gap="$xs" flex={1} minWidth={150}>
                    <FormLabel required>Last Name</FormLabel>
                    <Input
                      value={shippingAddress.lastName}
                      onChangeText={(value) =>
                        setShippingAddress({ ...shippingAddress, lastName: value })
                      }
                      placeholder="Smith"
                      size="$4"
                      autoComplete="family-name"
                    />
                  </Column>
                </Row>
                {/* Street Address 1 */}
                <Column gap="$xs">
                  <FormLabel required>Address Line 1</FormLabel>
                  <Input
                    value={shippingAddress.street1}
                    onChangeText={(value) =>
                      setShippingAddress({ ...shippingAddress, street1: value })
                    }
                    placeholder="10 Downing Street"
                    size="$4"
                    autoComplete="address-line1"
                  />
                </Column>
                {/* Street Address 2 */}
                <Column gap="$xs">
                  <FormLabel>Address Line 2</FormLabel>
                  <Input
                    value={shippingAddress.street2}
                    onChangeText={(value) =>
                      setShippingAddress({ ...shippingAddress, street2: value })
                    }
                    placeholder="Flat 2B"
                    size="$4"
                    autoComplete="address-line2"
                  />
                </Column>
                {/* City and County Row */}
                <Row gap="$md" flexWrap="wrap">
                  <Column gap="$xs" flex={2} minWidth={200}>
                    <FormLabel required>Town/City</FormLabel>
                    <Input
                      value={shippingAddress.city}
                      onChangeText={(value) =>
                        setShippingAddress({ ...shippingAddress, city: value })
                      }
                      placeholder="London"
                      size="$4"
                      autoComplete="address-level2"
                    />
                  </Column>
                  <Column gap="$xs" flex={1} minWidth={150}>
                    <FormLabel>County</FormLabel>
                    <Input
                      value={shippingAddress.county}
                      onChangeText={(value) =>
                        setShippingAddress({ ...shippingAddress, county: value })
                      }
                      placeholder="Greater London"
                      size="$4"
                      autoComplete="address-level1"
                    />
                  </Column>
                </Row>
                {/* Postcode */}
                <Column gap="$xs">
                  <FormLabel required>Postcode</FormLabel>
                  <Input
                    value={shippingAddress.postcode}
                    onChangeText={(value) => {
                      setShippingAddress({ ...shippingAddress, postcode: value });
                      setPostcodeError(null);
                    }}
                    placeholder="SW1A 1AA"
                    size="$4"
                    autoComplete="postal-code"
                  />
                  {postcodeError && (
                    <Text size="$3" color="$error">{postcodeError}</Text>
                  )}
                </Column>
                {/* Phone */}
                <Column gap="$xs">
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    value={shippingAddress.phone}
                    onChangeText={(value) =>
                      setShippingAddress({ ...shippingAddress, phone: value })
                    }
                    placeholder="+44 7700 900000"
                    size="$4"
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </Column>
              </Column>

              {errorMessage && <Text color="$error">{errorMessage}</Text>}

              <Button
                size="$5"
                backgroundColor="$primary"
                color="$textInverse"
                width="100%"
                disabled={loadingRates}
                onPress={handleAddressSubmit}
              >
                {loadingRates
                  ? "Calculating shipping..."
                  : "Continue to Shipping"}
              </Button>
            </Column>
          </Card>
        )}

        {/* Step 2: Shipping Options */}
        {step === "shipping" && (
          <Card variant="outlined" padding="$lg">
            <Column gap="$lg">
              <Row justifyContent="space-between" alignItems="center">
                <Heading level={4}>Shipping Options</Heading>
                <Button chromeless size="$3" onPress={() => setStep("address")}>
                  ← Edit Address
                </Button>
              </Row>

              {/* Address Summary */}
              <Column
                gap="$xs"
                padding="$sm"
                backgroundColor="$backgroundHover"
                borderRadius="$md"
              >
                <Text size="$3" weight="semibold">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </Text>
                <Text size="$3" color="$textSecondary">
                  {shippingAddress.street1}
                  {shippingAddress.street2 && `, ${shippingAddress.street2}`}
                </Text>
                <Text size="$3" color="$textSecondary">
                  {shippingAddress.city}
                  {shippingAddress.county && `, ${shippingAddress.county}`}{" "}
                  {shippingAddress.postcode}
                </Text>
              </Column>

              {/* Shipping Rates */}
              <Column gap="$sm">
                {shippingRates.map((rate) => (
                  <Card
                    key={
                      rate.id || `${rate.carrier}-${rate.service}-${rate.rate}`
                    }
                    variant="outlined"
                    padding="$md"
                    onPress={() => setSelectedRate(rate)}
                    backgroundColor={
                      selectedRate === rate ? "$primaryLight" : "$surface"
                    }
                    borderColor={selectedRate === rate ? "$primary" : "$border"}
                  >
                    <Row justifyContent="space-between" alignItems="center">
                      <Column gap="$xs">
                        <Text weight="semibold">
                          {rate.carrier} {rate.service}
                        </Text>
                        <Text size="$3" color="$textSecondary">
                          Estimated {rate.estimatedDays} business days
                          {rate.deliveryDate &&
                            ` • Delivery by ${rate.deliveryDate}`}
                        </Text>
                      </Column>
                      <Text weight="bold" color="$primary">
                        {rate.rateDisplay}
                      </Text>
                    </Row>
                  </Card>
                ))}
              </Column>

              {shippingRates.length === 0 && (
                <Column gap="$md" alignItems="center" padding="$xl">
                  <Text color="$textMuted">No shipping options available</Text>
                  <Button
                    chromeless
                    size="$3"
                    onPress={() => setStep("address")}
                  >
                    Try a different address
                  </Button>
                </Column>
              )}

              {errorMessage && <Text color="$error">{errorMessage}</Text>}

              {shippingRates.length > 0 && (
                <Button
                  size="$5"
                  backgroundColor="$primary"
                  color="$textInverse"
                  width="100%"
                  onPress={handleShippingSubmit}
                  disabled={!selectedRate || loadingRates}
                >
                  {loadingRates ? "Processing..." : "Continue to Payment"}
                </Button>
              )}
            </Column>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && clientSecret && selectedRate && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "flat",
                variables: {
                  colorPrimary: "#E25F2F", // Butter Orange
                  colorBackground: "#FEFAD6", // Cream
                  colorText: "#1E1E1E", // Charcoal
                  colorDanger: "#DC2626", // Error red
                  borderRadius: "10px",
                  fontFamily: "system-ui, sans-serif",
                },
              },
            }}
          >
            <PaymentForm
              product={product}
              selectedRate={selectedRate}
              onBack={() => setStep("shipping")}
            />
          </Elements>
        )}

        {/* Loading State */}
        {loadingRates && step !== "payment" && (
          <Card variant="outlined" padding="$xl">
            <Column gap="$md" alignItems="center">
              <Spinner size="lg" color="$primary" />
              <Text color="$textSecondary">
                {step === "address"
                  ? "Calculating shipping options..."
                  : "Processing..."}
              </Text>
            </Column>
          </Card>
        )}
      </Column>
    </Column>
  );
}
