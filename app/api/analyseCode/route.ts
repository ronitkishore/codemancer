import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { code } = body;

      const response = await fetch(
        "https://api.together.xyz/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "codellama/CodeLlama-34b-Instruct-hf",
            messages: [
              {
                role: "user",
                content: `Imaginer you are are a senior software engineer who has been tasked with reviewing pull reuqests. The following is the code for a pull request raised. Please analyze it and do a code review. Also give suggestions to improve the code, if any can be done:

\`\`\`
${code}
\`\`\`

Also, describe in plain language what the code is doing.`,
              },
            ],
            temperature: 0.8,
            max_tokens: 2048,
          }),
        }
      );

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      return NextResponse.json({ analysis: analysis }, { status: 200 });
    } catch (error) {
      console.error("Error analyzing code:", error);
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
