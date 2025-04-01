import { OpenAI } from "openai"

export async function POST(req: Request) {
  try {
    const { prompt, previousOutfits = [] } = await req.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    // If you have OpenAI API key, use it
    // Otherwise, use a simple fallback
    if (process.env.OPENAI_API_KEY) {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

      let systemPrompt = `You are a fashion expert. Generate a complete outfit based on the user's request. 
      The outfit should include 4-6 specific clothing items separated by commas. Be specific about colors and styles.
      Only respond with the outfit items, nothing else.`

      if (previousOutfits.length > 0) {
        systemPrompt += ` Avoid suggesting these previous outfits: ${previousOutfits.join("; ")}`
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 150,
      })

      const outfit = response.choices[0].message.content?.trim() || generateFallbackOutfit(prompt)
      return Response.json({ outfit })
    } else {
      // Fallback if no API key
      return Response.json({ outfit: generateFallbackOutfit(prompt) })
    }
  } catch (error) {
    console.error("Error generating outfit:", error)
    return Response.json(
      { error: "Failed to generate outfit", outfit: generateFallbackOutfit("casual outfit") },
      { status: 500 },
    )
  }
}

function generateFallbackOutfit(prompt: string): string {
  const lowercasePrompt = prompt.toLowerCase()

  // Basic outfit templates based on common scenarios
  if (
    lowercasePrompt.includes("formal") ||
    lowercasePrompt.includes("business") ||
    lowercasePrompt.includes("office")
  ) {
    return "Navy blue blazer, White button-up shirt, Gray dress pants, Black leather belt, Black oxford shoes, Silver tie clip"
  } else if (lowercasePrompt.includes("date") || lowercasePrompt.includes("dinner")) {
    return "Black slim-fit jeans, Burgundy button-up shirt, Brown leather jacket, Brown chelsea boots, Silver watch"
  } else if (
    lowercasePrompt.includes("summer") ||
    lowercasePrompt.includes("hot") ||
    lowercasePrompt.includes("beach")
  ) {
    return "White linen shirt, Beige chino shorts, Brown leather sandals, Straw hat, Tortoise shell sunglasses"
  } else if (
    lowercasePrompt.includes("winter") ||
    lowercasePrompt.includes("cold") ||
    lowercasePrompt.includes("snow")
  ) {
    return "Gray wool sweater, Dark blue jeans, Black puffer jacket, Black leather boots, Red beanie, Black leather gloves"
  } else if (
    lowercasePrompt.includes("workout") ||
    lowercasePrompt.includes("gym") ||
    lowercasePrompt.includes("exercise")
  ) {
    return "Black moisture-wicking t-shirt, Gray athletic shorts, White running shoes, Black athletic socks, Black fitness watch"
  } else {
    // Default casual outfit
    return "White t-shirt, Blue jeans, Gray hoodie, White sneakers, Black watch"
  }
}

