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
    id: "drivers",
    name: "Drivers",
    label: "DRIVERS ON SALE",
    image: imagePaths.clubs.club1,
    link: "/category/drivers",
  },
  {
    id: "irons",
    name: "Irons",
    label: "IRONS ON SALE",
    image: imagePaths.clubs.club2,
    link: "/category/irons",
  },
  {
    id: "bags",
    name: "Bags",
    label: "BAGS ON SALE",
    image: imagePaths.clubs.club3,
    link: "/category/bags",
  },
  {
    id: "accessories",
    name: "Accessories",
    label: "ACCESSORIES ON SALE",
    image: imagePaths.clubs.club4,
    link: "/category/accessories",
  },
];

export function CategoryGrid() {
  return (
    <Column
      width="100%"
      paddingVertical="$8"
      $md={{ paddingVertical: "$12" }}
      $lg={{ paddingVertical: "$16" }}
      backgroundColor="$surface"
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
          weight="bold"
          color="$primary"
          align="center"
          {...{
            style: {
              fontFamily: "var(--font-urbanist)",
              fontSize: "clamp(32px, 5vw, 48px)",
              lineHeight: 1.2,
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
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  backgroundColor: "var(--surface)",
                  border: "3px solid var(--primary)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                className="category-card"
              >
                {/* Image Container with Padding */}
                <div
                  style={{
                    flex: 1,
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>

                {/* Orange Label at Bottom */}
                <div
                  style={{
                    backgroundColor: "var(--primary)",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <Text
                    weight="bold"
                    color="$textInverse"
                    {...{
                      style: {
                        fontFamily: "var(--font-urbanist)",
                        fontSize: "18px",
                        lineHeight: 1.2,
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
            transform: translateY(-4px);
            box-shadow: 0 8px 16px color-mix(in display-p3, var(--primary) 20%, transparent);
          }

          .category-card:hover img {
            transform: scale(1.05);
          }

          .category-card:active {
            transform: translateY(-2px);
          }
        `,
        }}
      />
    </Column>
  );
}
