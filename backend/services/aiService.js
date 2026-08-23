/**
 * AgentX-Ray AI Service
 *
 * DEMO_MODE=true
 * ----------------
 * Uses deterministic sandbox behavior.
 *
 * DEMO_MODE=false
 * ----------------
 * Uses configured LLM provider.
 */

class AIService {

    constructor() {

        this.geminiKey =
            process.env.GEMINI_API_KEY || null;

        this.openaiKey =
            process.env.OPENAI_API_KEY || null;

        this.geminiModel =
            process.env.GEMINI_MODEL ||
            "gemini-3.7-flash";

        this.openaiModel =
            process.env.OPENAI_MODEL ||
            "gpt-5.6-luna";

        this.isDemoMode =
            process.env.DEMO_MODE !== "false";
    }

    isDemo() {

        return (
            this.isDemoMode ||
            (!this.geminiKey && !this.openaiKey)
        );
    }

    getStatus() {

        return {

            demoMode: this.isDemo(),

            hasGeminiKey:
                Boolean(this.geminiKey),

            hasOpenaiKey:
                Boolean(this.openaiKey),

            activeProvider:

                this.isDemo()

                    ? "DETERMINISTIC_SANDBOX"

                    : (
                        this.geminiKey
                            ? `Gemini (${this.geminiModel})`
                            : `OpenAI (${this.openaiModel})`
                    )
        };
    }

    async generateResponse(
        agent,
        userPrompt,
        context = {}
    ) {

        // -------------------------------
        // DEMO MODE
        // -------------------------------

        if (this.isDemo()) {

            return {

                provider:
                    "DEMO_SANDBOX",

                thought:
                    `Evaluating prompt "${String(
                        userPrompt
                    ).substring(0, 40)}..." according to agent policy.`,

                suggestedTool:
                    context.suggestedTool ||
                    "getOrder",

                isSimulation: true
            };
        }

        try {

            const systemPrompt =
                agent?.systemPrompt ||
                "Follow the agent policy and respond safely.";

            const prompt = `
System Policy:
${systemPrompt}

User:
${userPrompt}
`;

            // -------------------------------
            // GEMINI
            // -------------------------------

            if (this.geminiKey) {

                const response =
                    await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
                            this.geminiModel
                        )}:generateContent?key=${encodeURIComponent(
                            this.geminiKey
                        )}`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                contents: [
                                    {
                                        parts: [
                                            {
                                                text: prompt
                                            }
                                        ]
                                    }
                                ]
                            })
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        `Gemini HTTP ${response.status}`
                    );
                }

                const data =
                    await response.json();

                const text =
                    data
                        ?.candidates?.[0]
                        ?.content?.parts
                        ?.map(
                            part => part.text || ""
                        )
                        .join("") || "";

                return {

                    provider: "GEMINI",

                    model:
                        this.geminiModel,

                    text,

                    isSimulation: false
                };
            }

            // -------------------------------
            // OPENAI
            // -------------------------------

            if (this.openaiKey) {

                const response =
                    await fetch(
                        "https://api.openai.com/v1/responses",
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${this.openaiKey}`
                            },

                            body: JSON.stringify({

                                model:
                                    this.openaiModel,

                                input: prompt
                            })
                        }
                    );

                if (!response.ok) {

                    throw new Error(
                        `OpenAI HTTP ${response.status}`
                    );
                }

                const data =
                    await response.json();

                return {

                    provider: "OPENAI",

                    model:
                        this.openaiModel,

                    text:
                        data?.output_text || "",

                    isSimulation: false
                };
            }

        } catch (error) {

            console.error(
                "[AI] Provider failed:",
                error.message
            );

            console.log(
                "[AI] Falling back to sandbox mode."
            );
        }

        // -------------------------------
        // FALLBACK
        // -------------------------------

        return {

            provider:
                "DEMO_SANDBOX",

            text:
                "Simulated safe response.",

            isSimulation: true
        };
    }
}

module.exports =
    new AIService();
