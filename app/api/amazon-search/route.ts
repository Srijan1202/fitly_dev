export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Generate mock products based on the query
    const products = generateMockProducts(query)

    return Response.json({ products })
  } catch (error) {
    console.error("Error searching Amazon products:", error)
    return Response.json({ error: "Failed to search products" }, { status: 500 })
  }
}

function generateMockProducts(query: string) {
  // Extract the main item type and color from the query
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
  } else if (query.includes("hat") || query.includes("cap")) {
    itemType = "hat"
  } else if (query.includes("dress")) {
    itemType = "dress"
  } else if (query.includes("skirt")) {
    itemType = "skirt"
  } else if (query.includes("accessory") || query.includes("jewelry") || query.includes("watch")) {
    itemType = "accessory"
  }

  // Generate 2-4 mock products
  const numProducts = Math.floor(Math.random() * 3) + 2 // 2 to 4 products
  const products = []

  const brands = [
    "Fashion Nova",
    "Urban Style",
    "Trendy Threads",
    "Modern Apparel",
    "Classic Wear",
    "Street Vogue",
    "Elite Fashion",
    "Premium Clothing",
  ]

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
        name += `${["Cotton", "Slim Fit", "Casual", "Formal", "Graphic"][Math.floor(Math.random() * 5)]} `
        name += `${["T-Shirt", "Button-Up Shirt", "Polo", "Blouse", "Top"][Math.floor(Math.random() * 5)]}`
        break
      case "pants":
        name += `${["Slim", "Regular Fit", "Relaxed", "Skinny", "Straight Leg"][Math.floor(Math.random() * 5)]} `
        name += `${["Jeans", "Chinos", "Trousers", "Pants", "Slacks"][Math.floor(Math.random() * 5)]}`
        break
      case "shoes":
        name += `${["Running", "Casual", "Athletic", "Fashion", "Comfort"][Math.floor(Math.random() * 5)]} `
        name += `${["Sneakers", "Shoes", "Boots", "Loafers", "Trainers"][Math.floor(Math.random() * 5)]}`
        break
      case "jacket":
        name += `${["Lightweight", "Waterproof", "Insulated", "Casual", "Stylish"][Math.floor(Math.random() * 5)]} `
        name += `${["Jacket", "Hoodie", "Coat", "Windbreaker", "Blazer"][Math.floor(Math.random() * 5)]}`
        break
      case "hat":
        name += `${["Adjustable", "Fitted", "Stylish", "Classic", "Modern"][Math.floor(Math.random() * 5)]} `
        name += `${["Cap", "Hat", "Beanie", "Fedora", "Snapback"][Math.floor(Math.random() * 5)]}`
        break
      case "dress":
        name += `${["Elegant", "Casual", "Floral", "Maxi", "Mini"][Math.floor(Math.random() * 5)]} Dress`
        break
      case "skirt":
        name += `${["A-Line", "Pleated", "Midi", "Mini", "Maxi"][Math.floor(Math.random() * 5)]} Skirt`
        break
      case "accessory":
        name += `${["Stylish", "Classic", "Modern", "Trendy", "Elegant"][Math.floor(Math.random() * 5)]} `
        name += `${["Watch", "Bracelet", "Necklace", "Earrings", "Sunglasses"][Math.floor(Math.random() * 5)]}`
        break
      default:
        name += `Fashion Item`
    }

    // Generate a placeholder image URL based on the item type and color
    const imageUrl = `https://via.placeholder.com/300?text=${encodeURIComponent(name)}`;

    // For a real implementation, you would use actual product images
    // Here we're using placeholder images for demonstration

    products.push({
      id: `product-${Date.now()}-${i}`,
      name,
      image: imageUrl,
      price: `$${price}`,
      link: `https://amazon.com/dp/${Math.random().toString(36).substring(2, 10)}`, // Mock Amazon link
    })
  }

  return products
}

