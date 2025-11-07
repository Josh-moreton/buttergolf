"use client";

import { FormEvent, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Card, Column, Row, Text, Heading, Image, Input, Spinner } from "@buttergolf/ui";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
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
    name: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
}

// Form Label component
const FormLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <Row gap="$xs" marginBottom="$xs">
        <Text size="sm" weight="medium" color="$text">
            {children}
        </Text>
        {required && <Text color="$error">*</Text>}
    </Row>
);

// Payment form component that uses Stripe Elements
function PaymentForm({
    product,
    shippingAddress,
    selectedRate,
    onBack
}: {
    product: CheckoutFormProps['product'];
    shippingAddress: ShippingAddress;
    selectedRate: ShippingRate;
    onBack: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const calculateTotal = () => {
        const shippingCost = parseInt(selectedRate.rate) / 100;
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
                setErrorMessage(error.message || 'An error occurred during payment');
                setIsProcessing(false);
            }
            // If successful, Stripe will redirect to return_url
        } catch (err) {
            console.error('Payment error:', err);
            setErrorMessage('An unexpected error occurred. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <Card variant="outlined" padding="$lg">
            <Column gap="$lg">
                <Row justifyContent="space-between" alignItems="center">
                    <Heading level={4}>Payment Details</Heading>
                    <Button
                        chromeless
                        size="$3"
                        onPress={onBack}
                    >
                        ← Edit Shipping
                    </Button>
                </Row>

                <PaymentElement />

                {errorMessage && (
                    <Text color="$error">{errorMessage}</Text>
                )}

                <Button
                    size="$5"
                    backgroundColor="$primary"
                    color="$textInverse"
                    width="100%"
                    disabled={!stripe || isProcessing}
                    onPress={handlePaymentSubmit}
                >
                    {isProcessing ? "Processing..." : `Pay $${calculateTotal().toFixed(2)}`}
                </Button>

                <Text size="sm" color="$textMuted" textAlign="center">
                    Your payment is secure and encrypted. By completing this purchase, you
                    agree to our terms of service.
                </Text>
            </Column>
        </Card>
    );
}

export function CheckoutForm({ product }: CheckoutFormProps) {
    const [step, setStep] = useState<'address' | 'shipping' | 'payment'>('address');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Address state
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        name: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
        phone: '',
    });

    // Shipping rates
    const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
    const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
    const [loadingRates, setLoadingRates] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const handleAddressSubmit = async () => {
        // Validate required fields
        if (!shippingAddress.name || !shippingAddress.street1 ||
            !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip) {
            setErrorMessage('Please fill in all required address fields');
            return;
        }

        setErrorMessage(null);
        setLoadingRates(true);

        try {
            // Calculate shipping rates
            const response = await fetch('/api/shipping/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    toAddress: shippingAddress,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to calculate shipping rates');
            }

            const data = await response.json();
            setShippingRates(data.rates || []);

            // Auto-select cheapest rate if available
            if (data.rates && data.rates.length > 0) {
                setSelectedRate(data.rates[0]);
            }

            setStep('shipping');
        } catch (error) {
            console.error('Error calculating shipping:', error);
            setErrorMessage('Failed to calculate shipping rates. Please try again.');
        } finally {
            setLoadingRates(false);
        }
    };

    const handleShippingSubmit = async () => {
        if (!selectedRate) {
            setErrorMessage('Please select a shipping option');
            return;
        }

        setErrorMessage(null);
        setLoadingRates(true);

        try {
            // Create payment intent with shipping details
            const response = await fetch('/api/checkout/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    shippingAddress,
                    selectedRateId: selectedRate.id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create payment intent');
            }

            const data = await response.json();
            setClientSecret(data.clientSecret);
            setStep('payment');
        } catch (error) {
            console.error('Error creating payment intent:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to proceed to payment');
        } finally {
            setLoadingRates(false);
        }
    };

    const calculateTotal = () => {
        const shippingCost = selectedRate ? parseInt(selectedRate.rate) / 100 : 0;
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
                            />
                        )}
                        <Column gap="$xs" flex={1}>
                            <Text size="lg" weight="semibold">
                                {product.title}
                            </Text>
                            <Row gap="$md" justifyContent="space-between">
                                <Text color="$textSecondary">Product</Text>
                                <Text weight="medium">${product.price.toFixed(2)}</Text>
                            </Row>
                            {selectedRate && (
                                <Row gap="$md" justifyContent="space-between">
                                    <Text color="$textSecondary">Shipping ({selectedRate.carrier} {selectedRate.service})</Text>
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
                                    <Text weight="bold" size="lg" color="$primary">
                                        ${calculateTotal().toFixed(2)}
                                    </Text>
                                </Row>
                            )}
                        </Column>
                    </Row>
                </Card>

                {/* Step 1: Shipping Address */}
                {step === 'address' && (
                    <Card variant="outlined" padding="$lg">
                        <Column gap="$lg">
                            <Heading level={4}>Shipping Address</Heading>

                            <Column gap="$md">\n                                {/* Full Name */}
                                <Column gap="$xs">
                                    <FormLabel required>Full Name</FormLabel>
                                    <Input
                                        value={shippingAddress.name}
                                        onChangeText={(value) => setShippingAddress({ ...shippingAddress, name: value })}
                                        placeholder="John Doe"
                                        size="md"
                                    />
                                </Column>

                                {/* Street Address 1 */}
                                <Column gap="$xs">
                                    <FormLabel required>Street Address</FormLabel>
                                    <Input
                                        value={shippingAddress.street1}
                                        onChangeText={(value) => setShippingAddress({ ...shippingAddress, street1: value })}
                                        placeholder="123 Main St"
                                        size="md"
                                    />
                                </Column>

                                {/* Street Address 2 */}
                                <Column gap="$xs">
                                    <FormLabel>Apartment, suite, etc.</FormLabel>
                                    <Input
                                        value={shippingAddress.street2}
                                        onChangeText={(value) => setShippingAddress({ ...shippingAddress, street2: value })}
                                        placeholder="Apt 4B"
                                        size="md"
                                    />
                                </Column>

                                {/* City, State, ZIP Row */}
                                <Row gap="$md" flexWrap="wrap">
                                    <Column gap="$xs" flex={2} minWidth={200}>
                                        <FormLabel required>City</FormLabel>
                                        <Input
                                            value={shippingAddress.city}
                                            onChangeText={(value) => setShippingAddress({ ...shippingAddress, city: value })}
                                            placeholder="San Francisco"
                                            size="md"
                                        />
                                    </Column>
                                    <Column gap="$xs" flex={1} minWidth={120}>
                                        <FormLabel required>State</FormLabel>
                                        <Input
                                            value={shippingAddress.state}
                                            onChangeText={(value) => setShippingAddress({ ...shippingAddress, state: value })}
                                            placeholder="CA"
                                            size="md"
                                        />
                                    </Column>
                                    <Column gap="$xs" flex={1} minWidth={120}>
                                        <FormLabel required>ZIP Code</FormLabel>
                                        <Input
                                            value={shippingAddress.zip}
                                            onChangeText={(value) => setShippingAddress({ ...shippingAddress, zip: value })}
                                            placeholder="94102"
                                            size="md"
                                        />
                                    </Column>
                                </Row>

                                {/* Phone */}
                                <Column gap="$xs">
                                    <FormLabel>Phone Number</FormLabel>
                                    <Input
                                        value={shippingAddress.phone}
                                        onChangeText={(value) => setShippingAddress({ ...shippingAddress, phone: value })}
                                        placeholder="(555) 123-4567"
                                        size="md"
                                        inputMode="tel"
                                    />
                                </Column>
                            </Column>

                            {errorMessage && (
                                <Text color="$error">{errorMessage}</Text>
                            )}

                            <Button
                                size="$5"
                                backgroundColor="$primary"
                                color="$textInverse"
                                width="100%"
                                disabled={loadingRates}
                                onPress={handleAddressSubmit}
                            >
                                {loadingRates ? "Calculating shipping..." : "Continue to Shipping"}
                            </Button>
                        </Column>
                    </Card>
                )}

                {/* Step 2: Shipping Options */}
                {step === 'shipping' && (
                    <Card variant="outlined" padding="$lg">
                        <Column gap="$lg">
                            <Row justifyContent="space-between" alignItems="center">
                                <Heading level={4}>Shipping Options</Heading>
                                <Button
                                    chromeless
                                    size="$3"
                                    onPress={() => setStep('address')}
                                >
                                    ← Edit Address
                                </Button>
                            </Row>

                            {/* Address Summary */}
                            <Column gap="$xs" padding="$sm" backgroundColor="$backgroundHover" borderRadius="$md">
                                <Text size="sm" weight="semibold">{shippingAddress.name}</Text>
                                <Text size="sm" color="$textSecondary">
                                    {shippingAddress.street1}
                                    {shippingAddress.street2 && `, ${shippingAddress.street2}`}
                                </Text>
                                <Text size="sm" color="$textSecondary">
                                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                                </Text>
                            </Column>

                            {/* Shipping Rates */}
                            <Column gap="$sm">
                                {shippingRates.map((rate, index) => (
                                    <Card
                                        key={index}
                                        variant="outlined"
                                        padding="$md"
                                        onPress={() => setSelectedRate(rate)}
                                        backgroundColor={selectedRate === rate ? "$primaryLight" : "$surface"}
                                        borderColor={selectedRate === rate ? "$primary" : "$border"}
                                    >
                                        <Row justifyContent="space-between" alignItems="center">
                                            <Column gap="$xs">
                                                <Text weight="semibold">
                                                    {rate.carrier} {rate.service}
                                                </Text>
                                                <Text size="sm" color="$textSecondary">
                                                    Estimated {rate.estimatedDays} business days
                                                    {rate.deliveryDate && ` • Delivery by ${rate.deliveryDate}`}
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
                                        onPress={() => setStep('address')}
                                    >
                                        Try a different address
                                    </Button>
                                </Column>
                            )}

                            {errorMessage && (
                                <Text color="$error">{errorMessage}</Text>
                            )}

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
                {step === 'payment' && clientSecret && selectedRate && (
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
                            shippingAddress={shippingAddress}
                            selectedRate={selectedRate}
                            onBack={() => setStep('shipping')}
                        />
                    </Elements>
                )}

                {/* Loading State */}
                {loadingRates && step !== 'payment' && (
                    <Card variant="outlined" padding="$xl">
                        <Column gap="$md" alignItems="center">
                            <Spinner size="lg" color="$primary" />
                            <Text color="$textSecondary">
                                {step === 'address' ? 'Calculating shipping options...' : 'Processing...'}
                            </Text>
                        </Column>
                    </Card>
                )}
            </Column>
        </Column>
    );
}