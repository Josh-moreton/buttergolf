import Image from "next/image";
import Link from "next/link";
import { InteractiveGridPattern } from "./interactive-grid";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthLayout provides a split-screen layout for authentication pages.
 * Left panel: ButterGolf branding with interactive grid pattern (hidden on mobile)
 * Right panel: Clerk authentication form
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Panel - Branding (hidden on mobile, visible on lg+) */}
      <div className="relative hidden h-full flex-col bg-white p-10 text-[#323232] lg:flex dark:border-r">
        {/* ButterGolf Logo */}
        <div className="relative z-20 flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-orange-on-white.svg"
              alt="ButterGolf"
              width={180}
              height={50}
              priority
            />
          </Link>
        </div>

        {/* Interactive Grid Pattern */}
        <InteractiveGridPattern
          className="inset-x-0 inset-y-[0%] h-full skew-y-12"
          style={{
            maskImage: "radial-gradient(500px circle at center, white, transparent)",
            WebkitMaskImage: "radial-gradient(500px circle at center, white, transparent)",
          }}
        />

        {/* Tagline */}
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-[#323232]">
              Your destination for premium pre-owned golf equipment. Buy and sell with fellow golfers in a trusted marketplace.
            </p>
            <footer className="text-sm text-[#545454]">ButterGolf</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex h-full items-center justify-center bg-white p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="mb-4 lg:hidden">
            <Link href="/">
              <Image
                src="/logo-orange-on-white.svg"
                alt="ButterGolf"
                width={150}
                height={42}
                priority
              />
            </Link>
          </div>

          {/* Clerk Form */}
          {children}

          {/* Terms & Privacy */}
          <p className="px-8 text-center text-sm text-[#545454]">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-[#F45314]"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-[#F45314]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
