import assert from 'node:assert/strict';
import {activeStick,deadzone,planarForward,rotateXZ,movement,moveWithinRoom,snapTurn,headWorld,updateSnapLatch,BOUNDS} from './locomotion.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
assert.deepEqual(activeStick({axes:[0,0,.4,-.8]}),{x:.4,y:-.8});assert.deepEqual(activeStick({axes:[.3,-.5,0,0]}),{x:.3,y:-.5});assert.deepEqual(activeStick({axes:[]}),{x:0,y:0});
assert.deepEqual(deadzone({x:.05,y:.05}),{x:0,y:0});
let f=planarForward({x:0,y:0,z:0,w:1},0);near(f.x,0);near(f.z,-1);
let d=movement({x:0,y:-1},f,1,.05);near(d.x,0);near(d.z,-.05);
d=movement({x:1,y:0},f,1,.05);near(d.x,.05);near(d.z,0);
d=movement({x:0,y:1},f,1,.05);near(d.z,.05);
const diagonal=movement({x:1,y:-1},f,1,.05);near(Math.hypot(diagonal.x,diagonal.z),.05);
f=planarForward({x:0,y:Math.sin(Math.PI/4),z:0,w:Math.cos(Math.PI/4)},0);near(f.x,-1);near(f.z,0);
const rig={x:.2,z:-2,yaw:.3},head={x:.6,z:-.3};const turned=snapTurn(rig,1,head);const before=headWorld(rig,head),after=headWorld(turned,head);near(before.x,after.x);near(before.z,after.z);near(turned.yaw,rig.yaw-Math.PI/6);
f=planarForward({x:0,y:0,z:0,w:1},-Math.PI/2);d=movement({x:0,y:-1},f,1,.05);near(d.x,.05);near(d.z,0);
let latch=updateSnapLatch(.9,true);assert.equal(latch.direction,1);latch=updateSnapLatch(.9,latch.ready);assert.equal(latch.direction,0);latch=updateSnapLatch(0,latch.ready);assert.equal(latch.ready,true);assert.equal(updateSnapLatch(-.9,latch.ready).direction,-1);
for(const [x,z] of [[100,0],[-100,0],[0,100],[0,-100]]){const moved=moveWithinRoom(rig,head,{x,z});const h=headWorld(moved,head);assert.ok(h.x>=BOUNDS.minX-1e-9&&h.x<=BOUNDS.maxX+1e-9&&h.z>=BOUNDS.minZ-1e-9&&h.z<=BOUNDS.maxZ+1e-9);}
console.log('PASS: Quest mappings, movement directions, diagonal speed, head-relative movement, snap pivot, latch and wall bounds.');
