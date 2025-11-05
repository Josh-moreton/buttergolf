"use client";

import { useState, useRef } from "react";
import { Text, Row, Column, Image, Spinner } from "@buttergolf/ui";
import { useImageUpload } from "../hooks/useImageUpload";

export interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  maxImages?: number;
  currentImages?: string[];
}

export function ImageUpload({
  onUploadComplete,
  maxImages = 5,
  currentImages = [],
}: Readonly<ImageUploadProps>) {
  const { upload, uploading, error, progress } = useImageUpload();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check max images limit
    if (currentImages.length >= maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Upload
    try {
      const result = await upload(file);
      onUploadComplete(result.url);
    } catch (err) {
      console.error("Upload error:", err);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];

      if (currentImages.length >= maxImages) {
        alert(`You can only upload up to ${maxImages} images`);
        return;
      }

      try {
        const result = await upload(file);
        onUploadComplete(result.url);
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Column gap="$md" width="100%">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Large Upload Area */}
      <Column
        backgroundColor={dragActive ? "$primaryLight" : "$surface"}
        borderWidth={2}
        borderColor={dragActive ? "$primary" : "$border"}
        borderStyle="dashed"
        borderRadius="$xl"
        padding="$10"
        alignItems="center"
        justifyContent="center"
        minHeight={currentImages.length === 0 ? 280 : 180}
        cursor="pointer"
        animation="quick"
        width="100%"
        hoverStyle={{
          borderColor: "$primary",
          backgroundColor: "$primaryLight",
        }}
        onPress={
          currentImages.length < maxImages ? handleButtonClick : undefined
        }
        {...{
          onDragEnter: handleDrag,
          onDragLeave: handleDrag,
          onDragOver: handleDrag,
          onDrop: handleDrop,
        }}
      >
        {uploading ? (
          <Column gap="$md" alignItems="center">
            <Spinner size="lg" color="$primary" />
            <Text size="md" color="$textSecondary" textAlign="center">
              Uploading... {progress.toString()}%
            </Text>
          </Column>
        ) : (
          <Column gap="$md" alignItems="center" width="100%" maxWidth={500}>
            <Column
              width={64}
              height={64}
              borderRadius="$full"
              backgroundColor="$primaryLight"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={32}>+</Text>
            </Column>
            <Column gap="$xs" alignItems="center">
              <Text
                size="lg"
                weight="semibold"
                textAlign="center"
                color="$text"
              >
                {currentImages.length === 0
                  ? "Upload photos"
                  : "Add more photos"}
              </Text>
              <Text
                size="sm"
                color="$textSecondary"
                textAlign="center"
                lineHeight={20}
              >
                or drag and drop
              </Text>
            </Column>
            <Text size="xs" color="$textMuted" textAlign="center">
              {currentImages.length}/{maxImages} photos • Max 10MB each
            </Text>
          </Column>
        )}
      </Column>

      {error && (
        <Text size="sm" color="$error" textAlign="center">
          {error}
        </Text>
      )}

      {/* Image Grid */}
      {currentImages.length > 0 && (
        <Column gap="$sm">
          <Row gap="$md" flexWrap="wrap">
            {currentImages.map((url, index) => (
              <Column
                key={url}
                position="relative"
                backgroundColor="$surface"
                borderRadius="$lg"
                overflow="hidden"
                borderWidth={1}
                borderColor="$border"
                width={140}
                height={140}
                hoverStyle={{
                  borderColor: "$primary",
                }}
              >
                <Image
                  source={{ uri: url }}
                  width={140}
                  height={140}
                  objectFit="cover"
                  alt="Uploaded product image"
                />
                {index === 0 && (
                  <Column
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    backgroundColor="rgba(0, 0, 0, 0.7)"
                    padding="$xs"
                  >
                    <Text
                      size="xs"
                      color="$textInverse"
                      textAlign="center"
                      fontWeight="600"
                    >
                      Cover photo
                    </Text>
                  </Column>
                )}
              </Column>
            ))}
          </Row>
        </Column>
      )}
    </Column>
  );
}
