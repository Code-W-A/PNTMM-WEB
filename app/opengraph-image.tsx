import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { siteConfig } from "@/config/site"

export const alt = `${siteConfig.fullName} — ${siteConfig.description}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const BRAND_DARK = "#182563"
const BRAND_ACCENT = "#ffd43b"

/**
 * Fontul implicit din `next/og` conține doar latin de bază, fără ă, â, î, ș, ț.
 * Încărcăm subseturile latin și latin-ext ale fonturilor site-ului și le
 * declarăm ca stivă CSS, ca satori să găsească diacriticele în al doilea font.
 */
const FONT_FILES = {
  headingLatin:
    "@fontsource/merriweather/files/merriweather-latin-700-normal.woff",
  headingLatinExt:
    "@fontsource/merriweather/files/merriweather-latin-ext-700-normal.woff",
  bodyLatin: "@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff",
  bodyLatinExt:
    "@fontsource/noto-sans/files/noto-sans-latin-ext-400-normal.woff",
} as const

const HEADING_STACK = "Merriweather, MerriweatherExt"
const BODY_STACK = "NotoSans, NotoSansExt"

function fromPackages(relativePath: string) {
  return readFile(join(process.cwd(), "node_modules", relativePath))
}

export default async function OpenGraphImage() {
  const [headingLatin, headingLatinExt, bodyLatin, bodyLatinExt, logo] =
    await Promise.all([
      fromPackages(FONT_FILES.headingLatin),
      fromPackages(FONT_FILES.headingLatinExt),
      fromPackages(FONT_FILES.bodyLatin),
      fromPackages(FONT_FILES.bodyLatinExt),
      readFile(join(process.cwd(), "public/sigla/android-icon-192.png")),
    ])

  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BRAND_DARK,
          padding: "72px 80px",
          fontFamily: BODY_STACK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            width={116}
            height={116}
            alt=""
            style={{ borderRadius: 20 }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span
              style={{
                fontSize: 22,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: BRAND_ACCENT,
              }}
            >
              Organizația județeană
            </span>
            <span style={{ fontSize: 30, color: "rgba(255,255,255,0.72)" }}>
              Partidul Național Țărănesc Maniu-Mihalache
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: 96,
              height: 6,
              backgroundColor: BRAND_ACCENT,
              marginBottom: 32,
            }}
          />
          <span
            style={{
              fontFamily: HEADING_STACK,
              fontSize: 104,
              lineHeight: 1.05,
              color: "#ffffff",
            }}
          >
            {siteConfig.fullName}
          </span>
          <span
            style={{
              marginTop: 26,
              fontSize: 32,
              lineHeight: 1.45,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 900,
            }}
          >
            Doctrină creștin-democrată, știri, evenimente și modalități de
            implicare.
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Merriweather", data: headingLatin, weight: 700, style: "normal" },
        {
          name: "MerriweatherExt",
          data: headingLatinExt,
          weight: 700,
          style: "normal",
        },
        { name: "NotoSans", data: bodyLatin, weight: 400, style: "normal" },
        {
          name: "NotoSansExt",
          data: bodyLatinExt,
          weight: 400,
          style: "normal",
        },
      ],
    },
  )
}
