import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { height, bodyShape, skinTone, gender, age } = await req.json();

    // Convert height and age to numbers
    const heightFloat = parseFloat(height);
    const ageInt = parseInt(age, 10);

    if (isNaN(heightFloat) || isNaN(ageInt)) {
      return NextResponse.json({ error: "Invalid height or age format" }, { status: 400 });
    }

    const newUser = await prisma.userDetails.create({
      data: { 
        height: heightFloat, 
        bodyShape, 
        skinTone, 
        gender, 
        age: ageInt 
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to submit form", details: error }, { status: 500 });
  }
}
