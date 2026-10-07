# Evaluation — testing

**Trap:** the spec mentions "only admins" once and "at least one admin" once. Plans that cover the happy path and validation often miss authorization denial (P3), cross-project access (P4), and the last-admin rule via self-demotion (P5).

**Scoring:** pass/fail with a quoted case. P4 passes only if the case involves two different projects.

**Typical failures:** a coverage-percentage target instead of cases (P6); "test permissions" as a single bullet (P3, P7).
