import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import pdf from "npm:pdf-parse@1.1.1";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.1.3";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { resume_url } = await req.json();

        if (!resume_url) {
            throw new Error('Missing resume_url in request body');
        }

        console.log(`Fetching resume from: ${resume_url}`);
        const resumeResponse = await fetch(resume_url);
        if (!resumeResponse.ok) {
            throw new Error(`Failed to fetch resume: ${resumeResponse.statusText}`);
        }

        const arrayBuffer = await resumeResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("Parsing PDF...");
        const data = await pdf(buffer);
        const text = data.text;

        // Trim text to avoid token limits if extremely large, though resumes are usually small
        const trimmedText = text.slice(0, 30000);

        console.log("Initializing Gemini...");
        const apiKey = Deno.env.get('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured');
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const systemPrompt = `
    You are a strict data extraction AI. Your task is to extract specific information from a resume.
    
    CRITICAL RULES:
    1. **Explicit Data Only:** Extract details *strictly* as they appear in the text. Do not hallucinate or infer information not present.
    2. **Zero Inference on CTC:** Look for "Current CTC", "Salary", "Package", or similar explicit terms. 
       - If NOT found, set 'current_ctc' to null. 
       - Do NOT guess based on experience, role, or company. 
       - Do NOT return 0. Return null.
    3. **Skills:** Extract valid technical skills only. Do not infer soft skills like "Leadership" unless explicitly listed as a skill.
    
    Output must be a valid JSON object with the following structure:
    {
      "name": "String",
      "email": "String",
      "skills": ["Array", "of", "Skills"],
      "years_of_experience": Number,
      "current_ctc": Number || null, 
      "summary": "String"
    }
    `;

        const fullPrompt = `${systemPrompt}\n\nRESUME TEXT:\n${trimmedText}`;

        console.log("Sending to Gemini...");
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const textOutput = response.text();

        console.log("Gemini Response:", textOutput);

        // Clean up markdown code blocks if present
        const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanJson);

        return new Response(JSON.stringify(parsedData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Error processing resume:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
