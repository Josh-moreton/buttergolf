"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Column, Row, Button, Text, Heading, Spinner } from "@buttergolf/ui";

interface ImageCropModalProps {
  imageFile: File;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  open: boolean;
}

async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // CRITICAL FIX: Scale crop coordinates from displayed size to natural size
  // The crop library gives us coordinates relative to the displayed image size,
  // but we need to draw from the natural (full resolution) image
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Debug logging to verify coordinate scaling
  console.log("🖼️ Image Crop Debug:", {
    natural: { width: image.naturalWidth, height: image.naturalHeight },
    displayed: { width: image.width, height: image.height },
    scale: { x: scaleX, y: scaleY },
    cropDisplayed: { x: crop.x, y: crop.y, width: crop.width, height: crop.height },
    cropNatural: {
      x: crop.x * scaleX,
      y: crop.y * scaleY,
      width: crop.width * scaleX,
      height: crop.height * scaleY
    },
  });

  // Set canvas size to natural crop dimensions
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  // Draw cropped image using scaled coordinates
  ctx.drawImage(
    image,
    crop.x * scaleX,      // Scale source x
    crop.y * scaleY,      // Scale source y
    crop.width * scaleX,  // Scale source width
    crop.height * scaleY, // Scale source height
    0,                    // Destination x (always 0)
    0,                    // Destination y (always 0)
    crop.width * scaleX,  // Destination width (scaled)
    crop.height * scaleY  // Destination height (scaled)
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.95 // Quality (0.95 = high quality)
    );
  });
}

export function ImageCropModal({
  imageFile,
  onCropComplete,
  onCancel,
  open,
}: Readonly<ImageCropModalProps>) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Calculate a centered 1:1 aspect ratio crop when the image loads
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight, width, height } = e.currentTarget;

      // Create a 1:1 aspect ratio crop that takes up 90% of the smaller dimension
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: "%",
            width: 90,
          },
          1, // 1:1 aspect ratio (square)
          naturalWidth,
          naturalHeight
        ),
        naturalWidth,
        naturalHeight
      );

      setCrop(initialCrop);

      // Also calculate and set the pixel crop so the Apply button is enabled immediately
      // Convert percentage crop to pixel crop based on displayed dimensions
      const pixelCrop: PixelCrop = {
        unit: "px",
        x: (initialCrop.x / 100) * width,
        y: (initialCrop.y / 100) * height,
        width: (initialCrop.width / 100) * width,
        height: (initialCrop.height / 100) * height,
      };
      setCompletedCrop(pixelCrop);
    },
    []
  );

  // Load file into memory as blob URL
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageSrc(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleApplyCrop = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      onCropComplete(croppedBlob);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Failed to crop image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "24px",
      }}
    >
      {/* Modal Content */}
      <Column
        backgroundColor="$surface"
        borderRadius="$xl"
        padding="$xl"
        gap="$lg"
        maxWidth="90vw"
        maxHeight="90vh"
        width="100%"
      >
          {/* Header */}
          <Column gap="$sm">
            <Heading level={3} size="$7" color="$text">
              Crop Image
            </Heading>
            <Text size="$4" color="$textSecondary">
              Adjust the crop area to frame your product perfectly. All images
              will be square.
            </Text>
          </Column>

          {/* Crop Area */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              overflow: "auto",
              backgroundColor: "var(--background)",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  style={{ maxWidth: "100%", maxHeight: "60vh" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </div>

          {/* Footer Buttons */}
          <Row gap="$md" justifyContent="flex-end">
            <Button
              size="$5"
              backgroundColor="$surface"
              color="$text"
              borderWidth={1}
              borderColor="$border"
              onPress={onCancel}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              size="$5"
              backgroundColor="$primary"
              color="$textInverse"
              onPress={handleApplyCrop}
              disabled={!completedCrop || isProcessing}
            >
              {isProcessing ? (
                <Row gap="$sm" alignItems="center">
                  <Spinner size="sm" color="$textInverse" />
                  <Text color="$textInverse">Processing...</Text>
                </Row>
              ) : (
                "Apply Crop"
              )}
            </Button>
          </Row>
        </Column>
      </div>
  );
}
