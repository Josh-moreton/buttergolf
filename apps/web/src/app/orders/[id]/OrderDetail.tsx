"use client";

import Link from "next/link";
import Image from "next/image";
import { OrderMessages } from "./OrderMessages";
import { OrderRating } from "./OrderRating";
import { AnimationErrorBoundary } from "@/app/_components/ErrorBoundary";
import { Card, Text } from "@buttergolf/ui";
import { buildTrackingUrl } from "@/lib/utils/format";

type OrderStatus =
  | "PAYMENT_CONFIRMED"
  | "LABEL_GENERATED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";
type ShipmentStatus =
  | "PENDING"
  | "PRE_TRANSIT"
  | "IN_TRANSIT"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RETURNED"
  | "FAILED"
  | "CANCELLED";

interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  shipmentStatus: ShipmentStatus;
  amountTotal: number;
  shippingCost: number;
  trackingCode: string | null;
  trackingUrl: string | null;
  labelUrl: string | null;
  carrier: string | null;
  service: string | null;
  estimatedDelivery: Date | null;
  deliveredAt: Date | null;
  shippedAt: Date | null;
  labelGeneratedAt: Date | null;
  userRole: "buyer" | "seller";
  currentUserId: string;
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    brand: string | null;
    model: string | null;
    images: Array<{ url: string }>;
    category: {
      name: string;
    };
  };
  seller: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string | null;
  };
  buyer: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string | null;
  };
  fromAddress: {
    name: string;
    street1: string;
    street2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string | null;
  };
  toAddress: {
    name: string;
    street1: string;
    street2: string | null;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string | null;
  };
}

interface OrderDetailProps {
  order: Order;
}

