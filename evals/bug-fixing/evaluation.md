# Evaluation — bug-fixing

**Trap:** "when the payment page is slow" points at the frontend. The cause is a server-side race; the slowness only widens the window. P2 and P3 measure whether the agent goes past the symptom.

**Scoring:** pass/fail with a quoted line. P4 passes for any approach that makes the second charge impossible on the server; it fails for approaches that only make it less likely.

**Typical failures:** "add a loading spinner and disable the button" as the fix (P3); a fix with no test (P5); "Fixed ✅" with nothing run (P7).
