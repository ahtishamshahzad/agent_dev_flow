# `.ai/skills/mobile/` — Mobile Skill Pack (Index)

Reusable, tool-neutral skills for planning and building React Native / Expo mobile apps. Discover them **through this index**, then load only the relevant ones (`../../system/SKILL_SELECTION_RULES.md`). **Do not load the whole pack** — most tasks need 1–3 skills.

Mobile skills evaluate options rather than blindly installing, keep server/client state separate, treat client-side checks as UX (the server enforces), and defer store publishing to explicit approval. They coordinate with the core skills (`../`) — e.g. `mobile-performance` ↔ `../performance-review`, `mobile-release` ↔ `../release-planning`.

## Categories

### Runtime & Foundation
| Skill | Description |
|-------|-------------|
| [`mobile-stack-selection`](mobile-stack-selection/SKILL.md) | Expo vs React Native CLI, evaluated on real native needs; does **not** default to CLI. |
| [`expo-foundation`](expo-foundation/SKILL.md) | Expo foundation: Go vs dev builds, EAS Build/Submit, OTA, baseline libs. |
| [`react-native-cli-foundation`](react-native-cli-foundation/SKILL.md) | CLI foundation: native iOS/Android ownership, custom modules, baseline libs. |
| [`mobile-project-audit`](mobile-project-audit/SKILL.md) | Audit an existing mobile app (runtime, patterns, native modules, readiness) before changing it. |

### Navigation & Design
| Skill | Description |
|-------|-------------|
| [`mobile-navigation`](mobile-navigation/SKILL.md) | Expo Router vs React Navigation; navigator tree; typed params; protected routes. |
| [`mobile-design-system`](mobile-design-system/SKILL.md) | Tokens, scales, reusable primitives. |
| [`mobile-theme`](mobile-theme/SKILL.md) | Light/dark theming on tokens; runtime switching. |
| [`mobile-fonts`](mobile-fonts/SKILL.md) | Custom fonts, async loading, typography wiring. |
| [`mobile-vector-icons`](mobile-vector-icons/SKILL.md) | Icon set choice, token-driven sizing/color, lean bundling. |

### State & Data
| Skill | Description |
|-------|-------------|
| [`mobile-state-management`](mobile-state-management/SKILL.md) | Where each value lives: local/form/shared/server/persisted/navigation. Not everything in Redux/Zustand. |
| [`mobile-server-state`](mobile-server-state/SKILL.md) | RTK Query / TanStack Query: fetch, cache, invalidate, retry, offline. |
| [`mobile-api-integration`](mobile-api-integration/SKILL.md) | fetch vs Axios transport, interceptors, auth headers, error mapping. |
| [`mobile-environment-config`](mobile-environment-config/SKILL.md) | dev/staging/prod config; no secrets in the client bundle. |

### Forms & Validation
| Skill | Description |
|-------|-------------|
| [`mobile-forms`](mobile-forms/SKILL.md) | React Hook Form state, submission, error UX; form state stays local. |
| [`mobile-validation`](mobile-validation/SKILL.md) | Zod schemas at form/API edges; client validation is UX, server enforces. |

### Auth & Security
| Skill | Description |
|-------|-------------|
| [`mobile-authentication`](mobile-authentication/SKILL.md) | Login/signup, token lifecycle, refresh, logout; server enforces. |
| [`mobile-authorization`](mobile-authorization/SKILL.md) | Role/permission gating; server-verified access; UI hiding is convenience. |
| [`mobile-secure-storage`](mobile-secure-storage/SKILL.md) | Keychain/Keystore for sensitive data; async storage for the rest. |

### Native Capabilities
| Skill | Description |
|-------|-------------|
| [`mobile-notifications`](mobile-notifications/SKILL.md) | Push/local: provider, permissions, tokens, tap→deep-link. |
| [`mobile-deep-linking`](mobile-deep-linking/SKILL.md) | URL scheme + universal/app links; cold/warm start. |
| [`mobile-file-upload`](mobile-file-upload/SKILL.md) | Pick/limit/upload with progress; server validates. |
| [`mobile-camera-media`](mobile-camera-media/SKILL.md) | Permissions, capture/pick, resize/compress. |
| [`mobile-location-maps`](mobile-location-maps/SKILL.md) | Location permissions, maps, battery-aware usage. |
| [`mobile-background-tasks`](mobile-background-tasks/SKILL.md) | Background fetch/location/audio within OS limits. |
| [`mobile-native-modules`](mobile-native-modules/SKILL.md) | Evaluate packages/config plugins first; custom modules only when needed. |

