import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return new Response("Missing URL parameter", { status: 400 })
  }

  try {
    const imageResponse = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.asos.com/",
      },
    })

    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${url}, status: ${imageResponse.status}`)
      // Return a placeholder image instead
      return Response.redirect(`/placeholder.svg?height=400&width=300&text=Image+Not+Available`)
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const contentType = imageResponse.headers.get("content-type") || "image/jpeg"

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error proxying image:", error)
    // Return a placeholder image on error
    return Response.redirect(`/placeholder.svg?height=400&width=300&text=Image+Not+Available`)
  }
}

