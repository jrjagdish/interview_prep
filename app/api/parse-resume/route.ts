import pdf from "pdf-parse";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return Response.json(
        { success: false, detail: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    // Convert uploaded file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const data = await pdf(buffer);
    const text = data.text;

    if (!text.trim()) {
      return Response.json(
        { success: false, detail: "No text found in PDF." },
        { status: 400 }
      );
    }

    // Regex patterns
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const phonePattern = /\+?\d[\d\-\s]{8,}\d/;

    const emailMatch = text.match(emailPattern);
    const phoneMatch = text.match(phonePattern);

    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const name = lines.length > 0 ? lines[0] : null;

    const result: { name: string; email: string; phone: string } = {
      name: name || "❌ Missing",
      email: emailMatch ? emailMatch[0] : "❌ Missing",
      phone: phoneMatch ? phoneMatch[0] : "❌ Missing",
    };

    const missingFields = (Object.keys(result) as Array<keyof typeof result>).filter(
      key => result[key] === "❌ Missing"
    );

    return Response.json({
      success: true,
      extracted: result,
      missing_fields: missingFields,
    });
  } catch (err: any) {
    return Response.json(
      { success: false, detail: `Error parsing PDF: ${err.message}` },
      { status: 500 }
    );
  }
}
