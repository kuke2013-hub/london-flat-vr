export const BOUNDS = Object.freeze({minX:-2.67,maxX:2.67,minZ:-5.65,maxZ:.05});
export const SPAWN = Object.freeze({x:.45,z:-1.1,yaw:-.18});
export function activeStick(gamepad){
 const a=gamepad?.axes||[];
 const pair=(i)=>Number.isFinite(a[i])&&Number.isFinite(a[i+1])?{x:a[i],y:a[i+1]}:null;
 const primary=pair(2),fallback=pair(0);
 if(primary&&Math.hypot(primary.x,primary.y)>.12)return primary;
 if(fallback&&Math.hypot(fallback.x,fallback.y)>.12)return fallback;
 return primary||fallback||{x:0,y:0};
}
export function deadzone(stick,dead=.16){
 const length=Math.hypot(stick.x,stick.y);if(length<=dead)return{x:0,y:0};
 const gain=(Math.min(1,length)-dead)/(1-dead)/length;
 return{x:stick.x*gain,y:stick.y*gain};
}
export function rotateXZ(x,z,yaw){return{x:x*Math.cos(yaw)+z*Math.sin(yaw),z:-x*Math.sin(yaw)+z*Math.cos(yaw)};}
export function headWorld(rig,head){const p=rotateXZ(head.x,head.z,rig.yaw);return{x:rig.x+p.x,z:rig.z+p.z};}
export function snapTurn(rig,direction,head,angle=Math.PI/6){
 const before=headWorld(rig,head);const result={...rig,yaw:rig.yaw-direction*angle};const after=headWorld(result,head);
 result.x+=before.x-after.x;result.z+=before.z-after.z;return result;
}
export function planarForward(q,rigYaw,fallback={x:0,z:-1}){
 let x=-2*(q.x*q.z+q.y*q.w),z=-(1-2*(q.x*q.x+q.y*q.y));const len=Math.hypot(x,z);
 if(len<.001)return fallback;
 return rotateXZ(x/len,z/len,rigYaw);
}
export function movement(stick,forward,speed,dt){
 const axis=deadzone(stick),distance=speed*Math.min(.05,Math.max(0,dt));
 return{x:(-axis.y*forward.x-axis.x*forward.z)*distance,z:(-axis.y*forward.z+axis.x*forward.x)*distance};
}
export function moveWithinRoom(rig,head,delta,bounds=BOUNDS){
 const pos=headWorld(rig,head);
 return{...rig,x:rig.x+Math.min(bounds.maxX,Math.max(bounds.minX,pos.x+delta.x))-pos.x,z:rig.z+Math.min(bounds.maxZ,Math.max(bounds.minZ,pos.z+delta.z))-pos.z};
}
export function updateSnapLatch(axis,ready){
 if(Math.abs(axis)<.30)return{ready:true,direction:0};
 if(ready&&Math.abs(axis)>.70)return{ready:false,direction:Math.sign(axis)};
 return{ready,direction:0};
}
