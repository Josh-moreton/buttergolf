"use client";

import React, { useState } from "react";
import { Row, Column, Input } from "@buttergolf/ui";
import { Search as SearchIcon } from "@tamagui/lucide-icons";

export interface MobileSearchBarProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    /**
     * Callback to render search suggestions based on the current query.
     * Return null or undefined to hide suggestions.
     */
    renderSuggestions?: (query: string) => React.ReactNode;
    /**
     * Width percentage of screen (default: 85%)
     */
    widthPercent?: number;
}

/**
 * Mobile-optimized search bar with pill shape, Cloud Mist borders, and responsive search suggestions.
 * Based on Figma mockup - sits in a container with rounded bottom edges.
 */
export function MobileSearchBar({
    placeholder = "What are you looking for?",
    onSearch,
    renderSuggestions,
    widthPercent = 85,
}: Readonly<MobileSearchBarProps>) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleChangeText = (text: string) => {
        setQuery(text);
        onSearch?.(text);
    };

    const showSuggestions = isFocused && query.length > 0 && renderSuggestions;

    return (
        <Column
            paddingHorizontal="$4"
            paddingVertical="$3"
            backgroundColor="$background"
            borderBottomLeftRadius="$lg"
            borderBottomRightRadius="$lg"
        >
            {/* Search Input Container */}
            <Row
                width={`${widthPercent}%`}
                alignSelf="center"
                height={48}
                backgroundColor="$surface"
                borderRadius="$full"
                paddingHorizontal="$4"
                alignItems="center"
                gap="$2"
                borderWidth={1}
                borderColor="$ironstone"
            >
                <SearchIcon size={20} color="$ironstone" />
                <Input
                    flex={1}
                    unstyled
                    value={query}
                    onChangeText={handleChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        // Delay to allow suggestion clicks to register
                        setTimeout(() => setIsFocused(false), 200);
                    }}
                    placeholder={placeholder}
                    placeholderTextColor="$ironstone"
                    fontSize={15}
                    color="$text"
                    borderWidth={0}
                    backgroundColor="transparent"
                    height="100%"
                />
            </Row>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
                <Column
                    width={`${widthPercent}%`}
                    alignSelf="center"
                    marginTop="$2"
                    backgroundColor="$surface"
                    borderRadius="$md"
                    borderWidth={1}
                    borderColor="$ironstone"
                    overflow="hidden"
                    shadowColor="$shadowColor"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.1}
                    shadowRadius={4}
                    elevation={3}
                >
                    {renderSuggestions(query)}
                </Column>
            )}
        </Column>
    );
}
