"use client";

import Image from "next/image";

export default function ColorTestPage() {
  return (
    <>
      <style jsx>{`
        .page-wrapper {
          background: white;
          min-height: 100vh;
          padding: 40px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        h1 {
          font-size: 32px;
          margin-bottom: 10px;
          color: #1e1e1e;
        }
        .description {
          font-size: 16px;
          color: #666;
          margin-bottom: 40px;
        }
        .swatches {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .swatch-container {
          text-align: center;
        }
        .swatch {
          width: 200px;
          height: 200px;
          border: 2px solid #ddd;
          border-radius: 8px;
          margin-bottom: 10px;
        }
        .css-hex {
          background-color: #e25f2f;
        }
        .css-srgb {
          background-color: color(srgb 0.8863 0.3725 0.1843);
        }
        .css-p3 {
          background-color: color(display-p3 0.8863 0.3725 0.1843);
        }
        .label {
          font-size: 14px;
          font-weight: 600;
          color: #1e1e1e;
          margin-bottom: 4px;
        }
        .code {
          font-size: 12px;
          font-family: "Monaco", "Courier New", monospace;
          color: #666;
          background: #f5f5f5;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
        }
        .instructions {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-top: 40px;
        }
        .instructions h2 {
          font-size: 20px;
          margin-top: 0;
          margin-bottom: 12px;
        }
        .instructions ol {
          margin: 0;
          padding-left: 24px;
        }
        .instructions li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
        .logo-container {
          margin-top: 40px;
          padding: 20px;
          background: #fefad6;
          border-radius: 8px;
          text-align: center;
        }
        .logo-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1e1e1e;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="container">
          <h1>Butter Orange Color Profile Test</h1>
          <p className="description">
            Testing different color space formats for #E25F2F (RGB 226, 95, 47).
            Use Digital Color Meter (macOS) or DevTools color picker to verify
            RGB values.
          </p>

          <div className="swatches">
            <div className="swatch-container">
              <div className="swatch css-hex"></div>
              <div className="label">CSS Hex</div>
              <div className="code">#E25F2F</div>
            </div>

            <div className="swatch-container">
              <div className="swatch css-srgb"></div>
              <div className="label">CSS sRGB</div>
              <div className="code">color(srgb ...)</div>
            </div>

            <div className="swatch-container">
              <div className="swatch css-p3"></div>
              <div className="label">CSS Display P3</div>
              <div className="code">color(display-p3 ...)</div>
            </div>
          </div>

          <div className="instructions">
            <h2>🔍 How to Test</h2>
            <ol>
              <li>
                <strong>Open Digital Color Meter</strong> (macOS):
                <ul>
                  <li>Press Cmd+Space, type &quot;Digital Color Meter&quot;</li>
                  <li>
                    Set to <strong>Display in sRGB</strong> (View menu)
                  </li>
                  <li>Hover over each swatch and read the RGB values</li>
                </ul>
              </li>
              <li>
                <strong>Expected Results (sRGB mode):</strong>
                <ul>
                  <li>
                    Hex (#E25F2F): May show as RGB 210, 103, 62 (P3 interpreted)
                  </li>
                  <li>sRGB explicit: Should show RGB 226, 95, 47 ✅</li>
                  <li>P3 explicit: May show different values (wider gamut)</li>
                </ul>
              </li>
              <li>
                <strong>DevTools Inspector:</strong>
                <ul>
                  <li>Right-click each swatch → Inspect</li>
                  <li>Check computed background-color value</li>
                  <li>Click color swatch to see picker values</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="logo-container">
            <div className="logo-label">
              Reference PNG Logo (sRGB embedded)
            </div>
            <Image
              src="/logo-orange.png"
              alt="Butter Orange Logo"
              width={200}
              height={200}
              style={{ display: "inline-block" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
