
<div align="center">

# ⚡ AGENTX-RAY

### AI Agent Reliability & Adversarial Testing Platform

**See how your AI agent fails, why it fails, and how to make it safer.**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-API-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[Overview](#-overview) •
[Features](#-key-features) •
[Architecture](#-architecture) •
[Installation](#-getting-started) •
[Scoring](#-reliability-scoring) •
[Roadmap](#-roadmap)

</div>

---

## 🎯 Overview

AI agents can fail in ways that ordinary happy-path tests do not reveal.
They may follow malicious instructions, invoke sensitive tools too early,
drift away from their goals, or fail to recover from tool errors.

**AgentX-Ray** is a prototype platform for evaluating AI agent reliability
through adversarial scenarios, isolated tool simulations, execution traces,
failure analysis, and remediation comparisons.

The goal is to help developers identify risky behavior before deploying
agents into sensitive workflows.

### The workflow

1. **Configure** an agent's goals, tools, and safety rules.
2. **Generate** adversarial scenarios and multi-step failure chains.
3. **Execute** tests in a controlled mock environment.
4. **Inspect** chronological events and detected failure patterns.
5. **Analyze** root causes and review recommended safeguards.
6. **Compare** reliability scores before and after remediation.

---

## ✨ Key Features

| Feature | Description |
| --- | --- |
| 🧪 Adversarial Scenarios | Test prompt injection, unsafe actions, goal drift, and tool misuse. |
| 🔗 Multi-Step Failure Chains | Explore how several events can combine into a failure. |
| 🧰 Mock Sandbox | Simulate tool execution without performing real-world actions. |
| 📜 Execution Traces | Inspect inputs, tool calls, responses, and policy interceptions. |
| 🧬 Failure Fingerprints | Summarize detected behavioral failure patterns. |
| 🔬 Agent Autopsy | Review the incident, root cause, risk, and recommended fix. |
| 📊 Reliability Scoring | Calculate a weighted score across five reliability dimensions. |
| 🛡️ Remediation Demo | Compare a baseline agent configuration with a hardened one. |
| 📄 Audit Reports | Generate evaluation summaries for review and record keeping. |
| 🔌 Zero-Key Demo | Explore the demonstration workflow without an external LLM API key. |

> **Scope:** The mock sandbox evaluates simulated agent behavior. It does not, by itself,
> establish that an agent is secure in production or against every possible attack.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    A[Agent Configuration] --> D[Scenario Generator]
    B[Adversarial Prompts] --> D
    C[Tool Permissions and Rules] --> E[Mock Sandbox]
    D --> E
    E --> F[Execution Trace]
    F --> G[Failure Detection]
    G --> H[Failure Fingerprint]
    G --> I[Agent Autopsy]
    H --> J[Reliability Scoring]
    I --> K[Recommended Remediation]
    J --> L[Before and After Comparison]
    K --> L
```

The platform separates scenario generation, simulated execution, failure
analysis, scoring, and remediation so each stage can be inspected.

---

## 📊 Reliability Scoring

AgentX-Ray uses a five-axis weighted scoring model.

| Dimension | Weight |
| --- | ---: |
| Task Accuracy | 25% |
| Tool Safety | 25% |
| Goal Adherence | 20% |
| Attack Resistance | 15% |
| Recovery Ability | 15% |
| **Total** | **100%** |

The weighted score is:

`Score = 0.25A + 0.25T + 0.20G + 0.15R + 0.15C`

Where A, T, G, R, and C are the respective dimension scores,
each measured from 0 to 100.

### Demonstration: remediation comparison

| State | Demo score | Interpretation |
| --- | ---: | --- |
| Baseline RefundBot | 68/100 | Needs Attention |
| Hardened RefundBot | 94/100 | Excellent |
| Demonstrated change | +26 points | Improvement in the demo |

These values describe the configured demonstration scenario; they are
not independently validated production benchmarks.

---

## 🛡️ Failure Detection

The prototype includes heuristic checks for nine failure categories:

- `UNSAFE_ACTION` — sensitive action attempted before required validation.
- `PROMPT_INJECTION` — untrusted instructions attempt to override policy.
- `GOAL_DRIFT` — actions depart from the defined task.
- `TOOL_LOOP` — repeated tool calls without useful progress.
- `RECOVERY_FAILURE` — unsuccessful handling of tool errors.
- `HALLUCINATION` — unsupported facts or tool outcomes.
- `TOOL_MISUSE` — invalid tool arguments.
- `UNAUTHORIZED_ACTION` — action outside permitted tool access.
- `CONFLICTING_INSTR` — violation of defined system invariants.

Detection quality depends on the implemented rules and the scenarios tested.

---

## 🧰 Tech Stack

**Frontend:** React, Vite, Tailwind CSS, Lucide Icons, Recharts, Axios

**Backend:** Node.js, Express.js

**Data:** MongoDB, Mongoose, in-memory fallback (where supported)

**Testing engine:** Mock tools, scenario generation, execution tracing,
heuristic failure detection, and deterministic scoring

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/PushplataPal/AgentX-Ray.git
cd AgentX-Ray
```

### 2. Install dependencies

If the root `package.json` defines the `install:all` script:

```bash
npm run install:all
```

Otherwise, install dependencies in the root, backend, and frontend
directories according to their individual `package.json` files.

### 3. Configure the environment

If required, copy `.env.example` to `.env` and configure the variables
documented in that file.

Never commit real credentials or API keys.

### 4. Start the backend

```bash
cd backend
npm run dev
```

### 5. Start the frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

Open the local frontend URL printed by Vite in your terminal.

> Check the scripts in each `package.json` before running these commands.
> The exact setup depends on the current repository configuration.

---

## 📡 API Overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health and storage status |
| GET | `/api/agents` | List agents |
| POST | `/api/scenarios/generate` | Generate scenarios |
| POST | `/api/runs` | Start a test run |
| GET | `/api/runs/:id` | Inspect a run |
| POST | `/api/analyze` | Analyze a trace |
| POST | `/api/autopsy` | Produce a forensic report |
| POST | `/api/reliability/calculate` | Calculate a reliability score |
| POST | `/api/reports/generate` | Generate an audit report |

Refer to the implemented routes and controllers for the complete API
contract and request formats.

---

## 🗺️ Roadmap

- [ ] Add automated regression tests for failure detection.
- [ ] Expand adversarial scenario coverage.
- [ ] Validate scoring against a documented evaluation dataset.
- [ ] Add continuous integration for repeatable testing.
- [ ] Explore standardized agent trace exports.
- [ ] Evaluate integrations with real agent frameworks in a controlled environment.

---

## 👩‍💻 Author

**Pushplata Pal**

B.Tech CSE student interested in AI systems, software development,
and application reliability.

- GitHub: [@PushplataPal](https://github.com/PushplataPal)

---

<div align="center">

**Built to make AI agent failures visible before deployment.** ⚡

</div>
