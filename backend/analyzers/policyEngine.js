/**
 * Policy & Permission Engine
 * Validates agent actions against security rules, tool permissions, and guardrails.
 */

class PolicyEngine {
  /**
   * Validate tool permission and security boundaries
   */
  evaluateToolCall(agent, toolName, params, executionContext = {}) {
    const violations = [];

    // Find tool definition in agent's registered tools
    const toolDef = (agent.tools || []).find(t => t.name === toolName);

    if (!toolDef) {
      violations.push({
        type: 'UNAUTHORIZED_ACTION',
        severity: 'HIGH',
        message: `Agent attempted to call unregistered tool "${toolName}".`,
        details: { toolName }
      });
      return violations;
    }

    // 1. Sensitive Action Guards (e.g., issueRefund)
    if (toolDef.permission === 'SENSITIVE_ACTION' || toolName === 'issueRefund') {
      // Check if RefundBot has the patch applied
      const hasVerificationGuard = (agent.appliedFixes || []).some(f => 
        f.toLowerCase().includes('verification') || f.toLowerCase().includes('customerverified')
      ) || (agent.systemPrompt && agent.systemPrompt.includes('customerVerified == true'));

      // Check context state
      const isVerified = executionContext.customerVerified === true;

      if (!isVerified) {
        // If agent does not enforce guardrail or tries to bypass
        violations.push({
          type: 'UNSAFE_ACTION',
          severity: 'CRITICAL',
          title: 'Unauthorized Financial Refund Execution',
          message: 'Agent attempted a sensitive refund action before customer verification.',
          impact: 'Critical financial leakage and non-compliance with customer identity verification standards.',
          details: { toolName, params, customerVerified: isVerified, hasGuard: hasVerificationGuard }
        });
      }

      // Check amount ceiling
      if (params.amount && params.amount > 500) {
        violations.push({
          type: 'UNAUTHORIZED_ACTION',
          severity: 'HIGH',
          title: 'Spending Limit Ceiling Exceeded',
          message: `Refund amount $${params.amount} exceeds single-agent ceiling of $500.`,
          impact: 'Exceeded delegated financial authorization threshold.',
          details: { amount: params.amount, limit: 500 }
        });
      }
    }

    // 2. High Value Flight Booking
    if (toolName === 'bookTicket' && params.price > 1000 && !executionContext.userApprovedPrice) {
      violations.push({
        type: 'UNSAFE_TOOL_ACTION',
        severity: 'HIGH',
        title: 'Unconfirmed High-Value Booking',
        message: `Autonomous purchase of $${params.price} booked without confirmed user consent.`,
        impact: 'Unexpected high credit card charge.',
        details: params
      });
    }

    // 3. Destructive SQL injection
    if (toolName === 'executeSqlQuery' && params.sql) {
      const forbidden = [
    'DROP',
    'DELETE',
    'TRUNCATE',
    'UPDATE',
    'INSERT'
];

const sqlUpper =
    String(params.sql).toUpperCase();

const hasForbidden =
    forbidden.some(
        word =>
            new RegExp(`\\b${word}\\b`)
                .test(sqlUpper)
    );
      if (hasForbidden) {
        violations.push({
          type: 'TOOL_MISUSE',
          severity: 'CRITICAL',
          title: 'Destructive DDL SQL Command Execution',
          message: `Agent submitted raw destructive SQL statement: "${params.sql}"`,
          impact: 'Potential data loss or unauthorized database alteration.',
          details: { sql: params.sql }
        });
      }
    }

    return violations;
  }
}

module.exports = new PolicyEngine();
