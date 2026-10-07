# Skills by intent — "I want to…"

Find the skill for what you're trying to do. Every entry links to a real skill; the validator fails on a link that doesn't resolve. The full catalogue and pack indexes are in [`README.md`](README.md). Load the **one to three** skills you need — not the list.

On a tracked project, whatever you run is recorded by [`project-management`](project-management/SKILL.md) afterwards.

## Plan and track

| I want to… | Start with |
|---|---|
| Start a project, or plan anything non-trivial | [`project-orchestrator`](project-orchestrator/SKILL.md) |
| Work in an existing codebase | [`existing-project-audit`](existing-project-audit/SKILL.md) → [`project-orchestrator`](project-orchestrator/SKILL.md) |
| Understand the requirements | [`requirements-analysis`](requirements-analysis/SKILL.md) |
| Decide which apps and which stack | [`application-selection`](application-selection/SKILL.md) → [`stack-recommendation`](stack-recommendation/SKILL.md) |
| Design the architecture or repo layout | [`architecture-design`](architecture-design/SKILL.md), [`repository-architecture`](repository-architecture/SKILL.md) |
| Break work into phases and tasks | [`task-planning`](task-planning/SKILL.md) |
| Plan a feature | [`feature-planning`](feature-planning/SKILL.md) |
| Track weeks, bugs, status, reports, change requests | [`project-management`](project-management/SKILL.md) |
| Refactor or migrate safely | [`refactor-planning`](refactor-planning/SKILL.md), [`migration-planning`](migration-planning/SKILL.md) |

## Build

| I want to… | Start with |
|---|---|
| Build a mobile app (React Native) | [`mobile-stack-selection`](mobile/mobile-stack-selection/SKILL.md) → [`expo-foundation`](mobile/expo-foundation/SKILL.md) or [`react-native-cli-foundation`](mobile/react-native-cli-foundation/SKILL.md) |
| Build a web app | [`web-stack-selection`](web/web-stack-selection/SKILL.md) → [`nextjs-foundation`](web/nextjs-foundation/SKILL.md) or [`vite-react-foundation`](web/vite-react-foundation/SKILL.md) |
| Build an admin dashboard | [`dashboard-architecture`](web/dashboard-architecture/SKILL.md), [`dashboard-tables`](web/dashboard-tables/SKILL.md) |
| Build a backend API | [`backend-stack-selection`](backend/backend-stack-selection/SKILL.md) → [`express-foundation`](backend/express-foundation/SKILL.md) or [`nestjs-foundation`](backend/nestjs-foundation/SKILL.md) → [`rest-api-design`](backend/rest-api-design/SKILL.md) |
| Design the database | [`database-selection`](database/database-selection/SKILL.md) → [`relational-schema-design`](database/relational-schema-design/SKILL.md) or [`document-schema-design`](database/document-schema-design/SKILL.md) |
| Add login and signup | [`backend-authentication`](backend/backend-authentication/SKILL.md), [`web-authentication`](web/web-authentication/SKILL.md) / [`mobile-authentication`](mobile/mobile-authentication/SKILL.md), [`auth-form-validation`](auth-form-validation/SKILL.md) |
| Add roles and permissions | [`role-permission-design`](backend/role-permission-design/SKILL.md), [`ownership-authorization`](backend/ownership-authorization/SKILL.md) |
| Add payments or subscriptions | No dedicated skill yet — [`third-party-integrations`](backend/third-party-integrations/SKILL.md) + [`webhooks`](backend/webhooks/SKILL.md), with [`transactions`](database/transactions/SKILL.md) |
| Upload files, images, video | [`file-storage`](backend/file-storage/SKILL.md), [`mobile-file-upload`](mobile/mobile-file-upload/SKILL.md), [`mobile-camera-media`](mobile/mobile-camera-media/SKILL.md) |
| Send email or push notifications | [`email-notifications`](backend/email-notifications/SKILL.md), [`mobile-notifications`](mobile/mobile-notifications/SKILL.md) |
| Run background or scheduled work | [`background-jobs`](backend/background-jobs/SKILL.md), [`queues`](backend/queues/SKILL.md), [`scheduled-jobs`](backend/scheduled-jobs/SKILL.md) |
| Add realtime features | [`realtime-communication`](backend/realtime-communication/SKILL.md) |
| Document what was built | [`application-documentation`](application-documentation/SKILL.md) |

## Test

| I want to… | Start with |
|---|---|
| Decide what and how to test | [`testing-strategy`](testing-strategy/SKILL.md) → [`testing-selection`](testing/testing-selection/SKILL.md) |
| Write acceptance criteria as scenarios | [`gherkin-specifications`](testing/gherkin-specifications/SKILL.md) |
| End-to-end test a web or mobile app | [`playwright-e2e`](testing/playwright-e2e/SKILL.md), [`maestro-e2e`](testing/maestro-e2e/SKILL.md) |
| Pin a fixed bug | [`regression-testing`](testing/regression-testing/SKILL.md) |
| Find what's under-tested or flaky | [`test-coverage-audit`](testing/test-coverage-audit/SKILL.md), [`flaky-test-audit`](testing/flaky-test-audit/SKILL.md) |

## Review and secure

| I want to… | Start with |
|---|---|
| Review a change | [`code-review`](code-review/SKILL.md) |
| Fix a bug | [`project-management`](project-management/SKILL.md) (intake) → [`bug-investigation`](bug-investigation/SKILL.md) |
| Check security | [`security-review`](security-review/SKILL.md), [`threat-modeling`](security/threat-modeling/SKILL.md) |
| Check access control (IDOR, escalation) | [`authorization-security`](security/authorization-security/SKILL.md) |
| Stop abuse (bots, brute force, spam) | [`abuse-prevention`](security/abuse-prevention/SKILL.md), [`rate-limiting`](backend/rate-limiting/SKILL.md) |
| Handle personal data | [`privacy-review`](security/privacy-review/SKILL.md) |
| Audit dependencies or secrets | [`dependency-audit`](dependency-audit/SKILL.md), [`secrets-audit`](security/secrets-audit/SKILL.md) |
| Make it faster | [`performance-review`](performance-review/SKILL.md) |
| Check AI output for invented facts and false "done" | [`ai-output-review`](ai-output-review/SKILL.md) |

## Ship

| I want to… | Start with |
|---|---|
| Set up CI | [`ci-cd`](devops/ci-cd/SKILL.md) → [`github-actions`](devops/github-actions/SKILL.md) |
| Choose where to deploy | [`deployment-selection`](devops/deployment-selection/SKILL.md) |
| Get production-ready | [`production-readiness`](devops/production-readiness/SKILL.md), [`monitoring-logging`](devops/monitoring-logging/SKILL.md), [`rollback-planning`](devops/rollback-planning/SKILL.md) |
| Release | [`release-planning`](release-planning/SKILL.md) → [`final-quality-audit`](final-quality-audit/SKILL.md) |
| Publish to the App Store / Play Store | [`mobile-release`](mobile/mobile-release/SKILL.md), [`ios-readiness`](mobile/ios-readiness/SKILL.md), [`android-readiness`](mobile/android-readiness/SKILL.md) |
| Branch, commit, open a PR | [`git-workflow`](git-workflow/SKILL.md), [`github-repository`](github-repository/SKILL.md) |
