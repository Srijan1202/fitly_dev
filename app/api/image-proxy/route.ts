import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return new Response("Missing URL parameter", { status: 400 })
  }

  try {
    const imageResponse = await fetch(url)

    if (!imageResponse.ok) {
      return new Response("Failed to fetch image", { status: imageResponse.status })
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg"

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch (error) {
    console.error("Error proxying image:", error)
    return new Response("Error fetching image", { status: 500 })
  }
}

