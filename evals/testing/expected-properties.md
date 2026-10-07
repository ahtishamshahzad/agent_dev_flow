# Expected properties — testing

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Happy path | admin changes another member's role successfully |
| P2 | Invalid input | unknown role value; missing body; non-existent user or project |
| P3 | Authorization denial | an editor or viewer calling it is refused; a non-member is refused |
| P4 | Cross-project access | an admin of project A cannot change members of project B |
| P5 | Business rule | demoting the last admin (including self-demotion) is refused |
| P6 | Right level | names the test level (API/integration) and why, rather than only unit tests or only E2E |
| P7 | One behavior per case | cases are separate and observable (e.g. Given/When/Then), not one test that checks everything |
