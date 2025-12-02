import { NextRequest, NextResponse } from "next/server";
import {
  calculateShippingRates,
  estimateShippingRate,
  ShippingCalculationRequest,
} from "@/lib/shipping";

// POST /api/shipping/calculate - Calculate shipping rates for a product
export async function POST(request: NextRequest) {
  try {
    const body: ShippingCalculationRequest = await request.json();
    const result = await calculateShippingRates(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error calculating shipping rates:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to calculate shipping rates";
    const status =
      message === "Product not found"
        ? 404
        : message.includes("Missing required")
          ? 400
          : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// GET /api/shipping/calculate?productId=xxx&zip=12345 - Quick rate estimate (for product pages)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const zip = searchParams.get("zip");
    const state = searchParams.get("state") || "CA"; // Default to CA if not provided

    if (!productId || !zip) {
      return NextResponse.json(
        { error: "productId and zip are required" },
        { status: 400 },
      );
    }

    const result = await estimateShippingRate(productId, zip, state);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error estimating shipping rate:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to estimate shipping rate";
    const status = message === "Product not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
