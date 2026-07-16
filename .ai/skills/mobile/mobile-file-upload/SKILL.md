---
name: mobile-file-upload
description: Use to plan file uploads from mobile — picking files/images, size/type limits, progress, retries, and secure transfer to storage/backend. Validate on the server; keep uploads off executable paths.
---

# Mobile File Upload

## Purpose

Plan file uploads: picking files/images, client-side size/type checks, upload with progress/retries, and secure delivery to storage/backend.

## When to Use

- When users upload images/documents/media.
- Not for camera capture UX itself (that's `mobile-camera-media`).

## Inputs

- Upload requirements (types, sizes, destinations).
- Storage/backend target and auth.

## Discovery Questions

- What file types/sizes are allowed?
- Direct-to-storage (signed URL) or via backend?
- What progress/retry/resume behavior is needed?
- How is the upload authorized?

## Responsibilities

- Plan **file/image picking** and client-side **type/size checks**.
- Plan **upload transport**: signed-URL direct-to-storage or via backend, with **progress/retries**.
- Ensure **server-side validation** and non-executable storage (`../../security-review`).
- Handle large files and poor networks gracefully.

## Required Workflow

1. Confirm allowed types/sizes + destination.
2. Plan picking + client checks.
3. Plan upload transport + progress/retry.
4. Confirm server-side validation + safe storage.
5. Record the upload plan.

## Decision Rules

- Client checks are UX; the **server validates** type/size and stores safely.
- Prefer signed-URL direct upload for large files to offload the backend.
- Handle retries/resume for mobile networks.
- Never serve uploads from an executable path.

## Rules

- Server-side validation is authoritative.
- Authorize uploads; don't expose open write access.
- Coordinate secure transfer + auth.

## Anti-Patterns

- Trusting client-side type/size checks for security.
- No progress/retry on flaky networks.
- Serving uploads from executable paths.
- Unauthorized/open upload endpoints.

## Validation Checklist

- [ ] Allowed types/sizes defined.
- [ ] Picking + client checks planned.
- [ ] Upload transport + progress/retry planned.
- [ ] Server-side validation + safe storage confirmed.
- [ ] Uploads authorized.

## Definition of Done

A recorded upload plan: picking with client checks, resilient upload transport (signed-URL or backend) with progress/retry, and server-side validation with safe, authorized storage.

## Related Skills

`mobile-camera-media`, `mobile-api-integration`, `mobile-server-state`, `../../security-review`, `mobile-secure-storage`

## Related Knowledge

`../../../knowledge/` (storage targets).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** upload requirements, storage target, auth.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-camera-media`, `mobile-api-integration`.
- **Stop when:** the upload plan is recorded.

## Token Efficiency Guidance

Plan transport + validation; delegate capture to camera-media.
