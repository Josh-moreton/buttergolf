import { prisma } from "@buttergolf/db";

// ShipEngine API client for UK shipping
const SHIPENGINE_API_KEY = process.env.SHIPENGINE_API_KEY;
const SHIPENGINE_BASE_URL = "https://api.shipengine.com";

export interface ShippingCalculationRequest {
  productId: string;
  toAddress: {
    street1: string;
    street2?: string;
    city: string;
    state?: string; // county for UK
    zip: string; // postcode for UK
    country?: string;
  };
  fromAddressId?: string;
}

export interface ShippingRate {
  carrier: string;
  service: string;
  rate: string; // Price in pence
  rateDisplay: string; // Formatted price for display
  estimatedDays: number;
  deliveryDate?: string;
  id?: string; // ShipEngine rate ID
}

export interface ShippingCalculationResult {
  rates: ShippingRate[];
  fromAddress: {
    city: string;
    state: string;
    zip: string;
  };
  toAddress: ShippingCalculationRequest["toAddress"];
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  fallback?: boolean;
}

interface ShipEngineRateResponse {
  rate_response: {
    rates: Array<{
      rate_id: string;
      carrier_friendly_name: string;
      service_type: string;
      shipping_amount: {
        currency: string;
        amount: number;
      };
      delivery_days: number;
      estimated_delivery_date?: string;
    }>;
    errors?: Array<{
      message: string;
    }>;
  };
}

/**
 * Call ShipEngine API
 */
