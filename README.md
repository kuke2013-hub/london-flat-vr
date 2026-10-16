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

## First working draft — shell v0.1 (16 October 2026)

Files: `index.html` (Three.js/WebXR/Rapier engine, room rendering, desktop plan and walkthrough) and `apartment/layout.js` (editable coordinates and architectural geometry).

The supplied Clephane Road estate-agent plan states **52.58 m² gross internal area** and **5.11 m² gross balcony area**. Its reception, kitchen and bedroom dimensions guide provisional scaling. The shell includes a tapered exterior wall, interior rooms, gaps for internal doors, floor-to-ceiling reception and bedroom glazing, pale timber flooring, cream bedroom carpet, and grey kitchen flooring. Balconies and outdoor scenery are not modelled. Ceiling height (2.50 m), thicknesses, window framing and door swings **are not measured**.

**Desktop:** Open the published GitHub Pages URL. Plan view uses drag to pan and scroll to zoom. Use *Walk inside* for WASD movement; click the scene to enable mouse look, press Esc to unlock. *Reset position* returns to the corridor. Performance counters are displayed.

**Meta Quest 3:** Open the GitHub Pages URL in Meta Quest Browser and select *Enter VR*. Use the left controller thumbstick to move, or move naturally within your safe tracked play space. Walls/windows are collision boundaries for joystick movement. The VR headset must be used within Guardian/boundary safety limits. The balconies are deliberately blocked by glazing until modelled.

**To publish with GitHub Pages:** Repository → Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/(root)` → Save. When Pages is deployed, the expected address is https://kuke2013-hub.github.io/london-flat-vr/ .

**Testing state:** JavaScript syntax and source commits checked. Desktop browser execution and actual Quest 3 VR performance still require testing; this file does not claim that VR has been tested.
