# The Quiet Room — baked Blender WebXR experience

A separate hotel scene at `/hotel/`. The London flat at the repository root is unchanged.

## Open in Quest

Visit https://kuke2013-hub.github.io/london-flat-vr/hotel/ in Meta Quest Browser and select **Enter VR**. Immersive mode needs HTTPS and the browser's VR permission.

- Left stick: headset-relative forward/back and strafe left/right.
- Right stick: 30-degree snap turn, latched until the stick is released. Rotation pivots around the current tracked head position.
- Headset: normal 6DoF tracking, real local-floor eye height, unit player scale.
- X on the left controller: return to the starting position.
- Walking speed can be selected before entering VR.

Desktop: **Explore on screen**, click to capture the mouse, WASD to move, Q/E or arrow keys to turn, Esc to release. Touch: drag the scene to look and use the movement buttons.

## Scale and assets

One world unit is one metre. Interior footprint is approximately 6 × 6.4 m. The original Blender geometry was rescaled vertically to put the main ceiling underside at 4 m. Floor level is 0. The player rig stays at scale 1, with actual headset eye height; desktop eye height is 1.65 m.

The original camera-side opening is closed with a plaster wall so visitors can turn around. Joystick movement is constrained to the room interior, including the tracked head offset. Physical room-scale movement remains headset-controlled.

Six meshes / about 98,628 triangles. The Draco-compressed model and four JPEG atlases total about 2.6 MB. Three.js 0.186.1 and its Draco decoder are bundled locally. Three atlases are 2048² and the ceiling atlas is 1024², approximately 69 MiB of RGBA texture memory including mipmaps (driver allocation can vary).

Baked textures are sRGB display colors and use KHR_materials_unlit / no additional tone mapping. Mild distance fog is a lightweight approximation of the original room haze. Wet reflections are baked and remain fixed rather than responding to head movement.

## Validation

- `node locomotion.test.mjs`: stick mappings and fallback, deadzone, forward/back/strafe directions, normalized diagonal speed, composed headset/rig heading, tracked-head snap pivot, snap latch and collision boundaries.
- Desktop browser: model and textures loaded, movement and turning exercised, no current JavaScript errors, approximately 60 fps on the development Mac.
- Actual Quest stereo rendering, comfort and frame rate still need on-headset verification. Desktop results do not guarantee headset performance.

No changes to the existing flat scene or its controls.
