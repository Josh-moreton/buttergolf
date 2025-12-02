"use client";

import React, { useCallback } from "react";
import { TouchableOpacity } from "react-native";
import { Column, Row, Text, View, Image, ScrollView } from "@buttergolf/ui";
import { Camera, ImagePlus, X, Check, Sparkles } from "@tamagui/lucide-icons";

import type { ImageData } from "../types";

const MAX_IMAGES = 5;

interface PhotoStepProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  onUploadImage?: (image: ImageData) => Promise<string>;
  direction: "forward" | "backward";
  /** Platform-specific function to pick images from gallery */
  onPickImages?: () => Promise<ImageData[]>;
  /** Platform-specific function to take a photo with camera */
  onTakePhoto?: () => Promise<ImageData | null>;
}

export function PhotoStep({
  images,
  onImagesChange,
  onUploadImage: _onUploadImage,
  direction,
  onPickImages,
  onTakePhoto,
}: Readonly<PhotoStepProps>) {
  const pickImage = useCallback(async () => {
    if (!onPickImages) {
      console.warn("onPickImages not provided to PhotoStep");
      return;
    }

    const newImages = await onPickImages();
    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages].slice(0, MAX_IMAGES);
      onImagesChange(updatedImages);
    }
  }, [images, onImagesChange, onPickImages]);

  const takePhoto = useCallback(async () => {
    if (!onTakePhoto) {
      console.warn("onTakePhoto not provided to PhotoStep");
      return;
    }

    const newImage = await onTakePhoto();
    if (newImage) {
      const updatedImages = [...images, newImage].slice(0, MAX_IMAGES);
      onImagesChange(updatedImages);
    }
  }, [images, onImagesChange, onTakePhoto]);

  const removeImage = useCallback(
    (index: number) => {
      const updatedImages = images.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
    },
    [images, onImagesChange],
  );

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <Column
      flex={1}
      animation="quick"
      enterStyle={{
        opacity: 0,
        x: direction === "forward" ? 50 : -50,
      }}
      exitStyle={{
        opacity: 0,
        x: direction === "forward" ? -50 : 50,
      }}
    >
      <ScrollView
        flex={1}
        contentContainerStyle={{
          padding: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <Column gap="$2" marginBottom="$5">
          <Text
            fontFamily="$heading"
            size="$10"
            fontWeight="800"
            color="$ironstone"
          >
            Add your photos
          </Text>
          <Text size="$5" fontWeight="400" color="$slateSmoke">
            Great photos help your item sell faster. Add up to {MAX_IMAGES}{" "}
            photos.
          </Text>
        </Column>

        {/* Photo Tips Card */}
        <Column
          backgroundColor="$lemonHaze"
          borderRadius="$xl"
          padding="$4"
          marginBottom="$5"
          gap="$3"
        >
          <Row alignItems="center" gap="$2">
            <Sparkles size={18} color="$burntOlive" />
            <Text
              fontFamily="$heading"
              size="$5"
              fontWeight="700"
              color="$burntOlive"
            >
              Tips for great photos
            </Text>
          </Row>
          <Column gap="$2">
            <Row alignItems="flex-start" gap="$3">
              <View
                width={20}
                height={20}
                borderRadius="$full"
                backgroundColor="$burntOlive"
                alignItems="center"
                justifyContent="center"
              >
                <Check size={12} color="$pureWhite" />
              </View>
              <Text size="$4" fontWeight="500" color="$burntOlive" flex={1}>
                Use a clean, uncluttered background
              </Text>
            </Row>
            <Row alignItems="flex-start" gap="$3">
              <View
                width={20}
                height={20}
                borderRadius="$full"
                backgroundColor="$burntOlive"
                alignItems="center"
                justifyContent="center"
              >
                <Check size={12} color="$pureWhite" />
              </View>
              <Text size="$4" fontWeight="500" color="$burntOlive" flex={1}>
                Use natural lighting for best results
              </Text>
            </Row>
            <Row alignItems="flex-start" gap="$3">
              <View
                width={20}
                height={20}
                borderRadius="$full"
                backgroundColor="$burntOlive"
                alignItems="center"
                justifyContent="center"
              >
                <Check size={12} color="$pureWhite" />
              </View>
              <Text size="$4" fontWeight="500" color="$burntOlive" flex={1}>
                Include multiple angles and any imperfections
              </Text>
            </Row>
          </Column>
        </Column>

        {/* Image Grid */}
        <Column marginBottom="$5">
          <Row flexWrap="wrap" gap="$3">
            {/* Existing Images */}
            {images.map((image, index) => (
              <View
                key={image.uri}
                width="30%"
                aspectRatio={1}
                borderRadius="$xl"
                overflow="hidden"
                position="relative"
              >
                <Image
                  source={{ uri: image.uri }}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
                {/* Cover badge for first image */}
                {index === 0 && (
                  <View
                    position="absolute"
                    bottom={8}
                    left={8}
                    backgroundColor="$spicedClementine"
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$md"
                  >
                    <Text size="$1" fontWeight="700" color="$pureWhite">
                      Cover
                    </Text>
                  </View>
                )}
                {/* Remove button */}
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: 14,
                    width: 28,
                    height: 28,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  accessibilityLabel={`Remove image ${index + 1}`}
                >
                  <X size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Image Placeholder */}
            {canAddMore && (
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  width: "30%",
                  aspectRatio: 1,
                }}
                accessibilityLabel="Add photo from library"
              >
                <Column
                  flex={1}
                  backgroundColor="$gray100"
                  borderRadius="$xl"
                  borderWidth={2}
                  borderColor="$cloudMist"
                  borderStyle="dashed"
                  alignItems="center"
                  justifyContent="center"
                  gap="$2"
                >
                  <View
                    width={44}
                    height={44}
                    borderRadius="$full"
                    backgroundColor="$cloudMist"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ImagePlus size={22} color="$slateSmoke" />
                  </View>
                  <Text size="$2" fontWeight="600" color="$slateSmoke">
                    Add Photo
                  </Text>
                </Column>
              </TouchableOpacity>
            )}
          </Row>
        </Column>

        {/* Action Buttons */}
        <Row gap="$3" marginBottom="$4">
          <TouchableOpacity
            onPress={pickImage}
            disabled={!canAddMore}
            style={{
              flex: 1,
              opacity: canAddMore ? 1 : 0.5,
            }}
            accessibilityLabel="Choose from gallery"
          >
            <Row
              backgroundColor="$pureWhite"
              borderWidth={2}
              borderColor="$cloudMist"
              borderRadius="$xl"
              paddingVertical="$3"
              paddingHorizontal="$4"
              alignItems="center"
              justifyContent="center"
              gap="$2"
            >
              <ImagePlus size={20} color="$ironstone" />
              <Text size="$5" fontWeight="600" color="$ironstone">
                Gallery
              </Text>
            </Row>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePhoto}
            disabled={!canAddMore}
            style={{
              flex: 1,
              opacity: canAddMore ? 1 : 0.5,
            }}
            accessibilityLabel="Take a photo"
          >
            <Row
              backgroundColor="$pureWhite"
              borderWidth={2}
              borderColor="$cloudMist"
              borderRadius="$xl"
              paddingVertical="$3"
              paddingHorizontal="$4"
              alignItems="center"
              justifyContent="center"
              gap="$2"
            >
              <Camera size={20} color="$ironstone" />
              <Text size="$5" fontWeight="600" color="$ironstone">
                Camera
              </Text>
            </Row>
          </TouchableOpacity>
        </Row>

        {/* Image count indicator */}
        <Row justifyContent="center">
          <View
            backgroundColor="$gray100"
            paddingHorizontal="$4"
            paddingVertical="$2"
            borderRadius="$full"
          >
            <Text size="$3" fontWeight="600" color="$slateSmoke">
              {images.length} of {MAX_IMAGES} photos
            </Text>
          </View>
        </Row>
      </ScrollView>
    </Column>
  );
}
