"use client";

import React, { useEffect, useState } from "react";
import {
    Column,
    Row,
    ScrollView,
    Text,
    Spinner,
} from "@buttergolf/ui";
import { ProductCard } from "../../components/ProductCard";
import type { ProductCardData } from "../../types/product";
import { useLink } from "solito/navigation";
import { routes } from "../../navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MobileCategoryHeader, MobileBottomNav } from "../../components/mobile";

interface CategoryListScreenProps {
    categorySlug: string;
    categoryName: string;
    onFetchProducts?: (categorySlug: string) => Promise<ProductCardData[]>;
    onBack?: () => void;
    onFilter?: () => void;
}

export function CategoryListScreen({
    categorySlug,
    categoryName,
    onFetchProducts,
    onBack,
    onFilter,
}: Readonly<CategoryListScreenProps>) {
    const insets = useSafeAreaInsets();
    const [products, setProducts] = useState<ProductCardData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (onFetchProducts && !loading) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(true);
            onFetchProducts(categorySlug)
                .then((fetchedProducts) => {
                    console.log(`Fetched ${fetchedProducts.length} products for ${categorySlug}`);
                    setProducts(fetchedProducts);
                })
                .catch((error) => {
                    console.error("Failed to fetch products:", error);
                })
                .finally(() => setLoading(false));
        }
    }, [categorySlug, onFetchProducts, loading]);

    // Filter products based on search query
    const filteredProducts = searchQuery
        ? products.filter((product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : products;

    return (
        <Column flex={1} backgroundColor="$background">
            {/* Sticky Category Header - Fixed at top */}
            <Column
                position="absolute"
                top={0}
                left={0}
                right={0}
                zIndex={100}
            >
                <Column
                    backgroundColor="$background"
                    borderBottomLeftRadius="$2xl"
                    borderBottomRightRadius="$2xl"
                    shadowColor="rgba(0, 0, 0, 0.15)"
                    shadowOffset={{ width: 0, height: 4 }}
                    shadowOpacity={1}
                    shadowRadius={8}
                    elevation={8}
                >
                    <MobileCategoryHeader
                        categoryName={categoryName}
                        onBackPress={onBack}
                        onFilterPress={onFilter}
                        onSearch={setSearchQuery}
                        placeholder={`Search in ${categoryName}...`}
                    />
                </Column>
            </Column>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={{
                    paddingTop: insets.top + 130, // Account for sticky header
                    paddingBottom: insets.bottom + 80, // Account for bottom nav
                    paddingHorizontal: 16,
                }}
            >
                {loading ? (
                    <Column padding="$8" alignItems="center">
                        <Spinner size="lg" color="$primary" />
                        <Text marginTop="$4" color="$textSecondary">
                            Loading products...
                        </Text>
                    </Column>
                ) : filteredProducts.length === 0 ? (
                    <Column padding="$8" alignItems="center">
                        <Text size="$6" color="$textSecondary" textAlign="center">
                            {searchQuery
                                ? `No products found matching "${searchQuery}"`
                                : `No products available in ${categoryName}`}
                        </Text>
                    </Column>
                ) : (
                    /* 2-column grid */
                    <Column gap="$4">
                        {Array.from({ length: Math.ceil(filteredProducts.length / 2) }).map((_, rowIndex) => (
                            <Row key={rowIndex} gap="$4">
                                {filteredProducts.slice(rowIndex * 2, rowIndex * 2 + 2).map((product) => (
                                    <Column key={product.id} flex={1}>
                                        <ProductCardWithLink product={product} />
                                    </Column>
                                ))}
                                {/* Add empty column if odd number of products in last row */}
                                {rowIndex === Math.ceil(filteredProducts.length / 2) - 1 &&
                                    filteredProducts.length % 2 !== 0 && (
                                        <Column flex={1} />
                                    )}
                            </Row>
                        ))}
                    </Column>
                )}
            </ScrollView>

            {/* Bottom Navigation - Fixed at bottom */}
            <Column
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                zIndex={100}
            >
                <MobileBottomNav
                    activeTab="home"
                    onHomePress={() => console.log("Home pressed")}
                    onWishlistPress={() => console.log("Wishlist pressed")}
                    onSellPress={() => console.log("Sell pressed")}
                    onMessagesPress={() => console.log("Messages pressed")}
                    onLoginPress={() => console.log("Login pressed")}
                />
            </Column>
        </Column>
    );
}

// Helper component to attach Solito link to ProductCard
function ProductCardWithLink({
    product,
}: Readonly<{ product: ProductCardData }>) {
    const linkProps = useLink({
        href: routes.productDetail.replace("[id]", product.id),
    });

    return <ProductCard product={product} onPress={linkProps.onPress} />;
}
