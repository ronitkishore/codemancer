import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const session = await getServerSession(authOptions);
      const userEmail = session?.user?.email;

      if (!userEmail) {
        return NextResponse.json(
          { message: "User not authenticated" },
          { status: 401 }
        );
      }

      const { repositoryUrl } = body;
      const repositoryName = extractRepositoryName(repositoryUrl);

      // Find the user by their name
      const user = await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Create the repository entry with the user's ID
      await prisma.repository.create({
        data: {
          name: repositoryName,
          url: repositoryUrl,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return NextResponse.json(
        { message: "Repository linked successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error linking repository:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }
}

function extractRepositoryName(url: string) {
  const parts = url.split("/");
  return parts[parts.length - 1];
}