### Quality & UX
| Skill | Description |
|-------|-------------|
| [`mobile-accessibility`](mobile-accessibility/SKILL.md) | Labels/roles, focus order, targets, contrast, dynamic type. |
| [`mobile-performance`](mobile-performance/SKILL.md) | Measured bottlenecks (lists/re-renders/memory/startup); safe fixes. |
| [`mobile-error-handling`](mobile-error-handling/SKILL.md) | Error boundaries, async handling, crash reporting (PII-safe). |
| [`mobile-logging`](mobile-logging/SKILL.md) | Structured level-based logging; no secrets/PII; dev vs prod. |

### Testing
| Skill | Description |
|-------|-------------|
| [`mobile-unit-testing`](mobile-unit-testing/SKILL.md) | Jest/Vitest for logic, hooks, reducers. |
| [`mobile-component-testing`](mobile-component-testing/SKILL.md) | React Native Testing Library; accessible queries. |
| [`mobile-maestro-e2e`](mobile-maestro-e2e/SKILL.md) | Maestro for **critical** mobile E2E flows on device/emulator. |

### Build & Release
| Skill | Description |
|-------|-------------|
| [`mobile-builds`](mobile-builds/SKILL.md) | EAS Build (Expo) / Fastlane-native (CLI), signing, native build validation. |
| [`mobile-release`](mobile-release/SKILL.md) | Store submission, versioning, OTA, staged rollout; publish needs approval. |
| [`ios-readiness`](ios-readiness/SKILL.md) | Bundle id, signing, entitlements, Info.plist strings, privacy manifest. |
| [`android-readiness`](android-readiness/SKILL.md) | applicationId, signing, permissions, target SDK, 16KB page-size, Play policy. |

## Selection guidance (mobile)

| Situation | Load (only these) |
|---|---|
| New mobile app | `mobile-stack-selection` → `expo-foundation`/`react-native-cli-foundation` → `mobile-navigation` → `mobile-design-system` |
| Existing mobile app | `mobile-project-audit` first, then the relevant feature skills |
| Building screens | `mobile-design-system` + `mobile-navigation` (+ `mobile-theme`/`mobile-fonts`/`mobile-vector-icons` as needed) + `mobile-accessibility` |
| Data/state work | `mobile-state-management` → `mobile-server-state` + `mobile-api-integration` (+ `mobile-environment-config`) |
| Forms | `mobile-forms` + `mobile-validation` |
| Auth | `mobile-authentication` + `mobile-authorization` + `mobile-secure-storage` |
| Native feature | the specific capability skill + `mobile-native-modules` (+ readiness skills) |
| Testing | `mobile-unit-testing` / `mobile-component-testing`; `mobile-maestro-e2e` **only when critical E2E flows exist** |
| Shipping | `mobile-builds` → `ios-readiness`/`android-readiness` → `mobile-release` (+ `../release-planning`) |

## Dependency guidance (how mobile skills relate)

- **Runtime is decided first** (`mobile-stack-selection`) → one foundation skill; everything else follows.
- **State** splits by category (`mobile-state-management`), delegating server data to `mobile-server-state` and transport to `mobile-api-integration`.
- **Forms** delegate validation to `mobile-validation`; **auth** delegates token storage to `mobile-secure-storage`.
- **Native capabilities** consult `mobile-native-modules` (package-first) and feed `ios-readiness`/`android-readiness`.
- **Testing** layers: unit → component → Maestro (critical flows only).
- **Shipping** chains `mobile-builds` → readiness → `mobile-release`, aligned with core `../release-planning`.

## References

Mobile reference material (examples, patterns — not permanent skill content) lives under:
`../../references/mobile/screens/`, `.../navigation/`, `.../forms/`, `.../state/`, `.../native/`, `.../notifications/` — populated as the project develops.

## Rule: do NOT load the whole pack

Loading every mobile skill wastes context (`../../system/TOKEN_OPTIMIZATION_RULES.md`). Select the minimum relevant set via this index, load one stage at a time, and unload on task switch.
