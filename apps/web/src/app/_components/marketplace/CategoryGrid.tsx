"use client";

import Link from "next/link";
import { Column, Text } from "@buttergolf/ui";
import { imagePaths } from "@buttergolf/assets";

interface Category {
  id: string;
  name: string;
  label: string;
  image: string;
  link: string;
}

const categories: Category[] = [
  {
    id: "clubs",
    name: "Clubs",
    label: "CLUBS ON SALE",
    image: imagePaths.clubs.club1,
    link: "/listings?category=clubs",
  },
  {
    id: "bags",
    name: "Bags",
    label: "BAGS ON SALE",
    image: imagePaths.clubs.club2,
    link: "/listings?category=bags",
  },
  {
    id: "shoes",
    name: "Shoes",
    label: "SHOES ON SALE",
    image: imagePaths.clubs.club3,
    link: "/listings?category=shoes",
  },
  {
    id: "clothing",
    name: "Clothing",
    label: "CLOTHING ON SALE",
    image: imagePaths.clubs.club4,
    link: "/listings?category=clothing",
  },
];

export function CategoryGrid() {
  return (
    <Column
      width="100%"
      paddingVertical="$8"
      $md={{ paddingVertical: "$12" }}
      $lg={{ paddingVertical: "$16" }}
      backgroundColor="$background"
    >
      {/* Section Title */}
      <Column
        width="100%"
        maxWidth={1440}
        marginHorizontal="auto"
        paddingHorizontal="$4"
        $md={{ paddingHorizontal: "$6" }}
        $lg={{ paddingHorizontal: "$8" }}
        gap="$8"
      >
        <Text
          {...{
            style: {
              fontFamily: "var(--font-gotham)",
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.2,
              color: "#E25F2F",
              textAlign: "center",
              letterSpacing: "2px",
              textTransform: "uppercase",
            },
          }}
        >
          SHOP BY CATEGORY
        </Text>

        {/* Category Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
            width: "100%",
          }}
          className="category-grid"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.link}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                }}
                className="category-card"
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transition: "transform 0.3s ease",
                  }}
                />

                {/* Orange Label Overlay at Bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#E25F2F",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <Text
                    {...{
                      style: {
                        fontFamily: "var(--font-gotham)",
                        fontWeight: 700,
                        fontSize: "18px",
                        lineHeight: 1.2,
                        color: "#FFFFFF",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                      },
                    }}
                  >
                    {category.label}
                  </Text>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Column>

      {/* Global styles for hover effects */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (min-width: 768px) {
            .category-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (min-width: 1024px) {
            .category-grid {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }

          .category-card:hover {
            transform: scale(1.02) !important;
            box-shadow: 0 8px 24px rgba(226, 95, 47, 0.15) !important;
          }

          .category-card:hover img {
            transform: scale(1.05) !important;
          }

          .category-card:active {
            transform: scale(0.98) !important;
          }
        `,
        }}
      />
    </Column>
  );
}
