'use client'

import { useState, useRef } from 'react'
import { Button, Text, YStack, XStack, Image, Spinner } from '@buttergolf/ui'
import { useImageUpload } from '../hooks/useImageUpload'

export interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  maxImages?: number
  currentImages?: string[]
}

export function ImageUpload({ 
  onUploadComplete, 
  maxImages = 5,
  currentImages = []
}: Readonly<ImageUploadProps>) {
  const { upload, uploading, error, progress } = useImageUpload()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check max images limit
    if (currentImages.length >= maxImages) {
      alert(`You can only upload up to ${maxImages} images`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    try {
      const result = await upload(file)
      onUploadComplete(result.url)
      setPreviewUrl(null)
    } catch (err) {
      console.error('Upload error:', err)
      setPreviewUrl(null)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <YStack gap="$md">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <Button
        onPress={handleButtonClick}
        disabled={uploading || currentImages.length >= maxImages}
        size="lg"
        tone="outline"
      >
        {uploading ? 'Uploading...' : `Upload Image (${currentImages.length}/${maxImages})`}
      </Button>

      {uploading && (
        <YStack gap="$sm" alignItems="center">
          <Spinner size="md" {...{ color: "$primary" as any }} />
          <Text size="sm" {...{ color: "$textSecondary" as any }}>
            Uploading... {progress.toString()}%
          </Text>
        </YStack>
      )}

      {error && (
        <Text size="sm" {...{ color: "$error" as any }}>
          {error}
        </Text>
      )}

      {previewUrl && (
        <YStack
          backgroundColor="$surface"
          borderRadius="$lg"
          padding="$md"
          borderWidth={1}
          borderColor="$border"
        >
          <Image
            source={{ uri: previewUrl }}
            width="100%"
            height={200}
            objectFit="cover"
            borderRadius="$md"
          />
        </YStack>
      )}

      {currentImages.length > 0 && (
        <YStack gap="$sm">
          <Text size="sm" weight="semibold">
            Uploaded Images:
          </Text>
          <XStack gap="$sm" flexWrap="wrap">
            {currentImages.map((url, index) => (
              <YStack
                key={url}
                backgroundColor="$surface"
                borderRadius="$md"
                padding="$xs"
                borderWidth={1}
                borderColor="$border"
              >
                <Image
                  source={{ uri: url }}
                  width={80}
                  height={80}
                  objectFit="cover"
                  borderRadius="$sm"
                />
                <Text size="xs" {...{ color: "$textMuted" as any }} marginTop="$xs" textAlign="center">
                  {index + 1}
                </Text>
              </YStack>
            ))}
          </XStack>
        </YStack>
      )}

      <Text size="xs" {...{ color: "$textMuted" as any }}>
        Max file size: 10MB. Formats: JPEG, PNG, WebP, GIF
      </Text>
    </YStack>
  )
}
