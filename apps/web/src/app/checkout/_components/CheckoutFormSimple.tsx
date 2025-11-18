"use client";

import { FormEvent, useState } from "react";
import { Button, Column, Row, Text, Heading, Input } from "@buttergolf/ui";

interface CheckoutFormSimpleProps {
    product: {
        id: string;
        title: string;
        price: number;
        imageUrl: string | null;
    };
}

// Form Label component
const FormLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <Row gap="$xs" marginBottom="$xs">
        <Text size="$3" weight="medium" color="$ironstone">
            {children}
        </Text>
        {required && <Text color="$error">*</Text>}
    </Row>
);

export function CheckoutFormSimple({ product }: CheckoutFormSimpleProps) {
    const [billingMatchesShipping, setBillingMatchesShipping] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Shipping address
    const [shippingName, setShippingName] = useState("");
    const [shippingPhone, setShippingPhone] = useState("");
    const [shippingAddress1, setShippingAddress1] = useState("");
    const [shippingAddress2, setShippingAddress2] = useState("");
    const [shippingPostalCode, setShippingPostalCode] = useState("");
    const [shippingCity, setShippingCity] = useState("");
    const [shippingCounty, setShippingCounty] = useState("");
    const [shippingCountry, setShippingCountry] = useState("United Kingdom");

    // Billing address
    const [billingName, setBillingName] = useState("");
    const [billingAddress1, setBillingAddress1] = useState("");
    const [billingAddress2, setBillingAddress2] = useState("");
    const [billingPostalCode, setBillingPostalCode] = useState("");
    const [billingCity, setBillingCity] = useState("");
    const [billingCounty, setBillingCounty] = useState("");
    const [billingCountry, setBillingCountry] = useState("United Kingdom");

    // Payment details
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardCVC, setCardCVC] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // TODO: Implement payment processing
        console.log("Processing payment...");

        setTimeout(() => {
            setIsProcessing(false);
            alert("Order placed successfully!");
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Column gap="$xl">
                {/* Shipping Address */}
                <Column gap="$lg">
                    <Heading level={3} color="$ironstone">
                        Shipping address
                    </Heading>

                    <Column gap="$md">
                        {/* Name */}
                        <Column gap="$xs">
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={shippingName}
                                onChangeText={setShippingName}
                                placeholder="John Doe"
                                size="$4"
                                fullWidth
                            />
                        </Column>

                        {/* Phone */}
                        <Column gap="$xs">
                            <FormLabel>Phone number (optional)</FormLabel>
                            <Input
                                value={shippingPhone}
                                onChangeText={setShippingPhone}
                                placeholder="+44 7XXX XXXXXX"
                                size="$4"
                                fullWidth
                                inputMode="tel"
                            />
                        </Column>

                        {/* Address Lines */}
                        <Row gap="$md" flexWrap="wrap">
                            <Column gap="$xs" flex={1} minWidth={200}>
                                <FormLabel>Address line 1</FormLabel>
                                <Input
                                    value={shippingAddress1}
                                    onChangeText={setShippingAddress1}
                                    placeholder="11 Lorem Ipsum road"
                                    size="$4"
                                    fullWidth
                                />
                            </Column>

                            <Column gap="$xs" flex={1} minWidth={200}>
                                <FormLabel>Address line 2</FormLabel>
                                <Input
                                    value={shippingAddress2}
                                    onChangeText={setShippingAddress2}
                                    placeholder="Flat 2"
                                    size="$4"
                                    fullWidth
                                />
                            </Column>
                        </Row>

                        {/* Postal Code and City */}
                        <Row gap="$md" flexWrap="wrap">
                            <Column gap="$xs" flex={1} minWidth={150}>
                                <FormLabel>Postal code</FormLabel>
                                <Input
                                    value={shippingPostalCode}
                                    onChangeText={setShippingPostalCode}
                                    placeholder="LP1A 1AA"
                                    size="$4"
                                    fullWidth
                                />
                            </Column>

                            <Column gap="$xs" flex={1} minWidth={150}>
                                <FormLabel>Town/City</FormLabel>
                                <Input
                                    value={shippingCity}
                                    onChangeText={setShippingCity}
                                    placeholder="Lorem"
                                    size="$4"
                                    fullWidth
                                />
                            </Column>
                        </Row>

                        {/* County and Country */}
                        <Row gap="$md" flexWrap="wrap">
                            <Column gap="$xs" flex={1} minWidth={150}>
                                <FormLabel>County</FormLabel>
                                <Input
                                    value={shippingCounty}
                                    onChangeText={setShippingCounty}
                                    placeholder="Ipsum"
                                    size="$4"
                                    fullWidth
                                />
                            </Column>

                            <Column gap="$xs" flex={1} minWidth={150}>
                                <FormLabel>Country</FormLabel>
                                <select
                                    value={shippingCountry}
                                    onChange={(e) => setShippingCountry(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        fontSize: "16px",
                                        border: "1px solid #EDEDED",
                                        borderRadius: "10px",
                                        outline: "none",
                                        fontFamily: "var(--font-urbanist)",
                                        backgroundColor: "white",
                                        color: "#323232",
                                        appearance: "none",
                                        backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "right 12px center",
                                        backgroundSize: "20px",
                                        paddingRight: "40px",
                                    }}
                                >
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="United States">United States</option>
                                    <option value="Ireland">Ireland</option>
                                    <option value="France">France</option>
                                    <option value="Germany">Germany</option>
                                    <option value="Spain">Spain</option>
                                    <option value="Italy">Italy</option>
                                </select>
                            </Column>
                        </Row>
                    </Column>
                </Column>

                {/* Payment Details */}
                <Column gap="$lg">
                    <Heading level={3} color="$ironstone">
                        Payment details
                    </Heading>

                    <Column gap="$md">
                        {/* Card Number */}
                        <Column gap="$xs">
                            <FormLabel>Payment card details</FormLabel>
                            <Input
                                value={cardNumber}
                                onChangeText={setCardNumber}
                                placeholder="Card number"
                                size="$4"
                                fullWidth
                                inputMode="numeric"
                            />
                        </Column>

                        {/* Name and CVC */}
                        <Row gap="$md" flexWrap="wrap">
                            <Column gap="$xs" flex={1} minWidth={200}>
                                <FormLabel>Name on card</FormLabel>
                                <Input
                                    value={cardName}
                                    onChangeText={setCardName}
                                    placeholder="MR L IPSUM"
                                    size="$4"
                                    fullWidth
                                />
                            </Column>

                            <Column gap="$xs" flex={1} minWidth={120}>
                                <FormLabel>CVC</FormLabel>
                                <Input
                                    value={cardCVC}
                                    onChangeText={setCardCVC}
                                    placeholder="233"
                                    size="$4"
                                    fullWidth
                                    inputMode="numeric"
                                    maxLength={4}
                                />
                            </Column>
                        </Row>
                    </Column>
                </Column>

                {/* Billing Details */}
                <Column gap="$lg">
                    <Heading level={3} color="$ironstone">
                        Billing details
                    </Heading>

                    {/* Checkbox */}
                    <Row gap="$sm" alignItems="center">
                        <input
                            type="checkbox"
                            id="billing-same-as-shipping"
                            checked={billingMatchesShipping}
                            onChange={(e) => setBillingMatchesShipping(e.target.checked)}
                            style={{
                                width: 20,
                                height: 20,
                                cursor: "pointer",
                                accentColor: "#F45314",
                            }}
                        />
                        <label
                            htmlFor="billing-same-as-shipping"
                            style={{
                                fontSize: "16px",
                                color: "#323232",
                                cursor: "pointer",
                                userSelect: "none",
                            }}
                        >
                            Same as shipping address
                        </label>
                    </Row>

                    {/* Billing Fields - Hidden when checkbox is checked */}
                    {!billingMatchesShipping && (
                        <Column gap="$md">
                            {/* Name */}
                            <Column gap="$xs">
                                <FormLabel>Card holders name</FormLabel>
                                <Input
                                    value={billingName}
                                    onChangeText={setBillingName}
                                    placeholder="John Doe"
                                    size="$4"
                                    fullWidth
                                />
                            </Column>

                            {/* Address Lines */}
                            <Row gap="$md" flexWrap="wrap">
                                <Column gap="$xs" flex={1} minWidth={200}>
                                    <FormLabel>Address line 1</FormLabel>
                                    <Input
                                        value={billingAddress1}
                                        onChangeText={setBillingAddress1}
                                        placeholder="11 Lorem Ipsum road"
                                        size="$4"
                                        fullWidth
                                    />
                                </Column>

                                <Column gap="$xs" flex={1} minWidth={200}>
                                    <FormLabel>Address line 2</FormLabel>
                                    <Input
                                        value={billingAddress2}
                                        onChangeText={setBillingAddress2}
                                        placeholder="Flat 2"
                                        size="$4"
                                        fullWidth
                                    />
                                </Column>
                            </Row>

                            {/* Postal Code and City */}
                            <Row gap="$md" flexWrap="wrap">
                                <Column gap="$xs" flex={1} minWidth={150}>
                                    <FormLabel>Postal code</FormLabel>
                                    <Input
                                        value={billingPostalCode}
                                        onChangeText={setBillingPostalCode}
                                        placeholder="LP1A 1AA"
                                        size="$4"
                                        fullWidth
                                    />
                                </Column>

                                <Column gap="$xs" flex={1} minWidth={150}>
                                    <FormLabel>Town/City</FormLabel>
                                    <Input
                                        value={billingCity}
                                        onChangeText={setBillingCity}
                                        placeholder="Lorem"
                                        size="$4"
                                        fullWidth
                                    />
                                </Column>
                            </Row>

                            {/* County and Country */}
                            <Row gap="$md" flexWrap="wrap">
                                <Column gap="$xs" flex={1} minWidth={150}>
                                    <FormLabel>County</FormLabel>
                                    <Input
                                        value={billingCounty}
                                        onChangeText={setBillingCounty}
                                        placeholder="Ipsum"
                                        size="$4"
                                        fullWidth
                                    />
                                </Column>

                                <Column gap="$xs" flex={1} minWidth={150}>
                                    <FormLabel>Country</FormLabel>
                                    <select
                                        value={billingCountry}
                                        onChange={(e) => setBillingCountry(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "12px 16px",
                                            fontSize: "16px",
                                            border: "1px solid #EDEDED",
                                            borderRadius: "10px",
                                            outline: "none",
                                            fontFamily: "var(--font-urbanist)",
                                            backgroundColor: "white",
                                            color: "#323232",
                                            appearance: "none",
                                            backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right 12px center",
                                            backgroundSize: "20px",
                                            paddingRight: "40px",
                                        }}
                                    >
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="United States">United States</option>
                                        <option value="Ireland">Ireland</option>
                                        <option value="France">France</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Spain">Spain</option>
                                        <option value="Italy">Italy</option>
                                    </select>
                                </Column>
                            </Row>
                        </Column>
                    )}
                </Column>

                {/* Submit Button */}
                <Button
                    size="$5"

                    borderRadius="$full"
                    paddingHorizontal="$6"
                    disabled={isProcessing}
                    width="100%"
                >
                    {isProcessing ? "Processing..." : `Confirm and pay £${(product.price + 9.99 + 1.0).toFixed(2)}`}
                </Button>
            </Column>
        </form>
    );
}
