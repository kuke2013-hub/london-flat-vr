# London Flat VR

Reconstruction of a former London flat as a realistic room-scale Meta Quest 3 WebXR experience.

## Technical direction

- Three.js 0.186.1 (ES modules) and WebXR, delivered by GitHub Pages to Meta Quest Browser.
- Rapier 3D physics, using the known working browser import: `https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.21.0/dist/rapier.mjs`.
- Metres as world units: 1 unit = 1 metre.
- Desktop inspection alongside headset navigation, controller and hand interaction where appropriate.
- Procedural architecture, with visible geometry aligned to static colliders. Actual door and window openings.
- Single continuous apartment scene, with modular code for geometry, rooms, engine and assets. No required external GLB for the shell.
- Performance budget based on measurements made in Quest 3 browser, not desktop-only results.

## Known apartment details (unmeasured)

Modern London corner flat in a five-storey building; approximately 54 square metres by recollection. Non-orthogonal tapered footprint, one bedroom, one bathroom/toilet, small corridor, and living room with open-plan kitchen. Large windows on different sides, with east/west orientations to be established from references.

**No dimensions, wall angles, window positions or room outlines are confirmed yet.** The plan and photographs will be supplied later. Any inferred values must be labelled provisional.

## Milestones

1. Trace and review the supplied 2D outline.
2. Build a dimensioned, adjustable shell with floors, walls, ceilings, door and window openings.
3. Validate navigation, scale, collisions and performance on Meta Quest 3.
4. Add architectural materials, fixtures, furniture and lighting incrementally.

Do not add unrelated cube-demo objects, external character models or experimental deformation code.

## Provenance

The prior experiments remain untouched in [wood-box-vr](https://github.com/kuke2013-hub/wood-box-vr). This repository is a clean project for the apartment.
