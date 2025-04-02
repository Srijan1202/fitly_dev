export async function POST(req: Request) {
  let query = "" // Declare query variable here
  try {
    const { query: requestQuery } = await req.json()
    query = requestQuery // Assign the value from the request to the query variable

    if (!query || typeof query !== "string") {
      return Response.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Call the ASOS API
    const response = await fetch(
      `https://asos2.p.rapidapi.com/products/v2/list?&store=US&lang=en-US&limit=4&country=US&currency=USD&sizeSchema=US&sort=freshness`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.ASOS_API_KEY || "",
          "X-RapidAPI-Host": "asos2.p.rapidapi.com",
        },
      },
    )
    

    if (!response.ok) {
      console.error(`ASOS API responded with status: ${response.status}`)
      // Return fallback data if the API fails
      return Response.json({
        products: generateFallbackProducts(query),
      })
    }

    const data = await response.json()

    // Check if we have products in the response
    if (!data.products || data.products.length === 0) {
      return Response.json({
        products: generateFallbackProducts(query),
      })
    }

    // Transform ASOS data to match the expected format
    const products = data.products.map((product: any) => ({
      id: product.id.toString(),
      name: product.name,
      image: `https://${product.imageUrl}`,
      price: `$${(product.price.current.value || 0).toFixed(2)}`,
      link: `https://www.asos.com/${product.url}`,
    }))

    return Response.json({ products })
  } catch (error) {
    console.error("Error searching ASOS products:", error)
    // Return fallback data if there's an exception
    return Response.json({
      products: generateFallbackProducts(query),
    })
  }
}

// Fallback function to generate products if the API fails
function generateFallbackProducts(query: string) {
  const words = query.toLowerCase().split(" ")
  const colors = ["blue", "green", "red", "black", "white", "gray", "purple", "yellow", "pink", "orange", "brown"]
  const foundColor = words.find((word) => colors.includes(word)) || ""

  // Determine the item type
  let itemType = "clothing"
  if (query.includes("shirt") || query.includes("tee") || query.includes("top")) {
    itemType = "shirt"
  } else if (query.includes("pant") || query.includes("jean") || query.includes("trouser")) {
    itemType = "pants"
  } else if (query.includes("shoe") || query.includes("sneaker") || query.includes("boot")) {
    itemType = "shoes"
  } else if (query.includes("jacket") || query.includes("coat") || query.includes("hoodie")) {
    itemType = "jacket"
  } else if (query.includes("dress")) {
    itemType = "dress"
  } else if (query.includes("skirt")) {
    itemType = "skirt"
  }

  // Generate 2-4 mock products
  const numProducts = Math.floor(Math.random() * 3) + 2 // 2 to 4 products
  const products = []

  const brands = ["ASOS DESIGN", "ASOS EDITION", "ASOS 4505", "Topshop", "Monki", "New Look", "River Island", "Nike"]

  for (let i = 0; i < numProducts; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const price = (Math.random() * 100 + 20).toFixed(2) // Random price between $20 and $120

    // Generate product name based on query
    let name = `${brand} `
    if (foundColor) {
      name += `${foundColor.charAt(0).toUpperCase() + foundColor.slice(1)} `
    }

    // Add more descriptive words based on item type
    switch (itemType) {
      case "shirt":
        name += `${["Cotton", "Slim Fit", "Casual", "Formal", "Graphic"][Math.floor(Math.random() * 5)]} T-Shirt`
        break
      case "pants":
        name += `${["Slim", "Regular Fit", "Relaxed", "Skinny", "Straight Leg"][Math.floor(Math.random() * 5)]} Jeans`
        break
      case "shoes":
        name += `${["Running", "Casual", "Athletic", "Fashion", "Comfort"][Math.floor(Math.random() * 5)]} Sneakers`
        break
      case "jacket":
        name += `${["Lightweight", "Waterproof", "Insulated", "Casual", "Stylish"][Math.floor(Math.random() * 5)]} Jacket`
        break
      case "dress":
        name += `${["Elegant", "Casual", "Floral", "Maxi", "Mini"][Math.floor(Math.random() * 5)]} Dress`
        break
      case "skirt":
        name += `${["A-Line", "Pleated", "Midi", "Mini", "Maxi"][Math.floor(Math.random() * 5)]} Skirt`
        break
      default:
        name += `Fashion Item`
    }

    // Generate a placeholder image URL
    const imageUrl = `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(name)}`

    products.push({
      id: `product-${Date.now()}-${i}`,
      name,
      image: imageUrl,
      price: `$${price}`,
      link: `https://www.asos.com/search/?q=${encodeURIComponent(query)}`,
    })
  }

  return products
}

