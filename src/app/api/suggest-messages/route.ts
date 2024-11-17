import {
  GoogleGenerativeAI,
  GoogleGenerativeAIError,
} from "@google/generative-ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  console.log(prompt);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const responses = [];
  try {
    for (let i = 0; i < 4; i++) {
      const result = await model.generateContent(
        (prompt || "") +
          ". maximum word 12, don't make multiple just give me one sentence ."
      );
      responses.push(result.response.text());
    }

    return Response.json({ success: true, responses }, { status: 200 });
  } catch (error) {
    console.error("error", error);
    if (error instanceof GoogleGenerativeAIError) {
      const { message, name, cause, stack } = error;
      return Response.json(
        {
          success: false,
          message,
          name,
          cause,
          stack,
          error,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: false,
        message: "An error occurred while generate suggest message",
        error,
      },
      { status: 500 }
    );
  }
}
