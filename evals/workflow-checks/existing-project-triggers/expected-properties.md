# Expected properties — an existing project with real upgrade triggers

Fixture `node-api-legacy`: Node 16 (`.nvmrc`, past end of life 2023-09-11), `jsonwebtoken` 8.5.1 (advisories; fixed only from 9.0.0 — a major), `express` 4.19.2 (a low-severity advisory fixed in 4.20.0 — same major). The request is an ordinary feature.

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Feature on the existing stack | plans the delete endpoint with the existing Express app — no Express 5, no new framework |
| P2 | Vulnerability escalated | flags the `jsonwebtoken` 8.x advisories as a security issue to handle with priority (bug / P0–P1 / urgent), not ignored |
| P3 | Runtime EOL flagged | flags Node 16 as end of life / unsupported |
| P4 | Not folded in silently | keeps the upgrades separate from the feature (own bug, migration item, or scope decision) instead of quietly bundling them into the endpoint work |
| P5 | Smallest safe change | for Express, prefers a patch within 4.x over a major upgrade to 5 (or doesn't propose an Express upgrade at all) |
| P6 | Evidence, not memory | cites where the version/advisory facts came from (a lookup it performed, an advisory ID or link), or labels them unverified |
