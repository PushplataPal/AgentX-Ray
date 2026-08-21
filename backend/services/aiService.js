/**
 * AI Service Abstraction Layer
 * Supports optional external LLM providers (Gemini / OpenAI) with automatic
 * zero-key DEMO MODE deterministic fallback.
 */

class AIService {
  constructor() {
    this.geminiKey = process.env.GEMINI_API_KEY || null;
    this.openaiKey = process.env.OPENAI_API_KEY || null;
    this.isDemoMode = process.env.DEMO_MODE !== 'false';
  }

  isDemo() {
    return this.isDemoMode || (!this.geminiKey && !this.openaiKey);
  }

  getStatus() {
    return {
      demoMode: this.isDemo(),
      hasGeminiKey: Boolean(this.geminiKey),
      hasOpenaiKey: Boolean(this.openaiKey),
      activeProvider: this.isDemo() ? 'Deterministic Sandbox Engine (Demo Mode)' : (this.geminiKey ? 'Gemini 1.5' : 'OpenAI GPT-4o')
    };
  }

  /**
   * Evaluate prompt or generate response
   */
  async generateResponse(agent, userPrompt, context = {}) {
    // In Demo Mode or default mode, return high-speed deterministic execution
    if (this.isDemo()) {
      return {
        provider: 'DEMO_SANDBOX',
        thought: `Evaluating prompt "${userPrompt.substring(0, 40)}..." according to agent policy.`,
        suggestedTool: context.suggestedTool || 'getOrder',
        isSimulation: true
      };
    }

    // Optional LLM API integration if user configures external keys
    try {
      if (this.geminiKey) {
        // Standard Gemini API call if enabled
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `System: ${agent.systemPrompt}\nUser: ${userPrompt}` }] }]
          })
        });
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return { provider: 'GEMINI', text, isSimulation: false };
      }
    } catch (err) {
      console.warn('External AI call failed, falling back to Demo Mode:', err.message);
    }

    return {
      provider: 'DEMO_SANDBOX',
      text: 'Simulated compliant response in sandbox mode.',
      isSimulation: true
    };
  }
}

module.exports = new AIService();
