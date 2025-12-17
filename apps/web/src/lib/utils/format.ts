/**
 * Format Utilities
 *
 * Reusable formatting functions for consistent data presentation
 * across the application.
 */

import { CARRIER_TRACKING_URLS } from "../constants";

/**
 * Format order ID to first 8 characters uppercase
 *
 * @param orderId - Full order ID (CUID)
 * @returns Shortened uppercase order ID (e.g., "ABC123DE")
 *
 * @example
 * formatOrderId("abc123def456") // "ABC123DE"
 */
export function formatOrderId(orderId: string): string {
  return orderId.slice(0, 8).toUpperCase();
}

/**
 * Build carrier-specific tracking URL with ShipEngine fallback
 *
 * Provides carrier-native tracking experience for better UX.
 * Falls back to ShipEngine generic tracking for unknown carriers.
 *
 * @param carrier - Carrier friendly name (e.g., "Royal Mail", "DPD")
 * @param trackingCode - Tracking number
 * @returns Carrier-specific tracking URL
 *
 * @example
 * buildTrackingUrl("Royal Mail", "AB123456789GB")
 * // "https://www.royalmail.com/track-your-item#/tracking-results/AB123456789GB"
 *
 * buildTrackingUrl("Unknown Carrier", "TRACK123")
 * // "https://www.shipengine.com/tracking/TRACK123"
 */
export function buildTrackingUrl(carrier: string, trackingCode: string): string {
  const urlBuilder = CARRIER_TRACKING_URLS[carrier];
  return urlBuilder
    ? urlBuilder(trackingCode)
    : `https://www.shipengine.com/tracking/${trackingCode}`;
}

/**
 * Format currency amount in GBP
 *
 * @param amount - Amount in pounds (decimal)
 * @returns Formatted currency string (e.g., "£4.99")
 *
 * @example
 * formatCurrency(4.99) // "£4.99"
 * formatCurrency(10)   // "£10.00"
 */
export function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

/**
 * Format date in UK format (DD/MM/YYYY)
 *
 * @param date - Date object or ISO string
 * @returns Formatted date string
 *
 * @example
 * formatDate(new Date("2025-12-17")) // "17/12/2025"
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-GB");
}

/**
 * Format datetime in UK format (DD/MM/YYYY, HH:MM:SS)
 *
 * @param date - Date object or ISO string
 * @returns Formatted datetime string
 *
 * @example
 * formatDateTime(new Date("2025-12-17T14:30:00")) // "17/12/2025, 14:30:00"
 */
export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-GB");
}

/**
 * Truncate text with ellipsis if exceeds max length
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 *
 * @example
 * truncate("Hello world", 5) // "Hello..."
 * truncate("Hi", 10)          // "Hi"
 */
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
