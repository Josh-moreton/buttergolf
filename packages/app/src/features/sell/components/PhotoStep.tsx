"use client";

import React, { useCallback } from "react";
import { Platform, TouchableOpacity, Alert } from "react-native";
import {
  Column,
  Row,
  Text,
  Heading,
  View,
  Image,
  ScrollView,
  Button,
} from "@buttergolf/ui";
import { Camera, ImagePlus, X, Check } from "@tamagui/lucide-icons";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";

import type { ImageData } from "../types";

const MAX_IMAGES = 5;

interface PhotoStepProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  onUploadImage?: (image: ImageData) => Promise<string>;
  direction: "forward" | "backward";
}

export function PhotoStep({
  images,
  onImagesChange,
  onUploadImage: _onUploadImage,
  direction,
}: Readonly<PhotoStepProps>) {
  // Note: _onUploadImage is available for server-side image upload integration
  // Currently images are stored locally until form submission

  const requestPermissions = useCallback(async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Please grant camera and photo library permissions to add photos."
        );
        return false;
      }
    }
    return true;
  }, []);

  const pickImage = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newImages: ImageData[] = result.assets.map((asset: ImagePickerAsset) => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      }));

      const updatedImages = [...images, ...newImages].slice(0, MAX_IMAGES);
      onImagesChange(updatedImages);
    }
  }, [images, onImagesChange, requestPermissions]);

  const takePhoto = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset) {
        const newImage: ImageData = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        };

        const updatedImages = [...images, newImage].slice(0, MAX_IMAGES);
        onImagesChange(updatedImages);
      }
    }
  }, [images, onImagesChange, requestPermissions]);

  const removeImage = useCallback(
    (index: number) => {
      const updatedImages = images.filter((_, i) => i !== index);
      onImagesChange(updatedImages);
    },
    [images, onImagesChange]
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
          padding: 16,
        }}
      >
        {/* Instructions */}
        <Column gap="$2" marginBottom="$4">
          <Heading level={4} fontSize={16} color="$text" fontWeight="600">
            Add photos of your item
          </Heading>
          <Text fontSize={14} color="$textSecondary">
            Add up to {MAX_IMAGES} photos. The first photo will be your listing
            cover image.
          </Text>
        </Column>

        {/* Photo Tips */}
        <Column
          backgroundColor="$lemonHaze"
          borderRadius="$lg"
          padding="$3"
          marginBottom="$4"
          gap="$2"
        >
          <Row alignItems="center" gap="$2">
            <Check size={16} color="$secondary" />
            <Text fontSize={13} color="$secondary" fontWeight="500">
              Use a clean, uncluttered background
            </Text>
          </Row>
          <Row alignItems="center" gap="$2">
            <Check size={16} color="$secondary" />
            <Text fontSize={13} color="$secondary" fontWeight="500">
              Ensure good lighting - natural light works best
            </Text>
          </Row>
          <Row alignItems="center" gap="$2">
            <Check size={16} color="$secondary" />
            <Text fontSize={13} color="$secondary" fontWeight="500">
              Include multiple angles and close-ups
            </Text>
          </Row>
        </Column>

        {/* Image Grid */}
        <Row flexWrap="wrap" gap="$3" marginBottom="$4">
          {/* Existing Images */}
          {images.map((image, index) => (
            <View
              key={image.uri}
              width="30%"
              aspectRatio={1}
              borderRadius="$lg"
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
                  bottom={4}
                  left={4}
                  backgroundColor="$primary"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$sm"
                >
                  <Text fontSize={10} color="white" fontWeight="600">
                    Cover
                  </Text>
                </View>
              )}
              {/* Remove button */}
              <TouchableOpacity
                onPress={() => removeImage(index)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: 12,
                  width: 24,
                  height: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                accessibilityLabel={`Remove image ${index + 1}`}
              >
                <X size={14} color="white" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Image Button */}
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
                backgroundColor="$cloudMist"
                borderRadius="$lg"
                borderWidth={2}
                borderColor="$border"
                borderStyle="dashed"
                alignItems="center"
                justifyContent="center"
                gap="$1"
              >
                <ImagePlus size={28} color="$textSecondary" />
                <Text fontSize={11} color="$textSecondary" fontWeight="500">
                  Add Photo
                </Text>
              </Column>
            </TouchableOpacity>
          )}
        </Row>

        {/* Action Buttons */}
        <Row gap="$3">
          <Button
            flex={1}
            size="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$border"
            color="$text"
            borderRadius="$lg"
            onPress={pickImage}
            disabled={!canAddMore}
            icon={<ImagePlus size={18} />}
          >
            Gallery
          </Button>
          <Button
            flex={1}
            size="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$border"
            color="$text"
            borderRadius="$lg"
            onPress={takePhoto}
            disabled={!canAddMore}
            icon={<Camera size={18} />}
          >
            Camera
          </Button>
        </Row>

        {/* Image count */}
        <Text
          fontSize={13}
          color="$textSecondary"
          textAlign="center"
          marginTop="$3"
        >
          {images.length} of {MAX_IMAGES} photos added
        </Text>
      </ScrollView>
    </Column>
  );
}
