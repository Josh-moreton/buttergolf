"use client";

import React, { useCallback, useState } from "react";
import { TouchableOpacity, ActivityIndicator } from "react-native";
import { Column, Row, Text, View, Image, ScrollView, Spinner } from "@buttergolf/ui";
import { Camera, ImagePlus, X, Check, Sparkles } from "@tamagui/lucide-icons";

import type { ImageData } from "../types";

const MAX_IMAGES = 5;

interface PhotoStepProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
  /** Called to upload an image to CDN. isFirstImage triggers background removal. */
  onUploadImage?: (image: ImageData, isFirstImage: boolean) => Promise<string>;
  direction: "forward" | "backward";
  /** Platform-specific function to pick images from gallery */
  onPickImages?: () => Promise<ImageData[]>;
  /** Platform-specific function to take a photo with camera */
  onTakePhoto?: () => Promise<ImageData | null>;
}

export function PhotoStep({
  images,
  onImagesChange,
  onUploadImage,
  direction,
  onPickImages,
  onTakePhoto,
}: Readonly<PhotoStepProps>) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * Upload a single image to CDN.
   * Returns the image with the uploaded URL, or null if upload failed.
   */
  const uploadImage = useCallback(
    async (image: ImageData, isFirstImage: boolean): Promise<ImageData | null> => {
      if (!onUploadImage) {
        // If no upload function provided, just return the local image
        console.warn("onUploadImage not provided - using local URI");
        return image;
      }

      try {
        console.log("📤 PhotoStep: Uploading image...", { isFirstImage });
        const uploadedUrl = await onUploadImage(image, isFirstImage);
        console.log("✅ PhotoStep: Upload complete:", uploadedUrl);
        return {
          ...image,
          uri: uploadedUrl,
          uploaded: true,
          isFirstImage,
        };
      } catch (error) {
        console.error("❌ PhotoStep: Upload failed:", error);
        throw error;
      }
    },
    [onUploadImage],
  );

  const pickImage = useCallback(async () => {
    if (!onPickImages) {
      console.warn("onPickImages not provided to PhotoStep");
      return;
    }

    setUploadError(null);
    const newImages = await onPickImages();
    
    if (newImages.length > 0) {
      setUploading(true);
      
      try {
        // Upload each image, first image in the list gets background removal
        const uploadedImages: ImageData[] = [];
        const currentImageCount = images.length;
        
        for (let i = 0; i < newImages.length && currentImageCount + uploadedImages.length < MAX_IMAGES; i++) {
          const image = newImages[i];
          if (!image) continue;
          
          // First image in the entire listing (not just this batch) gets background removal
          const isFirstImage = currentImageCount === 0 && uploadedImages.length === 0;
          
          const uploaded = await uploadImage(image, isFirstImage);
          if (uploaded) {
            uploadedImages.push(uploaded);
          }
        }
        
        if (uploadedImages.length > 0) {
          onImagesChange([...images, ...uploadedImages]);
        }
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    }
  }, [images, onImagesChange, onPickImages, uploadImage]);

  const takePhoto = useCallback(async () => {
    if (!onTakePhoto) {
      console.warn("onTakePhoto not provided to PhotoStep");
      return;
    }

    setUploadError(null);
    const newImage = await onTakePhoto();
    
    if (newImage) {
      setUploading(true);
      
      try {
        // First image gets background removal
        const isFirstImage = images.length === 0;
        const uploaded = await uploadImage(newImage, isFirstImage);
        
        if (uploaded) {
          onImagesChange([...images, uploaded].slice(0, MAX_IMAGES));
        }
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    }
  }, [images, onImagesChange, onTakePhoto, uploadImage]);

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
            disabled={!canAddMore || uploading}
            style={{
              flex: 1,
              opacity: canAddMore && !uploading ? 1 : 0.5,
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
            disabled={!canAddMore || uploading}
            style={{
              flex: 1,
              opacity: canAddMore && !uploading ? 1 : 0.5,
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

        {/* Upload Status */}
        {uploading && (
          <Column
            backgroundColor="$lemonHaze"
            borderRadius="$xl"
            padding="$4"
            marginBottom="$4"
            alignItems="center"
            gap="$3"
          >
            <Spinner size="sm" color="$spicedClementine" />
            <Text size="$4" fontWeight="600" color="$burntOlive" textAlign="center">
              Uploading and processing your photo...
            </Text>
            <Text size="$3" fontWeight="400" color="$slateSmoke" textAlign="center">
              AI is removing the background for your cover photo
            </Text>
          </Column>
        )}

        {/* Upload Error */}
        {uploadError && (
          <Column
            backgroundColor="$errorLight"
            borderRadius="$xl"
            padding="$4"
            marginBottom="$4"
            borderWidth={1}
            borderColor="$error"
          >
            <Text size="$4" fontWeight="600" color="$error">
              Upload failed
            </Text>
            <Text size="$3" fontWeight="400" color="$error">
              {uploadError}
            </Text>
          </Column>
        )}

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
