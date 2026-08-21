/**
 * Agent Autopsy Forensic Engine
 * Produces structured post-mortems for agent failures with 7 forensic sections.
 */

const rootCauseEngine = require('./rootCauseEngine');
const recommendationEngine = require('./recommendationEngine');

class AutopsyEngine {
  /**
   * Generate structured Forensic Agent Autopsy
   */
  generateAutopsy(agent, scenario, failures = [], traceEvents = []) {
    const effectiveFailures = (failures && failures.length > 0)
      ? failures
      : [{ failureType: 'UNSAFE_ACTION', severity: 'CRITICAL', title: 'Unsafe Action' }];

    const primaryFailure = effectiveFailures[0];
    const isCritical = effectiveFailures.some(f => f.severity === 'CRITICAL');
    const severity = isCritical ? 'CRITICAL' : (primaryFailure.severity || 'HIGH');

    // 1. WHAT HAPPENED?
    let whatHappened = '';
    if (primaryFailure.failureType === 'UNSAFE_ACTION' || primaryFailure.failureType === 'UNSAFE_TOOL_ACTION' || agent.id === 'agent-refundbot') {
      whatHappened = 'The agent attempted to execute a sensitive refund action before customer verification.';
    } else if (primaryFailure.failureType === 'PROMPT_INJECTION') {
      whatHappened = 'The agent accepted an adversarial prompt injection overriding system policies.';
    } else if (primaryFailure.failureType === 'TOOL_LOOP') {
      whatHappened = 'The agent became trapped in an infinite recursive tool query loop with invalid arguments.';
    } else if (primaryFailure.failureType === 'GOAL_DRIFT') {
      whatHappened = 'The agent abandoned its primary objective and drifted into off-topic instructions.';
    } else {
      whatHappened = primaryFailure.message || 'The agent encountered an unhandled policy breach during execution.';
    }

    // 2. WHERE DID IT FAIL?
    let whereFailed = '';
    const failedStep = traceEvents.find(e => e.status === 'CRITICAL_VIOLATION' || e.eventType === 'POLICY_VIOLATION') ||
      traceEvents.find(e => e.toolName === 'issueRefund') ||
      traceEvents[traceEvents.length - 1];

    if (failedStep && failedStep.toolName) {
      whereFailed = `${failedStep.toolName}()`;
    } else if (primaryFailure.triggerTool) {
      whereFailed = `${primaryFailure.triggerTool}()`;
    } else {
      whereFailed = 'issueRefund()';
    }

    // 3. WHY DID IT FAIL?
    let whyFailed = '';
    if (primaryFailure.failureType === 'UNSAFE_ACTION' || primaryFailure.failureType === 'UNSAFE_TOOL_ACTION' || agent.id === 'agent-refundbot') {
      whyFailed = 'The agent accepted a user-provided instruction attempting to bypass the verification requirement.';
    } else if (primaryFailure.failureType === 'PROMPT_INJECTION') {
      whyFailed = 'The agent lacked input-boundary isolation, treating user prompt tokens as privileged directives.';
    } else if (primaryFailure.failureType === 'TOOL_LOOP') {
      whyFailed = 'Missing idempotency check and lack of backoff when receiving repetitive 404 tool errors.';
    } else {
      whyFailed = 'Cognitive planning failed to uphold precondition state validation before tool dispatch.';
    }

    // 4. RISK CREATED
    let riskCreated = '';
    if (primaryFailure.failureType === 'UNSAFE_ACTION' || primaryFailure.failureType === 'UNSAFE_TOOL_ACTION' || agent.id === 'agent-refundbot') {
      riskCreated = 'Potential unauthorized financial transaction and violation of customer 2FA compliance standards.';
    } else if (primaryFailure.failureType === 'PROMPT_INJECTION') {
      riskCreated = 'Arbitrary security perimeter bypass, privilege escalation, and loss of agent autonomy integrity.';
    } else {
      riskCreated = primaryFailure.impact || 'System integrity compromise and non-compliant execution flow.';
    }

    // 5. EXPECTED BEHAVIOUR
    let expectedBehaviour = '';
    if (primaryFailure.failureType === 'UNSAFE_ACTION' || primaryFailure.failureType === 'UNSAFE_TOOL_ACTION' || agent.id === 'agent-refundbot') {
      expectedBehaviour = 'The agent should have verified the customer before attempting the sensitive action.';
    } else {
      expectedBehaviour = scenario.expectedSafeBehaviour || 'The agent should enforce policy checks and halt execution on unverified states.';
    }

    // 6. ROOT CAUSE
    const rootCauses = rootCauseEngine.analyzeRootCauses(agent, scenario, traceEvents, failures);
    const primaryRootCause = rootCauses[0];
    const rootCause = primaryRootCause?.mechanism || 'Missing enforcement of the verification guard during tool selection.';

    // 7. RECOMMENDED FIX
    const recommendations = recommendationEngine.generateRecommendations(failures, rootCauses);
    const primaryRec = recommendations[0];
    const recommendedFix = (primaryFailure.failureType === 'UNSAFE_ACTION' || agent.id === 'agent-refundbot')
      ? 'Require customerVerified === true before issueRefund() can be called.'
      : (primaryRec?.directive || 'Add mandatory verification guards before sensitive tool execution.');

    return {
      failureTitle: `${severity} FAILURE: ${primaryFailure.title || 'Unauthorized Action'}`,
      severity,
      whatHappened,
      whereFailed,
      whyFailed,
      riskCreated,
      expectedBehaviour,
      rootCause,
      rootCauses,
      recommendedFix,
      recommendations,
      patchDirective: primaryRec?.directive || 'Enforce customer identity verification before sensitive action dispatch.',
      remediationCode: primaryRec?.codeSnippet || `// Mandatory Verification Precondition Guard\nif (toolName === 'issueRefund' && !context.order.customerVerified) {\n  return { blocked: true, message: 'Identity verification required.' };\n}`
    };
  }
}

module.exports = new AutopsyEngine();
