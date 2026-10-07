# Examples

Worked examples of what the AI Engineering System produces when it plans a project. They show the **shape and depth of the planning artifacts** — not a shipped product.

| Example | What it shows |
|---|---|
| [`multi-tenant-saas/`](multi-tenant-saas/README.md) | A fictional field-inspection SaaS: web dashboard + mobile app + API + PostgreSQL, org-scoped auth and roles, seat-based subscriptions, photo uploads, offline capture — from the first request through the release checklist and week 1 of tracking. |

## How to read the labels

Every file opens with a status line. These words mean different things, and the system never blurs them:

| Label | Meaning |
|---|---|
| **PROPOSED** | A plan or decision presented for approval. Nothing exists yet. |
| **APPROVED (simulated)** | In a real run the user approves at a gate; in this example the approval is illustrative. |
| **GENERATED** | Written by an agent following the pipeline, and not yet checked by a person. |
| **VERIFIED** | Checked against code, tests, or a real run — with the evidence quoted. |
| **IMPLEMENTED** | Code exists and its acceptance criteria pass. |

Everything in these examples is **PROPOSED** or **APPROVED (simulated)**. No code was written, no tests were run, and nothing was deployed. They are hand-written illustrations of the format, not evidence that the system works — that is what [`../evals/`](../evals/README.md) is for.

Examples are not shipped by `agentflow init`.
