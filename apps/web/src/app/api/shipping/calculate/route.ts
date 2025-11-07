import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@buttergolf/db";
import EasyPostClient from '@easypost/api';

// Create EasyPost client
function getEasyPostClient() {
    const apiKey = process.env.EASYPOST_API_KEY;
    if (!apiKey) {
        return null; // Return null if API key not configured
    }
    return new EasyPostClient(apiKey);
}

interface ShippingCalculationRequest {
    productId: string;
    toAddress: {
        street1: string;
        street2?: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
    };
    fromAddressId?: string; // Optional, will use seller's default if not provided
}

interface ShippingRate {
    carrier: string;
    service: string;
    rate: string; // Price in cents
    rateDisplay: string; // Formatted price for display
    estimatedDays: number;
    deliveryDate?: string;
    id?: string; // EasyPost rate ID
}

// POST /api/shipping/calculate - Calculate shipping rates for a product
export async function POST(request: NextRequest) {
    try {
        const body: ShippingCalculationRequest = await request.json();
        const { productId, toAddress, fromAddressId } = body;

        // Validate required fields
        if (!productId || !toAddress || !toAddress.street1 || !toAddress.city || !toAddress.state || !toAddress.zip) {
            return NextResponse.json(
                { error: "Missing required shipping calculation fields" },
                { status: 400 }
            );
        }

        // Get product with seller information
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                user: {
                    include: {
                        addresses: {
                            where: fromAddressId
                                ? { id: fromAddressId }
                                : { isDefault: true },
                            take: 1,
                        },
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.isSold) {
            return NextResponse.json({ error: "Product is already sold" }, { status: 400 });
        }

        // Get seller's address
        const fromAddress = product.user.addresses[0];
        if (!fromAddress) {
            return NextResponse.json(
                { error: "Seller has no shipping address configured" },
                { status: 400 }
            );
        }

        // Get shipping dimensions (use defaults if not provided)
        const dimensions = {
            length: product.length || 30, // cm
            width: product.width || 20,   // cm
            height: product.height || 10, // cm
            weight: product.weight || 500, // grams
        };

        // Try to get real shipping rates from EasyPost
        const easyPostClient = getEasyPostClient();

        if (easyPostClient) {
            try {
                // Create addresses for EasyPost
                const fromAddressEP = await easyPostClient.Address.create({
                    name: fromAddress.name,
                    street1: fromAddress.street1,
                    street2: fromAddress.street2 || undefined,
                    city: fromAddress.city,
                    state: fromAddress.state,
                    zip: fromAddress.zip,
                    country: fromAddress.country,
                    phone: fromAddress.phone || undefined,
                });

                const toAddressEP = await easyPostClient.Address.create({
                    name: "Buyer", // We don't have buyer's name yet
                    street1: toAddress.street1,
                    street2: toAddress.street2 || undefined,
                    city: toAddress.city,
                    state: toAddress.state,
                    zip: toAddress.zip,
                    country: toAddress.country || "US",
                });

                // Create parcel
                const parcel = await easyPostClient.Parcel.create({
                    length: dimensions.length / 2.54, // Convert cm to inches for EasyPost
                    width: dimensions.width / 2.54,
                    height: dimensions.height / 2.54,
                    weight: dimensions.weight / 453.592, // Convert grams to ounces for EasyPost
                });

                // Create shipment to get rates
                const shipment = await easyPostClient.Shipment.create({
                    to_address: toAddressEP,
                    from_address: fromAddressEP,
                    parcel: parcel,
                });

                // Process rates
                const rates: ShippingRate[] = shipment.rates
                    .filter((rate: any) => rate.rate && Number.parseFloat(rate.rate) > 0)
                    .slice(0, 5) // Limit to 5 options
                    .map((rate: any) => ({
                        carrier: rate.carrier || "Unknown",
                        service: rate.service || "Standard",
                        rate: Math.ceil(Number.parseFloat(rate.rate) * 100).toString(), // Convert to cents and round up
                        rateDisplay: `$${(Math.ceil(Number.parseFloat(rate.rate) * 100) / 100).toFixed(2)}`,
                        estimatedDays: rate.est_delivery_days || 5,
                        deliveryDate: rate.delivery_date || undefined,
                        id: rate.id,
                    }));

                // Sort by price (cheapest first)
                rates.sort((a, b) => Number.parseInt(a.rate) - Number.parseInt(b.rate));

                return NextResponse.json({
                    rates,
                    fromAddress: {
                        city: fromAddress.city,
                        state: fromAddress.state,
                        zip: fromAddress.zip,
                    },
                    toAddress,
                    dimensions,
                });
            } catch (easyPostError) {
                console.warn("EasyPost API error, falling back to estimation:", easyPostError);
                // Fall through to fallback calculation
            }
        }

        // Fallback calculation if EasyPost is not available or fails
        const fallbackRates: ShippingRate[] = [
            {
                carrier: "USPS",
                service: "Ground Advantage",
                rate: "999", // $9.99 in cents
                rateDisplay: "$9.99",
                estimatedDays: 5,
            },
            {
                carrier: "USPS",
                service: "Priority Mail",
                rate: "1599", // $15.99 in cents
                rateDisplay: "$15.99",
                estimatedDays: 3,
            },
        ];

        return NextResponse.json({
            rates: fallbackRates,
            fallback: true,
            fromAddress: {
                city: fromAddress.city,
                state: fromAddress.state,
                zip: fromAddress.zip,
            },
            toAddress,
            dimensions,
        });

    } catch (error) {
        console.error("Error calculating shipping rates:", error);
        return NextResponse.json(
            { error: "Failed to calculate shipping rates" },
            { status: 500 }
        );
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
                { status: 400 }
            );
        }

        // Get product
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                user: {
                    include: {
                        addresses: {
                            where: { isDefault: true },
                            take: 1,
                        },
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.isSold) {
            return NextResponse.json({ error: "Product is already sold" }, { status: 400 });
        }

        // Quick estimate without full address
        const fromAddress = product.user.addresses[0];
        if (!fromAddress) {
            return NextResponse.json(
                { error: "Seller has no shipping address configured" },
                { status: 400 }
            );
        }

        // Use simplified calculation for quick estimates
        const baseRate = 999; // $9.99 base rate
        const weight = product.weight || 500;

        // Add $1 for every 500g over 500g
        const weightSurcharge = Math.max(0, Math.floor((weight - 500) / 500)) * 100;

        const estimatedRate = baseRate + weightSurcharge;

        return NextResponse.json({
            estimatedRate,
            estimatedDisplay: `$${(estimatedRate / 100).toFixed(2)}`,
            fromZip: fromAddress.zip,
            toZip: zip,
            note: "Estimate only - actual rates calculated at checkout",
        });

    } catch (error) {
        console.error("Error estimating shipping rate:", error);
        return NextResponse.json(
            { error: "Failed to estimate shipping rate" },
            { status: 500 }
        );
    }
}