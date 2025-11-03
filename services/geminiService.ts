import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// According to the coding guidelines, `process.env.API_KEY` is assumed to be pre-configured and valid.
// Manual checks for the API key are removed to comply with this guideline.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const callGemini = async (prompt: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `Error communicating with Gemini: ${error.message}`;
        }
        return "An unknown error occurred while communicating with Gemini.";
    }
}

export const summarizeProductionData = async (data: any[], country: string, commodity: string): Promise<string> => {
    const simplifiedData = data.slice(0, 25).map(d => `Year ${d.year}: BGS=${d.BGS || 'N/A'}, USGS=${d.USGS || 'N/A'}`).join('; ');
    
    const prompt = `
        As a geology and mineral market analyst, provide a concise, insightful summary in a single paragraph about the production of ${commodity} in ${country}.
        The data shows annual production quantity in metric tons from two sources: BGS (British Geological Survey) and USGS (United States Geological Survey).

        Based on the data below, analyze the following:
        1.  Major production trends (e.g., increasing, decreasing, volatile, stable).
        2.  Significant discrepancies or agreements between the BGS and USGS data sources.
        3.  Any notable peaks, troughs, or periods of change.

        Data: ${simplifiedData}
    `;

    return callGemini(prompt);
};


export const summarizeTradeData = async (data: any[], country: string, commodity: string): Promise<string> => {
    const simplifiedData = data.slice(0, 25).map(d => `Year ${d.year}: Export Value=${d.exportValue || 'N/A'}, Import Value=${d.importValue || 'N/A'}`).join('; ');
    
    const prompt = `
        As an international trade analyst specializing in raw materials, provide a concise, insightful summary in a single paragraph about the trade of ${commodity} (HS code 261400) for ${country}.
        The data shows annual export and import values in thousands of USD.

        Based on the data below, analyze the following:
        1.  The country's overall trade balance for this commodity (net exporter or net importer).
        2.  Major trends in export and import values over the period.
        3.  Any significant spikes, drops, or changes in trade activity.

        Data (Values in 1000 USD): ${simplifiedData}
    `;

    return callGemini(prompt);
};