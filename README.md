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

The supplied Clephane Road estate-agent plan states **52.58 m² gross internal area** and **5.11 m² gross balcony area**. Its reception, kitchen and bedroom dimensions guide provisional scaling. The shell includes a tapered exterior wall, interior rooms, gaps for internal doors, floor-to-ceiling reception and bedroom glazing, pale timber flooring, cream bedroom carpet, and grey kitchen flooring. Balconies and outdoor scenery are not modelled. Ceiling height is **2.30 m from finished floor to ceiling, confirmed by the resident on 16 October 2026**. Wall thicknesses, window framing and door swings remain provisional.

**Desktop:** Open the published GitHub Pages URL. Plan view uses drag to pan and scroll to zoom. Use *Walk inside* for WASD movement; click the scene to enable mouse look, press Esc to unlock. *Reset position* returns to the corridor. Performance counters are displayed.

**Meta Quest 3:** Open the GitHub Pages URL in Meta Quest Browser and select *Enter VR*. Use the left controller thumbstick to move, or move naturally within your safe tracked play space. Walls/windows are collision boundaries for joystick movement. The VR headset must be used within Guardian/boundary safety limits. The balconies are deliberately blocked by glazing until modelled.

**To publish with GitHub Pages:** Repository → Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/(root)` → Save. When Pages is deployed, the expected address is https://kuke2013-hub.github.io/london-flat-vr/ .

**Testing state:** JavaScript syntax and source commits checked. Desktop browser execution and actual Quest 3 VR performance still require testing; this file does not claim that VR has been tested.

## Confirmed VR behaviour — preserve during all future edits

As of shell **v0.6**, the user has tested and confirmed that both Quest 3 joysticks work correctly. **Do not regress this:** the left joystick moves relative to the combined real headset orientation and right-stick snap-turn yaw, updating immediately after each 30° snap turn; its axes are standard (forward/up moves forward, back moves backward, left/right strafe). The right joystick performs 30° snap turns around the tracked head position. Do not replace the current v0.6 locomotion implementation with older movement handlers when modifying geometry, lighting or controls.

**Current virtual ceiling height: 2.00 metres (v0.11).** The original reported finished floor-to-ceiling height was 2.30 m. The virtual ceiling was reduced to 2.20 m (v0.9), 2.10 m (v0.10), then 2.00 m (v0.11). Ceiling/wall heights must derive from `PLAN.ceilingHeight`, but door heights are a separate property and must not shrink with the ceiling.

**VR viewer scale (v0.9 onward):** the 1.88 m reference viewer with 1.77 m nominal eye height felt too large in Quest VR, so the complete tracked viewer rig (headset and controllers) is uniformly scaled to **90%**, but the apartment remains at its true world scale. Effective eye level is approximately **1.59 m**. The vertical headset calibration offset must be multiplied by the same scale, and the rig scale must reset to 1 when leaving VR. **Preserve the user-confirmed v0.6 left-stick head-relative locomotion and right-stick 30° snap turns.**

**Wall and ceiling finish (v0.11):** internal/external wall faces, door headers and ceiling are pure white (`#ffffff`). Keep light-brown doors and the original floor finishes. The 90%-scale Quest rig and verified joystick heading/snap-turn behaviour must remain unchanged.

**Historical door sizing (v0.12, superseded by v0.13):** User supplied typical door sizes to replace the old 1.76 m provisional panels. In v0.12 the doors were modelled as **1,981 mm tall** (`PLAN.doorHeight = 1.981 m`), independently of the ceiling. The **flat entrance leaf is 838 mm wide and 44 mm thick** (`kind:'entrance'`); **bedroom and bathroom leaves are 762 mm wide and 35 mm thick** (`kind:'internal'`); the reception double opening holds **two separate 762 mm leaves** (total leaf width 1,524 mm). Door spans, wall openings, rendered panels and front-door collision geometry are coordinated with the dimensions in `PLAN.doorStandards`. The entrance 44 mm thickness reflects the supplied FD30S door specification, but this virtual model is **not fire-safety or accessibility certified**; frame thickness and wheelchair clear opening have not been verified. In that earlier version, with a **2.00 m virtual ceiling**, the 1.981 m leaf left only **19 mm above the leaf**; the user subsequently requested 1.831 m doors for visual proportions. This is a VR representation, not a construction-ready frame. Do not auto-shorten the doors with ceiling adjustments. Keep walls and ceiling pure white, the Quest viewer rig at 90%, and the confirmed left/right joysticks unmodified.

**Visual corrections (v0.13):** At user request, all door leaves are now **1.831 m (1831 mm) tall**, 15 cm shorter than in v0.12, independent of the unchanged 2.00 m ceiling. The white door headers extend from 1.831 m to 2.00 m (169 mm). Widths and thicknesses are unchanged: entrance 838 mm / 44 mm and internal leaves 762 mm / 35 mm. Door height 1831 mm is a **user-requested VR visual proportion**, not a statutory standard. The wall and ceiling materials remain `#ffffff`. Removed the blue-tinted `HemisphereLight` (`0xeaf5ff`) and blue-grey background (`#b6c7ce`), replacing them with neutral diffuse lighting and background to prevent pure-white wall surfaces appearing blue. Afternoon directional sun and shadows remain. Preserve the v0.6 joystick movement behaviour and 90% VR viewer scale.

**Current user-adjusted dimensions (v0.14):** Ceiling raised 10 cm from 2.00 m to **2.10 m**. All entrance/internal/reception door leaves shortened 10 cm from 1.831 m to **1.731 m** (1731 mm). The white solid door header spans 1.731–2.10 m, a **369 mm** gap. Door widths/thicknesses remain entrance 838/44 mm and internal 762/35 mm, including two 762 mm reception door leaves. These are visual choices, not verified physical dimensions or regulations. Keep neutral diffuse lighting, pure-white walls and ceiling, 90% Quest scale, left-stick headset/snap-relative locomotion and right-stick 30-degree snap turns unchanged.