async function shipEngineRequest<T>(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body?: unknown,
): Promise<T> {
  if (!SHIPENGINE_API_KEY) {
    throw new Error("ShipEngine API key not configured");
  }

  const response = await fetch(`${SHIPENGINE_BASE_URL}${endpoint}`, {
    method,
    headers: {
      "API-Key": SHIPENGINE_API_KEY,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ShipEngine API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Calculate shipping rates using ShipEngine API with fallback
 */
export async function calculateShippingRates(
  request: ShippingCalculationRequest,
): Promise<ShippingCalculationResult> {
  const { productId, toAddress, fromAddressId } = request;

  // Validate required fields
  if (
    !productId ||
    !toAddress?.street1 ||
    !toAddress?.city ||
    !toAddress?.zip
  ) {
    throw new Error("Missing required shipping calculation fields");
  }

  // Get product with seller information
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      user: {
        include: {
          addresses: {
            where: fromAddressId ? { id: fromAddressId } : { isDefault: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.isSold) {
    throw new Error("Product is already sold");
  }

  // Get seller's address
  const fromAddress = product.user.addresses[0];
  if (!fromAddress) {
    throw new Error("Seller has no shipping address configured");
  }

  // Get shipping dimensions (use defaults if not provided)
  const dimensions = {
    length: product.length || 30, // cm
    width: product.width || 20, // cm
    height: product.height || 10, // cm
    weight: product.weight || 500, // grams
  };

  // Try to get real shipping rates from ShipEngine
  if (SHIPENGINE_API_KEY) {
    try {
      // ShipEngine expects dimensions in inches and weight in ounces/pounds
      // Convert from cm to inches and grams to ounces
      const lengthInches = dimensions.length / 2.54;
      const widthInches = dimensions.width / 2.54;
      const heightInches = dimensions.height / 2.54;
      const weightOunces = dimensions.weight / 28.3495;

      const rateRequest = {
        rate_options: {
          carrier_ids: [], // Will use all connected carriers
          service_codes: [],
          calculate_tax_amount: false,
        },
        shipment: {
          ship_from: {
            name: fromAddress.name,
            address_line1: fromAddress.street1,
            address_line2: fromAddress.street2 || undefined,
            city_locality: fromAddress.city,
            state_province: fromAddress.state || "",
            postal_code: fromAddress.zip,
            country_code: fromAddress.country || "GB",
            phone: fromAddress.phone || undefined,
          },
          ship_to: {
            name: "Buyer",
            address_line1: toAddress.street1,
            address_line2: toAddress.street2 || undefined,
            city_locality: toAddress.city,
            state_province: toAddress.state || "",
            postal_code: toAddress.zip,
            country_code: toAddress.country || "GB",
          },
          packages: [
            {
              weight: {
                value: weightOunces,
                unit: "ounce",
              },
              dimensions: {
                length: lengthInches,
                width: widthInches,
                height: heightInches,
                unit: "inch",
              },
            },
          ],
        },
      };

      const response = await shipEngineRequest<ShipEngineRateResponse>(
        "/v1/rates",
        "POST",
        rateRequest,
      );

      if (response.rate_response.errors?.length) {
        console.warn("ShipEngine rate errors:", response.rate_response.errors);
      }

      // Process rates
      const rates: ShippingRate[] = response.rate_response.rates
        .filter((rate) => rate.shipping_amount.amount > 0)
        .slice(0, 5) // Limit to 5 options
        .map((rate) => {
          // Convert to pence (ShipEngine returns GBP for UK)
          const amountInPence = Math.ceil(rate.shipping_amount.amount * 100);
          return {
            carrier: rate.carrier_friendly_name || "Unknown",
            service: rate.service_type || "Standard",
            rate: amountInPence.toString(),
            rateDisplay: `£${(amountInPence / 100).toFixed(2)}`,
            estimatedDays: rate.delivery_days || 5,
            deliveryDate: rate.estimated_delivery_date || undefined,
            id: rate.rate_id,
          };
        });

      // Sort by price (cheapest first)
      rates.sort((a, b) => Number.parseInt(a.rate) - Number.parseInt(b.rate));

      if (rates.length > 0) {
        return {
          rates,
          fromAddress: {
            city: fromAddress.city,
            state: fromAddress.state,
            zip: fromAddress.zip,
          },
          toAddress,
          dimensions,
        };
      }
    } catch (shipEngineError: unknown) {
      console.warn(
        "ShipEngine API error, falling back to estimation:",
        shipEngineError,
      );
      // Fall through to fallback calculation
    }
  }

  // Fallback calculation if ShipEngine is not available or fails
  // UK-specific carriers and pricing in GBP (pence)
  const fallbackRates: ShippingRate[] = [
    {
      carrier: "Royal Mail",
      service: "Tracked 48",
      rate: "499", // £4.99 in pence
      rateDisplay: "£4.99",
      estimatedDays: 3,
    },
    {
      carrier: "Royal Mail",
      service: "Tracked 24",
      rate: "699", // £6.99 in pence
      rateDisplay: "£6.99",
      estimatedDays: 1,
    },
    {
      carrier: "Evri",
      service: "Standard",
      rate: "399", // £3.99 in pence
      rateDisplay: "£3.99",
      estimatedDays: 5,
    },
    {
      carrier: "DPD",
      service: "Next Day",
      rate: "899", // £8.99 in pence
      rateDisplay: "£8.99",
      estimatedDays: 1,
    },
  ];

  return {
    rates: fallbackRates,
    fallback: true,
    fromAddress: {
      city: fromAddress.city,
      state: fromAddress.state,
      zip: fromAddress.zip,
    },
    toAddress,
    dimensions,
  };
}

/**
 * Quick shipping rate estimation (for product pages)
 */
export async function estimateShippingRate(
  productId: string,
  postcode: string,
  county: string = "",
): Promise<{
  estimatedRate: number;
  estimatedDisplay: string;
  fromPostcode: string;
  toPostcode: string;
  note: string;
}> {
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
    throw new Error("Product not found");
  }

  if (product.isSold) {
    throw new Error("Product is already sold");
  }

  // Quick estimate without full address
  const fromAddress = product.user.addresses[0];
  if (!fromAddress) {
    throw new Error("Seller has no shipping address configured");
  }

  // Use simplified calculation for quick estimates (UK pricing in pence)
  const baseRate = 499; // £4.99 base rate
  const weight = product.weight || 500;

  // Add £1 for every 500g over 500g
  const weightSurcharge = Math.max(0, Math.floor((weight - 500) / 500)) * 100;

  const estimatedRate = baseRate + weightSurcharge;

  return {
    estimatedRate,
    estimatedDisplay: `£${(estimatedRate / 100).toFixed(2)}`,
    fromPostcode: fromAddress.zip,
    toPostcode: postcode,
    note: `Estimate to ${postcode}${county ? `, ${county}` : ""} only - actual rates calculated at checkout`,
  };
}