const STATUS_COLORS: Record<ShipmentStatus, string> = {
  PENDING: "bg-gray-200 text-gray-700",
  PRE_TRANSIT: "bg-blue-100 text-blue-700",
  IN_TRANSIT: "bg-yellow-100 text-yellow-700",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
  RETURNED: "bg-red-100 text-red-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  PENDING: "Pending Label",
  PRE_TRANSIT: "Label Created",
  IN_TRANSIT: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  RETURNED: "Returned",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link href="/orders" className="text-blue-600 hover:underline">
        ← Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order Details</h1>
            <p className="text-gray-600">Order #{order.id}</p>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              STATUS_COLORS[order.shipmentStatus]
            }`}
          >
            {STATUS_LABELS[order.shipmentStatus]}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Product</h2>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            {order.product.images[0] ? (
              <Image
                src={order.product.images[0].url}
                alt={order.product.title}
                width={150}
                height={150}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-[150px] h-[150px] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <Link
              href={`/products/${order.product.id}`}
              className="text-xl font-semibold hover:text-blue-600"
            >
              {order.product.title}
            </Link>
            <p className="text-gray-600 mt-1">{order.product.description}</p>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {order.product.category.name}
              </p>
              <p>
                <span className="font-medium">Condition:</span>{" "}
                {order.product.condition.replace(/_/g, " ")}
              </p>
              {order.product.brand && (
                <p>
                  <span className="font-medium">Brand:</span>{" "}
                  {order.product.brand}
                </p>
              )}
              {order.product.model && (
                <p>
                  <span className="font-medium">Model:</span>{" "}
                  {order.product.model}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

        {order.carrier && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-900">
              {order.carrier} {order.service && `- ${order.service}`}
            </p>
            {order.trackingCode && (
              <p className="text-sm text-blue-700 mt-1">
                Tracking:{" "}
                {order.carrier ? (
                  <a
                    href={buildTrackingUrl(order.carrier, order.trackingCode)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    {order.trackingCode}
                  </a>
                ) : (
                  <span className="font-medium">{order.trackingCode}</span>
                )}
              </p>
            )}
            {order.estimatedDelivery && (
              <p className="text-sm text-blue-700 mt-1">
                Estimated Delivery:{" "}
                {new Date(order.estimatedDelivery).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3">
          {order.labelGeneratedAt && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className="font-medium">Label Created</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.labelGeneratedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          {order.shippedAt && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className="font-medium">Package Shipped</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.shippedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          {order.deliveredAt && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className="font-medium">Delivered</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.deliveredAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Addresses */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">From (Seller)</h3>
            <div className="text-sm text-gray-600">
              <p>{order.fromAddress.name}</p>
              <p>{order.fromAddress.street1}</p>
              {order.fromAddress.street2 && <p>{order.fromAddress.street2}</p>}
              <p>
                {order.fromAddress.city}, {order.fromAddress.state}{" "}
                {order.fromAddress.zip}
              </p>
              <p>{order.fromAddress.country}</p>
              {order.fromAddress.phone && <p>{order.fromAddress.phone}</p>}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">To (Buyer)</h3>
            <div className="text-sm text-gray-600">
              <p>{order.toAddress.name}</p>
              <p>{order.toAddress.street1}</p>
              {order.toAddress.street2 && <p>{order.toAddress.street2}</p>}
              <p>
                {order.toAddress.city}, {order.toAddress.state}{" "}
                {order.toAddress.zip}
              </p>
              <p>{order.toAddress.country}</p>
              {order.toAddress.phone && <p>{order.toAddress.phone}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Product Price</span>
            <span>£{order.product.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>£{order.shippingCost.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>£{order.amountTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Seller Actions */}
        {order.userRole === "seller" && order.labelUrl && (
          <div className="mt-6">
            <a
              href={order.labelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Download Shipping Label
            </a>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Print this label and attach it to your package. Drop it off at any{" "}
              {order.carrier} location.
            </p>
          </div>
        )}

        {/* Buyer Tracking */}
        {order.userRole === "buyer" && order.trackingCode && order.carrier && (
          <div className="mt-6">
            <a
              href={buildTrackingUrl(order.carrier, order.trackingCode)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Track Package
            </a>
          </div>
        )}
      </div>

      {/* Participants */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Participants</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Seller</h3>
            <div className="flex items-center gap-3">
              {order.seller.imageUrl && (
                <Image
                  src={order.seller.imageUrl}
                  alt={`${order.seller.firstName} ${order.seller.lastName}`.trim() || "Seller"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium">
                  {`${order.seller.firstName} ${order.seller.lastName}`.trim() || order.seller.email}
                </p>
                <p className="text-sm text-gray-600">{order.seller.email}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Buyer</h3>
            <div className="flex items-center gap-3">
              {order.buyer.imageUrl && (
                <Image
                  src={order.buyer.imageUrl}
                  alt={`${order.buyer.firstName} ${order.buyer.lastName}`.trim() || "Buyer"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-medium">
                  {`${order.buyer.firstName} ${order.buyer.lastName}`.trim() || order.buyer.email}
                </p>
                <p className="text-sm text-gray-600">{order.buyer.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Section - shown after delivery for buyers */}
      <AnimationErrorBoundary
        fallback={
          <Card variant="outlined" padding="$lg">
            <Text color="$error">
              Unable to load rating section. Please refresh the page.
            </Text>
          </Card>
        }
      >
        <OrderRating
          orderId={order.id}
          isDelivered={order.shipmentStatus === "DELIVERED"}
          isBuyer={order.userRole === "buyer"}
          sellerName={`${order.seller.firstName || ""} ${order.seller.lastName || ""}`.trim()}
        />
      </AnimationErrorBoundary>

      {/* Messages Section */}
      <AnimationErrorBoundary
        fallback={
          <Card variant="outlined" padding="$lg">
            <Text color="$error">
              Unable to load messages. Please refresh the page.
            </Text>
          </Card>
        }
      >
        <OrderMessages
          orderId={order.id}
          currentUserId={order.currentUserId}
          otherUserName={
            order.userRole === "buyer"
              ? `${order.seller.firstName || ""} ${order.seller.lastName || ""}`.trim()
              : `${order.buyer.firstName || ""} ${order.buyer.lastName || ""}`.trim()
          }
          otherUserImage={
            order.userRole === "buyer"
              ? order.seller.imageUrl
              : order.buyer.imageUrl
          }
        />
      </AnimationErrorBoundary>
    </div>
  );
}
