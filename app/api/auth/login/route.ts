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

        // Find user
        const user = await usersCollection.findOne({ username });
        if (!user) {
            return NextResponse.json(
                { detail: "Incorrect username or password" },
                { status: 401 }
            );
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return NextResponse.json(
                { detail: "Incorrect username or password" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "Login successful" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { detail: "Internal server error" },
            { status: 500 }
        );
    }
}
