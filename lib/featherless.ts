/* ============================================================
   Featherless AI Client — Token-efficient Medical Analysis
   Wrapper around Featherless API for AI Oracle features
   ============================================================ */

const FEATHERLESS_API_URL =
    process.env.FEATHERLESS_API_URL ||
    "https://api.featherless.ai/v1/chat/completions";
const FEATHERLESS_API_KEY = process.env.FEATHERLESS_API_KEY || "";

interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface FeatherlessResponse {
    choices: { message: { content: string } }[];
}

/**
 * Send a prompt to Featherless AI and return the response text.
 */
async function callFeatherless(
    messages: ChatMessage[],
    maxTokens: number = 800
): Promise<string> {
    const response = await fetch(FEATHERLESS_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${FEATHERLESS_API_KEY}`,
        },
        body: JSON.stringify({
            model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
            messages,
            max_tokens: maxTokens,
            temperature: 0.3,
        }),
    });

    if (!response.ok) {
        throw new Error(`Featherless API error: ${response.statusText}`);
    }

    const data: FeatherlessResponse = await response.json();
    return data.choices[0]?.message?.content || "";
}

/**
 * Analyze a medical report and return structured findings.
 */
export async function analyzeReport(reportText: string): Promise<string> {
    return callFeatherless([
        {
            role: "system",
            content: `You are a medical AI assistant. Analyze the medical report and return a JSON object with:
{"summary":"brief summary","findings":["finding1","finding2"],"recommendations":["rec1","rec2"],"riskLevel":"low|moderate|high","confidence":0.0-1.0}
Be concise. Return ONLY the JSON.`,
        },
        {
            role: "user",
            content: `Analyze this medical report:\n${reportText}`,
        },
    ]);
}

/**
 * Check blood donor eligibility based on health data.
 */
export async function checkDonorEligibility(
    healthData: string
): Promise<string> {
    return callFeatherless([
        {
            role: "system",
            content: `You are a medical AI. Evaluate blood donation eligibility based on the health data. Return JSON:
{"eligible":true|false,"reasons":["reason1"],"nextEligibleDate":"YYYY-MM-DD or null","recommendations":["rec1"]}
Return ONLY the JSON.`,
        },
        {
            role: "user",
            content: `Evaluate donor eligibility:\n${healthData}`,
        },
    ]);
}

/**
 * Explain an X-ray description in patient-friendly language.
 */
export async function explainXray(xrayDescription: string): Promise<string> {
    return callFeatherless([
        {
            role: "system",
            content: `You are a medical AI. Explain the X-ray findings in simple, patient-friendly language. Return JSON:
{"summary":"plain language summary","findings":["finding1"],"recommendations":["rec1"],"riskLevel":"low|moderate|high","confidence":0.0-1.0}
Return ONLY the JSON.`,
        },
        {
            role: "user",
            content: `Explain this X-ray report:\n${xrayDescription}`,
        },
    ]);
}

/**
 * Ask Featherless AI to generate a list of hospitals for a given location.
 * The model should return a valid JSON array where each item has properties:
 * { name, address, location: { lat, lng }, phone, specialties: string[],
 *   verificationLevel: number (1-5), loadCapacity: number (0-100) }
 *
 * This is used for demo/seed mode when real data scraping is not available.
 */
export async function generateHospitals(
    locationDescription: string,
    count: number = 8
): Promise<any> {
    const prompt = `Provide a JSON array of ${count} hospitals located in ${locationDescription}. ` +
        "Each object should include name, address, location with numeric lat and lng, phone number, specialties array, verificationLevel (1-5), loadCapacity (0-100)." +
        " Return ONLY the JSON array.";

    const text = await callFeatherless([
        {
            role: "system",
            content: "You are a helpful assistant that formats data precisely in JSON without additional commentary.",
        },
        {
            role: "user",
            content: prompt,
        },
    ], 1000);

    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("Failed to parse hospital list from Featherless:", text);
        throw err;
    }
}

