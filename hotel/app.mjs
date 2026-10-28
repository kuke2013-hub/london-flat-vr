import * as THREE from 'three';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {DRACOLoader} from './vendor/DRACOLoader.js';
import {SPAWN,activeStick,deadzone,planarForward,rotateXZ,movement,moveWithinRoom,snapTurn,updateSnapLatch} from './locomotion.mjs';
const $=id=>document.getElementById(id),keys=new Set();
const status=text=>{$('loading').textContent=text;};
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}catch(error){status('This browser could not start 3D graphics. Please enable WebGL and reload.');throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
renderer.xr.enabled=true;renderer.xr.setReferenceSpaceType('local-floor');renderer.xr.setFramebufferScaleFactor(1);
$('stage').appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color('#55564b');scene.fog=new THREE.FogExp2('#b4b5a5',.016);
const rig=new THREE.Group();rig.name='Player • real-world metres';scene.add(rig);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.035,45);rig.add(camera);camera.position.set(0,1.65,0);
let player={...SPAWN},pitch=0,loaded=false,xrSupported=false,desktop=false,snapReady=true,resetReady=true,alignXR=false;
let lastForward={x:0,z:-1},lastHead={x:0,y:0,z:0},lastOrientation={x:0,y:0,z:0,w:1};
function applyRig(){rig.position.set(player.x,0,player.z);rig.rotation.set(0,player.yaw,0);rig.scale.setScalar(1);rig.updateMatrixWorld(true);}
applyRig();
const manager=new THREE.LoadingManager();manager.onProgress=(url,done,total)=>status(loaded?'Ready · life-size room':`Loading room assets · ${done} / ${total}`);
manager.onError=url=>status('An asset could not load. Please reload the page to retry.');
const draco=new DRACOLoader(manager);draco.setDecoderPath('./vendor/draco/');draco.setWorkerLimit(2);
const loader=new GLTFLoader(manager).setDRACOLoader(draco);
loader.load('./assets/hotel.gltf',gltf=>{
 const room=gltf.scene;room.name='Hotel · 4 m ceiling';
 room.traverse(obj=>{if(obj.isMesh){obj.frustumCulled=true;const list=Array.isArray(obj.material)?obj.material:[obj.material];for(const ma of list){ma.toneMapped=false;if(ma.map){ma.map.colorSpace=THREE.SRGBColorSpace;ma.map.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());}}}});
 scene.add(room);loaded=true;$('explore').disabled=false;refreshVRButton();status('Ready · life-size room');draco.dispose();
 window.hotelDebug.ready=true;window.hotelDebug.meshCount=0;room.traverse(o=>{if(o.isMesh)window.hotelDebug.meshCount++;});
},undefined,error=>{console.error(error);status('The room could not load. Check your connection and reload.');});
function refreshVRButton(){const b=$('enter-vr');b.disabled=!loaded||!xrSupported;b.textContent=xrSupported?'Enter VR':'Open in Quest Browser for VR';}
if(navigator.xr&&isSecureContext){navigator.xr.isSessionSupported('immersive-vr').then(ok=>{xrSupported=ok;refreshVRButton();}).catch(()=>{xrSupported=false;refreshVRButton();});}else refreshVRButton();
$('enter-vr').addEventListener('click',async()=>{
 if(!loaded||!xrSupported)return;const b=$('enter-vr');b.disabled=true;
 try{if(document.pointerLockElement)document.exitPointerLock();const session=await navigator.xr.requestSession('immersive-vr',{requiredFeatures:['local-floor']});await renderer.xr.setSession(session);}catch(error){console.error(error);status('VR could not start. Allow immersive access in Quest Browser and try again.');refreshVRButton();}
});
function showMenu(){document.exitPointerLock?.();$('welcome').hidden=false;$('hint').hidden=true;}
$('menu').addEventListener('click',showMenu);
$('explore').addEventListener('click',()=>{desktop=true;$('welcome').hidden=true;$('toolbar').hidden=false;$('hint').hidden=false;$('touch').hidden=!matchMedia('(pointer:coarse)').matches;});
function resetPosition(){
 player={...SPAWN};pitch=0;
 if(renderer.xr.isPresenting){const headYaw=Math.atan2(-planarForward(lastOrientation,0).x,-planarForward(lastOrientation,0).z);player.yaw=SPAWN.yaw-headYaw;const off=rotateXZ(lastHead.x,lastHead.z,player.yaw);player.x-=off.x;player.z-=off.z;}
 else camera.rotation.set(0,0,0);
 applyRig();
}
$('reset').addEventListener('click',resetPosition);$('haze').addEventListener('change',()=>{scene.fog=$('haze').checked?new THREE.FogExp2('#b4b5a5',.016):null;});
renderer.domElement.addEventListener('click',()=>{if(desktop&&!renderer.xr.isPresenting&&!matchMedia('(pointer:coarse)').matches)renderer.domElement.requestPointerLock?.();});
document.addEventListener('mousemove',e=>{if(document.pointerLockElement!==renderer.domElement||renderer.xr.isPresenting)return;player.yaw-=e.movementX*.002;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.002,-1.4,1.4);camera.rotation.x=pitch;applyRig();});
let touchLook=null;
renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&desktop){touchLook={id:e.pointerId,x:e.clientX,y:e.clientY};renderer.domElement.setPointerCapture(e.pointerId);}});
renderer.domElement.addEventListener('pointermove',e=>{if(touchLook?.id!==e.pointerId)return;player.yaw-=(e.clientX-touchLook.x)*.004;pitch=THREE.MathUtils.clamp(pitch-(e.clientY-touchLook.y)*.004,-1.4,1.4);touchLook={id:e.pointerId,x:e.clientX,y:e.clientY};camera.rotation.x=pitch;applyRig();});
for(const event of ['pointerup','pointercancel'])renderer.domElement.addEventListener(event,()=>touchLook=null);
for(const button of document.querySelectorAll('[data-move]')){button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(button.dataset.move);});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(button.dataset.move));}
window.addEventListener('keydown',e=>{if(e.target.matches('select,input,button')||!$('welcome').hidden)return;keys.add(e.code);if(e.code.startsWith('Arrow')||e.code==='Space')e.preventDefault();});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>keys.clear());
for(let i=0;i<2;i++){
 const grip=renderer.xr.getControllerGrip(i);rig.add(grip);
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(.018,10,8),new THREE.MeshBasicMaterial({color:0xd5d9bf}));grip.add(sphere);
}
renderer.xr.addEventListener('sessionstart',()=>{keys.clear();document.body.classList.add('xr');camera.position.set(0,0,0);camera.rotation.set(0,0,0);alignXR=true;snapReady=true;resetReady=true;renderer.xr.setFoveation(1);});
renderer.xr.addEventListener('sessionend',()=>{document.body.classList.remove('xr');camera.position.set(0,1.65,0);camera.rotation.set(pitch,0,0);keys.clear();refreshVRButton();showMenu();});
function stepVR(dt,frame){
 const session=renderer.xr.getSession(),space=renderer.xr.getReferenceSpace();const pose=frame&&space?frame.getViewerPose(space):null;if(!pose)return;
 lastHead=pose.transform.position;lastOrientation=pose.transform.orientation;
 if(alignXR){resetPosition();alignXR=false;}
 let left={x:0,y:0},right={x:0,y:0},resetPressed=false;
 for(const source of session.inputSources){if(!source.gamepad)continue;if(source.handedness==='left'){left=activeStick(source.gamepad);resetPressed=!!source.gamepad.buttons[4]?.pressed;}if(source.handedness==='right')right=activeStick(source.gamepad);}
 const snap=updateSnapLatch(right.x,snapReady);snapReady=snap.ready;if(snap.direction)player=snapTurn(player,snap.direction,lastHead);
 if(resetPressed&&resetReady)resetPosition();resetReady=!resetPressed;
 lastForward=planarForward(lastOrientation,player.yaw,lastForward);
 const delta=movement(left,lastForward,Number($('speed').value),dt);
 if(delta.x||delta.z)player=moveWithinRoom(player,lastHead,delta);
 applyRig();
}
function stepDesktop(dt){
 if(!desktop||!$('welcome').hidden)return;
 const turn=Number(keys.has('KeyQ')||keys.has('ArrowLeft'))-Number(keys.has('KeyE')||keys.has('ArrowRight'));player.yaw+=turn*dt*1.35;
 const stick={x:Number(keys.has('KeyD'))-Number(keys.has('KeyA')),y:Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'))};
 const f=rotateXZ(0,-1,player.yaw),delta=movement(stick,f,Number($('speed').value),dt);if(delta.x||delta.z)player=moveWithinRoom(player,{x:0,z:0},delta);applyRig();
}
window.hotelDebug={ready:false,version:'1.0.0',ceilingHeight:4,roomWidth:6,roomDepth:6.4,getState:()=>({...player,eyeHeight:renderer.xr.isPresenting?lastHead.y:camera.position.y,xr:renderer.xr.isPresenting,triangles:renderer.info.render.triangles,drawCalls:renderer.info.render.calls,textures:renderer.info.memory.textures})};
let previous=performance.now(),elapsed=0,frames=0;
renderer.setAnimationLoop((now,frame)=>{const dt=Math.min(.05,Math.max(0,(now-previous)/1000));previous=now;if(loaded){if(renderer.xr.isPresenting)stepVR(dt,frame);else stepDesktop(dt);}renderer.render(scene,camera);elapsed+=dt;frames++;if(elapsed>.8){$('stats').textContent=`${Math.round(frames/elapsed)} fps · ${renderer.info.render.triangles.toLocaleString()} triangles`;elapsed=0;frames=0;}});
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();status('Graphics paused. Reload this page to restart the room.');showMenu();});
