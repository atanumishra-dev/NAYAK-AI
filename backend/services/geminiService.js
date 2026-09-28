const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are GramVenture AI, a grounded rural business intelligence analyst.

Your task is to analyze verified business, market, weather, financial and government-scheme data and produce a practical feasibility report for a rural entrepreneur.

IMPORTANT RULES:
1. Never invent market prices.
2. Never invent government scheme eligibility.
3. Never invent subsidy percentages.
4. Never invent interest rates.
5. Never invent financial calculations.
6. Use only values supplied in the structured input.
7. If data is missing, explicitly say 'Data unavailable' or 'Insufficient data'.
8. Distinguish verified facts from assumptions.
9. Do not present estimates as guarantees.
10. Do not claim that a loan or subsidy will definitely be sanctioned.
11. Clearly identify the source and date of important external data.
12. Use the financial engine's calculations rather than recalculating them incorrectly.
13. Provide explanations understandable to a first-time rural entrepreneur.
14. Avoid excessive technical language.
15. Give practical next steps.
16. Highlight major risks and mitigation strategies.
17. If multiple schemes are potentially applicable, explain the eligibility conditions for each.
18. Never fabricate a government scheme.
19. Never claim an API result that is not present in the supplied data.
20. Separate observed data, calculated values, assumptions and AI interpretation.
`;

const responseSchema = {
    type: "OBJECT",
    properties: {
        executive_summary: {
            type: "OBJECT",
            properties: {
                headline: { type: "STRING" },
                summary: { type: "STRING" },
                key_observations: { type: "ARRAY", items: { type: "STRING" } },
                important_caveats: { type: "ARRAY", items: { type: "STRING" } }
            },
            required: ["headline", "summary", "key_observations", "important_caveats"]
        },
        market_analysis: {
            type: "OBJECT",
            properties: {
                market_signal: { type: "STRING", enum: ["positive", "mixed", "negative", "insufficient_data"] },
                observations: { type: "ARRAY", items: { type: "STRING" } },
                price_trend: { type: "STRING" },
                demand_signals: { type: "ARRAY", items: { type: "STRING" } },
                market_opportunities: { type: "ARRAY", items: { type: "STRING" } },
                market_risks: { type: "ARRAY", items: { type: "STRING" } }
            },
            required: ["market_signal", "observations", "price_trend"]
        },
        financial_interpretation: {
            type: "OBJECT",
            properties: {
                summary: { type: "STRING" },
                cash_flow_observations: { type: "ARRAY", items: { type: "STRING" } },
                break_even_interpretation: { type: "STRING" },
                repayment_observations: { type: "ARRAY", items: { type: "STRING" } }
            }
        },
        scheme_interpretation: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    scheme_name: { type: "STRING" },
                    why_it_may_apply: { type: "STRING" },
                    eligibility_conditions: { type: "ARRAY", items: { type: "STRING" } },
                    benefits: { type: "ARRAY", items: { type: "STRING" } },
                    limitations: { type: "ARRAY", items: { type: "STRING" } },
                    source: { type: "STRING" }
                }
            }
        },
        risk_analysis: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    risk: { type: "STRING" },
                    severity: { type: "STRING", enum: ["low", "medium", "high"] },
                    reason: { type: "STRING" },
                    mitigation: { type: "STRING" }
                }
            }
        },
        swot: {
            type: "OBJECT",
            properties: {
                strengths: { type: "ARRAY", items: { type: "STRING" } },
                weaknesses: { type: "ARRAY", items: { type: "STRING" } },
                opportunities: { type: "ARRAY", items: { type: "STRING" } },
                threats: { type: "ARRAY", items: { type: "STRING" } }
            }
        },
        action_plan: {
             type: "OBJECT",
             properties: {
                 next_7_days: { type: "ARRAY", items: { type: "STRING" } },
                 next_30_days: { type: "ARRAY", items: { type: "STRING" } },
                 next_90_days: { type: "ARRAY", items: { type: "STRING" } }
             }
        },
        recommendations: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    priority: { type: "INTEGER" },
                    recommendation: { type: "STRING" },
                    reason: { type: "STRING" },
                    evidence: { type: "STRING" }
                }
            }
        },
        data_quality: {
            type: "OBJECT",
            properties: {
                overall: { type: "STRING", enum: ["high", "medium", "low"] },
                missing_data: { type: "ARRAY", items: { type: "STRING" } },
                stale_data: { type: "ARRAY", items: { type: "STRING" } },
                assumptions: { type: "ARRAY", items: { type: "STRING" } }
            }
        }
    },
    required: ["executive_summary", "market_analysis", "financial_interpretation", "scheme_interpretation", "risk_analysis", "swot", "action_plan", "recommendations", "data_quality"]
};

class GeminiService {
    static async generateReport(context) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Gemini API Key missing");
        }
        
        try {
            const prompt = `
Analyze the following business context and provide a structured report:
Context: ${JSON.stringify(context, null, 2)}
`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: SYSTEM_PROMPT,
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                    temperature: 0.2
                }
            });

            return JSON.parse(response.text);
        } catch (error) {
            console.error("Gemini Generation Error:", error);
            throw error;
        }
    }
}

module.exports = GeminiService;
