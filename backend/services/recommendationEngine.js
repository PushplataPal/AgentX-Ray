/**
 * Recommendation Engine
 * Produces prescriptive, actionable hardening advice for each failure category.
 */

class RecommendationEngine {
  generateRecommendations(failures = [], rootCauses = []) {
    const recommendations = [];
    const seenCategories = new Set();

    const addRec = (category, title, directive, codeSnippet) => {
      if (!seenCategories.has(category)) {
        seenCategories.add(category);
        recommendations.push({
          id: `REC-${recommendations.length + 1}`,
          category,
          title,
          directive,
          codeSnippet
        });
      }
    };

    failures.forEach(f => {
      const type = f.failureType;
      if (type === 'UNSAFE_ACTION' || type === 'UNSAFE_TOOL_ACTION') {
        addRec(
          'UNSAFE_ACTION',
          'Mandatory Authorization Guard',
          'Add a mandatory authorization guard before sensitive tool execution. Require customerVerified === true before issueRefund() can be called.',
          `// Mandatory Verification Precondition Guard
if (toolName === 'issueRefund' && !context.order.customerVerified) {
  return {
    blocked: true,
    action: 'PROMPT_VERIFICATION',
    message: 'Identity verification required before financial transfer.'
  };
}`
        );
      } else if (type === 'PROMPT_INJECTION') {
        addRec(
          'PROMPT_INJECTION',
          'Instruction Boundary Isolation',
          'Separate system instructions from untrusted user content and reject policy override attempts.',
          `// Instruction Boundary Sanitizer
const sanitized = stripSystemDelimiters(userPrompt);
if (detectSupervisorImpersonation(sanitized)) {
  flagSecurityIncident('PROMPT_INJECTION_ATTEMPT');
}`
        );
      } else if (type === 'TOOL_LOOP') {
        addRec(
          'TOOL_LOOP',
          'Tool Idempotency & Max Retry Cap',
          'Add a maximum retry threshold and loop detection. Stop execution when repeated identical tool calls exceed the threshold.',
          `// Idempotency Loop Guard
if (history.filter(h => h.tool === toolName && h.paramsMatch).length >= 2) {
  return fallbackResponse('Tool query limit exceeded. Please verify input.');
}`
        );
      } else if (type === 'GOAL_DRIFT') {
        addRec(
          'GOAL_DRIFT',
          'Goal Re-Anchoring Monitor',
          'Periodically compare the current plan against the original task objective.',
          `// Goal Alignment Monitor
if (!isWithinScope(currentTask, agent.primaryGoal)) {
  return refuseOffTopicRequest('Request falls outside configured scope.');
}`
        );
      } else if (type === 'RECOVERY_FAILURE') {
        addRec(
          'RECOVERY_FAILURE',
          'Fault Tolerance & Fallback Handler',
          'Add explicit fallback behaviour when tools return incomplete or conflicting data.',
          `// Fault Fallback Strategy
try {
  await dispatchTool(toolName, params);
} catch (err) {
  return handleGracefulDegradation(err, fallbackState);
}`
        );
      }
    });

    // Default recommendation if empty
    if (recommendations.length === 0) {
      addRec(
        'GENERAL',
        'Precondition Validation Guard',
        'Add deterministic input and state guards before tool dispatch.',
        '// Enforce input schema validation\nvalidateToolInputs(toolName, params);'
      );
    }

    return recommendations;
  }
}

module.exports = new RecommendationEngine();
