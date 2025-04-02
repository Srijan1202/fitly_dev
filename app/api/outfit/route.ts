import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { prompt, previousOutfits = [] } = await req.json()

    let systemPrompt = `You are a fashion expert AI that suggests outfits based on user preferences.And you only suggest Asos products.
    Respond ONLY with a comma-separated list of clothing items (4-6 items) that would make a complete outfit.
    Format example: "blue hoodie, green pants, white shoes, red cap"
    Do not include any explanations, just the comma-separated list.`

    if (previousOutfits.length > 0) {
      systemPrompt += `\n\nThe user has already received these outfits, so provide something different:
      ${previousOutfits.join("\n")}`
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: prompt,
    })

    // Clean up the response to ensure it's just the comma-separated list
    const cleanedOutfit = text.replace(/^["']|["']$/g, "").trim()

    return Response.json({ outfit: cleanedOutfit })
  } catch (error) {
    console.error("Error generating outfit:", error)
    return Response.json({ error: "Failed to generate outfit" }, { status: 500 })
  }
}

