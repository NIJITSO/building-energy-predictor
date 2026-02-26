import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json(
                { detail: "Username and password are required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection("users");

        // Check if user exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { detail: "Username already registered" },
                { status: 400 }
            );
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert user
        await usersCollection.insertOne({
            username,
            passwordHash,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { detail: "Internal server error" },
            { status: 500 }
        );
    }
}
