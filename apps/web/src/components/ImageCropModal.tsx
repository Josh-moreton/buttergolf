"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
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

  // Set canvas size to crop size
  canvas.width = crop.width;
  canvas.height = crop.height;

  // Draw cropped image
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
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
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

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
