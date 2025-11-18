"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
    Column,
    Row,
    Heading,
    Text,
    Button,
    Input,
    Card,
} from "@buttergolf/ui";

interface Address {
    id: string;
    name: string;
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
    isDefault: boolean;
}

interface AddressFormData {
    name: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    isDefault: boolean;
}

// Form Label component
const FormLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <Row gap="$xs" marginBottom="$xs">
  return (
    <Column gap="$xs">
      <Column gap="$xs">
        <Text fontSize="$3" weight="medium" color="$text">
          {label}
          {required && <Text color="$error"> *</Text>}
    </Row>
);

export default function AddressesPage() {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState<AddressFormData>({
        name: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        country: "US",
        phone: "",
        isDefault: false,
    });

    // Load addresses
    const loadAddresses = async () => {
        try {
            const response = await fetch("/api/addresses");
            if (!response.ok) throw new Error("Failed to load addresses");
            const data = await response.json();
            setAddresses(data);
        } catch (err) {
            setError("Failed to load addresses");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSignedIn) {
            loadAddresses();
        }
    }, [isSignedIn]);

    // Redirect if not signed in
    if (isLoaded && !isSignedIn) {
        router.push("/sign-in?redirect=/settings/addresses");
        return null;
    }

    const handleSubmit = async () => {
        setError(null);

        // Validate required fields
        if (!formData.name || !formData.street1 || !formData.city || !formData.state || !formData.zip) {
            setError("Please fill in all required fields");
            return;
        }

        try {
            const url = editingAddress ? `/api/addresses/${editingAddress.id}` : "/api/addresses";
            const method = editingAddress ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save address");
            }

            // Reload addresses and close form
            await loadAddresses();
            setShowForm(false);
            setEditingAddress(null);
            setFormData({
                name: "",
                street1: "",
                street2: "",
                city: "",
                state: "",
                zip: "",
                country: "US",
                phone: "",
                isDefault: false,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save address");
        }
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setFormData({
            name: address.name,
            street1: address.street1,
            street2: address.street2 || "",
            city: address.city,
            state: address.state,
            zip: address.zip,
            country: address.country,
            phone: address.phone || "",
            isDefault: address.isDefault,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;

        try {
            const response = await fetch(`/api/addresses/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete address");
            await loadAddresses();
        } catch (err) {
            console.error("Failed to delete address:", err);
            setError("Failed to delete address");
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            const response = await fetch(`/api/addresses/${id}/default`, {
                method: "PUT",
            });
            if (!response.ok) throw new Error("Failed to update default address");
            await loadAddresses();
        } catch (err) {
            console.error("Failed to update default address:", err);
            setError("Failed to update default address");
        }
    };

    if (loading) {
        return (
            <Column
                backgroundColor="$background"
                minHeight="100vh"
                alignItems="center"
                justifyContent="center"
                width="100%"
            >
                <Text>Loading addresses...</Text>
            </Column>
        );
    }

    return (
        <Column
            backgroundColor="$background"
            minHeight="100vh"
            alignItems="center"
            width="100%"
        >
            <Column
                maxWidth={800}
                paddingHorizontal="$6"
                width="100%"
                alignSelf="center"
                marginHorizontal="auto"
            >
                <Column gap="$xl" paddingVertical="$10" width="100%">
                    {/* Header */}
                    <Row justifyContent="space-between" alignItems="center" width="100%">
                        <Column gap="$sm">
                            <Button
                                chromeless
                                size="$3"
                                onPress={() => router.push("/settings")}
                            >
                                ← Back to Settings
                            </Button>
                            <Heading level={2}>Shipping Addresses</Heading>
                            <Text color="$textSecondary">
                                Manage addresses where you can ship items from
                            </Text>
                        </Column>
                        <Button
                            backgroundColor="$primary"
                            color="$white"
                            size="$4"
                            onPress={() => setShowForm(true)}
                        >
                            Add Address
                        </Button>
                    </Row>

                    {error && (
                        <Card variant="filled" padding="$md" backgroundColor="$errorLight">
                            <Text color="$error">{error}</Text>
                        </Card>
                    )}

                    {/* Address Form */}
                    {showForm && (
                        <Card variant="elevated" padding="$lg">
                            <Column gap="$lg">
                                <Row justifyContent="space-between" alignItems="center">
                                    <Heading level={3}>
                                        {editingAddress ? "Edit Address" : "Add New Address"}
                                    </Heading>
                                    <Button
                                        chromeless
                                        size="$3"
                                        onPress={() => {
                                            setShowForm(false);
                                            setEditingAddress(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Row>

                                <Column gap="$md">
                                    {/* Full Name */}
                                    <Column gap="$xs">
                                        <FormLabel required>Full Name</FormLabel>
                                        <Input
                                            value={formData.name}
                                            onChangeText={(value) => setFormData({ ...formData, name: value })}
                                            placeholder="John Doe"
                                            size="md"
                                            required
                                        />
                                    </Column>

                                    {/* Street Address 1 */}
                                    <Column gap="$xs">
                                        <FormLabel required>Street Address</FormLabel>
                                        <Input
                                            value={formData.street1}
                                            onChangeText={(value) => setFormData({ ...formData, street1: value })}
                                            placeholder="123 Main St"
                                            size="md"
                                            required
                                        />
                                    </Column>

                                    {/* Street Address 2 */}
                                    <Column gap="$xs">
                                        <FormLabel>Street Address 2 (Optional)</FormLabel>
                                        <Input
                                            value={formData.street2}
                                            onChangeText={(value) => setFormData({ ...formData, street2: value })}
                                            placeholder="Apt, suite, unit, building, floor, etc."
                                            size="md"
                                        />
                                    </Column>

                                    {/* City, State, ZIP Row */}
                                    <Row gap="$md" flexWrap="wrap">
                                        <Column gap="$xs" flex={2} minWidth={200}>
                                            <FormLabel required>City</FormLabel>
                                            <Input
                                                value={formData.city}
                                                onChangeText={(value) => setFormData({ ...formData, city: value })}
                                                placeholder="San Francisco"
                                                size="md"
                                                required
                                            />
                                        </Column>
                                        <Column gap="$xs" flex={1} minWidth={120}>
                                            <FormLabel required>State</FormLabel>
                                            <Input
                                                value={formData.state}
                                                onChangeText={(value) => setFormData({ ...formData, state: value })}
                                                placeholder="CA"
                                                size="md"
                                                required
                                            />
                                        </Column>
                                        <Column gap="$xs" flex={1} minWidth={120}>
                                            <FormLabel required>ZIP Code</FormLabel>
                                            <Input
                                                value={formData.zip}
                                                onChangeText={(value) => setFormData({ ...formData, zip: value })}
                                                placeholder="94102"
                                                size="md"
                                                required
                                            />
                                        </Column>
                                    </Row>

                                    {/* Phone */}
                                    <Column gap="$xs">
                                        <FormLabel>Phone Number</FormLabel>
                                        <Input
                                            value={formData.phone}
                                            onChangeText={(value) => setFormData({ ...formData, phone: value })}
                                            placeholder="(555) 123-4567"
                                            size="md"
                                            inputMode="tel"
                                        />
                                    </Column>

                                    {/* Default Address Checkbox */}
                                    <Row gap="$sm" alignItems="center">
                                        <input
                                            type="checkbox"
                                            checked={formData.isDefault}
                                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                            id="isDefault"
                                        />
                                        <Text size="$3" color="$text" onPress={() =>
                                            setFormData({ ...formData, isDefault: !formData.isDefault })
                                        }>
                                            Set as default shipping address
                                        </Text>
                                    </Row>
                                </Column>

                                <Button
                                    backgroundColor="$primary"
                                    color="$white"
                                    size="$5"
                                    onPress={handleSubmit}
                                >
                                    {editingAddress ? "Update Address" : "Save Address"}
                                </Button>
                            </Column>
                        </Card>
                    )}

                    {/* Addresses List */}
                    <Column gap="$md" width="100%">
                        {addresses.length === 0 ? (
                            <Card variant="outlined" padding="$xl">
                                <Column gap="$md" alignItems="center">
                                    <Text fontSize={48}>📦</Text>
                                    <Column gap="$sm" alignItems="center">
                                        <Heading level={4}>No shipping addresses yet</Heading>
                                        <Text color="$textSecondary" textAlign="center">
                                            Add a shipping address to start selling items on ButterGolf
                                        </Text>
                                    </Column>
                                    <Button
                                        backgroundColor="$primary"
                                        color="$white"
                                        size="$4"
                                        onPress={() => setShowForm(true)}
                                    >
                                        Add Your First Address
                                    </Button>
                                </Column>
                            </Card>
                        ) : (
                            addresses.map((address) => (
                                <Card
                                    key={address.id}
                                    variant="elevated"
                                    padding="$lg"
                                    width="100%"
                                >
                                    <Row justifyContent="space-between" alignItems="flex-start">
                                        <Column gap="$sm" flex={1}>
                                            <Row gap="$sm" alignItems="center">
                                                <Text size="$6" weight="semibold">
                                                    {address.name}
                                                </Text>
                                                {address.isDefault && (
                                                    <Text
                                                        size="$2"
                                                        backgroundColor="$primary"
                                                        color="$white"
                                                        paddingHorizontal="$sm"
                                                        paddingVertical="$xs"
                                                        borderRadius="$sm"
                                                    >
                                                        DEFAULT
                                                    </Text>
                                                )}
                                            </Row>
                                            <Column gap="$xs">
                                                <Text color="$textSecondary">{address.street1}</Text>
                                                {address.street2 && (
                                                    <Text color="$textSecondary">{address.street2}</Text>
                                                )}
                                                <Text color="$textSecondary">
                                                    {address.city}, {address.state} {address.zip}
                                                </Text>
                                                {address.phone && (
                                                    <Text color="$textSecondary">{address.phone}</Text>
                                                )}
                                            </Column>
                                        </Column>
                                        <Row gap="$sm">
                                            {!address.isDefault && (
                                                <Button
                                                    chromeless
                                                    size="$3"
                                                    onPress={() => handleSetDefault(address.id)}
                                                >
                                                    Set Default
                                                </Button>
                                            )}
                                            <Button
                                                chromeless
                                                size="$3"
                                                onPress={() => handleEdit(address)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                chromeless
                                                size="$3"
                                                color="$error"
                                                onPress={() => handleDelete(address.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Row>
                                    </Row>
                                </Card>
                            ))
                        )}
                    </Column>
                </Column>
            </Column>
        </Column>
    );
}