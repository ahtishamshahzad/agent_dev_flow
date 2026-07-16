---
name: mobile-camera-media
description: Use to plan camera and media capture — permissions, capture/pick flows, image/video handling, and resizing/compression before upload. Requires native support (dev build or CLI).
---

# Mobile Camera Media

## Purpose

Plan camera/media: request permissions, capture or pick photos/video, and process (resize/compress) media before use/upload.

## When to Use

- When the app captures or picks photos/video/audio.
- Not on Expo Go for capabilities needing a dev build.

## Inputs

- Media requirements (capture/pick, photo/video, quality).
- Runtime + build model; upload target (`mobile-file-upload`).

## Discovery Questions

- Capture, pick from library, or both? Photo/video/audio?
- What quality/resolution is needed vs bandwidth/storage?
- How are permissions requested and handled if denied?

## Responsibilities

- Handle **camera/library permissions** and denial states.
- Plan **capture/pick** flows.
- **Resize/compress** media before upload to save bandwidth/memory (`mobile-performance`).
- Hand off to **upload** (`mobile-file-upload`).

## Required Workflow

1. Confirm media needs + native support.
2. Request permissions; handle denial.
3. Plan capture/pick + processing (resize/compress).
4. Hand off to upload.
5. Record the media plan.

## Decision Rules

- Capabilities requiring native support need a dev build (Expo) or CLI, not Expo Go.
- Resize/compress before upload — don't send full-resolution originals needlessly.
- Request permission contextually; handle denial gracefully.

## Rules

- Respect permission models; handle denial.
- Process media to protect memory/bandwidth.
- Coordinate upload with `mobile-file-upload`.

## Anti-Patterns

- Assuming Expo Go covers all capture.
- Uploading full-resolution originals.
- No handling for denied permissions.
- Leaking large media into memory (`mobile-performance`).

## Validation Checklist

- [ ] Native support confirmed.
- [ ] Permissions + denial handled.
- [ ] Capture/pick flows planned.
- [ ] Resize/compress before upload.
- [ ] Handoff to upload defined.

## Definition of Done

A recorded media plan: permission handling, capture/pick flows, resize/compress processing, and a clean handoff to upload — with native support confirmed.

## Related Skills

`mobile-file-upload`, `mobile-native-modules`, `mobile-performance`, `mobile-builds`

## Related Knowledge

`../../../knowledge/` (media requirements).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** media requirements, runtime/build model, upload target.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-file-upload`, `mobile-performance`.
- **Stop when:** the media plan is recorded.

## Token Efficiency Guidance

Plan capture + processing; delegate transfer to file-upload.
