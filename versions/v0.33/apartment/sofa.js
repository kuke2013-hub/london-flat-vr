/**
 * Photo-referenced warm-grey three-seat sofa and soft rug, v0.31.
 * Procedural, true 3D (not a billboard), with no downloaded models or textures.
 * Approximate silhouette from resident's front/side/top sofa reference and flat photos.
 * All dimensions in metres; intentionally lightweight for Meta Quest rendering.
 */
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createSofa(THREE, { width=2.42, depth=1.00 } = {}) {
  if (!(width>2 && depth>.8)) throw new RangeError('Invalid sofa size');
  const sofa=new THREE.Group();
  sofa.name='Warm charcoal-grey three-seat sofa · photo referenced';
  sofa.userData={type:'sofa',source:'supplied orthographic and living-room photographs',widthM:width,depthM:depth};
  const geometryCache=new Map();
  function softMesh(name,w,h,d,r,material,x,y,z) {
    const radius=Math.min(r,w*.20,h*.46,d*.40);
    const key=[w,h,d,radius].map(v=>v.toFixed(4)).join('|');
    let geometry=geometryCache.get(key);
    if(!geometry){geometry=new RoundedBoxGeometry(w,h,d,3,radius);geometryCache.set(key,geometry);}
    const mesh=new THREE.Mesh(geometry,material);
    mesh.name=name;mesh.position.set(x,y,z);
    mesh.castShadow=true;mesh.receiveShadow=true;sofa.add(mesh);
    return mesh;
  }
  // A tiny woven colour variation, shared by all upholstered parts.
  // Using procedural texture instead of shipping large GLB or photographic textures.
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
  const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(256,256);
  let seed=1979;
  function random(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const i=(y*256+x)*4;
    const thread=((x%3===0)?5:0)+((y%4===0)?-5:0);
    const v=Math.max(175,Math.min(239,213+thread+(random()-.5)*26));
    pixels.data[i]=v;pixels.data[i+1]=Math.max(0,v-3);
    pixels.data[i+2]=Math.max(0,v-5);pixels.data[i+3]=255;
  }
  ctx.putImageData(pixels,0,0);
  const fabric=new THREE.CanvasTexture(canvas);
  fabric.colorSpace=THREE.SRGBColorSpace;
  fabric.wrapS=fabric.wrapT=THREE.RepeatWrapping;fabric.repeat.set(2,2);
  fabric.anisotropy=2;
  // The real sofa appears dark graphite in the room photos. Keep a little warmth,
  // but make neutral grey the dominant impression (no reddish brown).
  const upholstery=new THREE.MeshStandardMaterial({color:0x5a5551,map:fabric,roughness:.97,metalness:0});
  const seats=new THREE.MeshStandardMaterial({color:0x67615d,map:fabric,roughness:.96,metalness:0});
  const cushions=new THREE.MeshStandardMaterial({color:0x524e4b,map:fabric,roughness:.98,metalness:0});
  const seam=new THREE.MeshStandardMaterial({color:0x45403d,roughness:1});
  // Pure physically metallic material looked BLACK in this scene because there's
  // no reflective HDR environment. A silver diffuse component plus a restrained
  // emissive lift and a tiny untone-mapped glint makes chrome legible in Quest.
  const chrome=new THREE.MeshStandardMaterial({color:0xf5f5f7,metalness:.55,roughness:.13,
   emissive:0xa9adb2,emissiveIntensity:.38});
  const chromeGlint=new THREE.MeshBasicMaterial({color:0xeef2f6,toneMapped:false});
  const feetMetal=new THREE.MeshStandardMaterial({color:0xc4c5c7,metalness:.55,roughness:.24,
   emissive:0x6f7275,emissiveIntensity:.22});
  const innerWidth=width-.49;
  const halfSeat=innerWidth/2;
  // Low upholstered plinth under two generous individually shaped seat cushions.
  softMesh('Continuous low upholstered base',width-.14,.18,depth-.075,.045,upholstery,0,.225,.014);
  softMesh('Recessed black-brown underside',width-.19,.052,depth-.16,.023,seam,0,.132,0);
  // The real sofa is unusually deep, with round, thick armrests and a low back.
  softMesh('Low back structural cushion',innerWidth+.035,.41,.205,.058,upholstery,0,.565,-depth/2+.117);
  for(const side of [-1,1]){
    const x=side*(width/2-.131);
    softMesh(side<0?'Left rounded arm':'Right rounded arm',.262,.615,depth-.043,.093,upholstery,x,.470,.004);
    softMesh(side<0?'Left inner arm padding':'Right inner arm padding',.034,.39,depth-.27,.016,seats,x-side*.122,.470,.014);
  }
  // Two broad seat slabs and two softly puffed back cushions, from the supplied
  // orthographic views. The seams and small gap between the seats remain visible.
  for(const side of [-1,1]){
    const x=side*halfSeat/2;
    softMesh(side<0?'Left deep seat cushion':'Right deep seat cushion',
      halfSeat-.014,.183,depth-.297,.065,seats,x,.396,.114);
    const back=softMesh(side<0?'Left raised back':'Right raised back',
      halfSeat-.034,.334,.155,.050,upholstery,x,.582,-depth/2+.251);
    back.rotation.x=-.075;
  }
  // Exactly two loose warm-grey throw cushions, with slight natural asymmetry.
  for(const side of [-1,1]){
    const x=side*.49;
    const pillow=softMesh(side<0?'Loose cushion left':'Loose cushion right',
      .625,.296,.140,.055,cushions,x,.613,-.147);
    pillow.rotation.z=side*.050;
    pillow.rotation.y=-side*.055;
    // Discreet folds, suggested by curves rather than costly cloth simulation.
    const curves=[
      [[x-.24,.531,-.070],[x-.19,.550,-.065],[x-.13,.563,-.060]],
      [[x+.12,.555,-.065],[x+.21,.535,-.072],[x+.26,.523,-.070]]
    ];
    for(const points of curves){
      const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),7,.0028,4,false);
      const m=new THREE.Mesh(g,seam);m.name='Subtle pillow cloth crease';m.castShadow=false;sofa.add(m);
    }
  }
  // Tubular chrome furniture structure: slender legs plus the characteristic
  // U-shaped rails visible in the orthographic side reference.
  function rail(name,points,radius=.008){
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');
    const obj=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(12,points.length*8),radius,7,false),chrome);
    obj.name=name;obj.castShadow=true;obj.receiveShadow=true;sofa.add(obj);
    // Fine bright reflection line follows the OUTER face of each rail. Unlike
    // environment-map reflections this stays visible on the Meta Quest headset.
    const glintPts=points.map(p=>new THREE.Vector3(
      p[0]+Math.sign(p[0])*.0045,p[1]+.002,p[2]+.001));
    const glint=new THREE.Mesh(new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(glintPts,false,'centripetal'),
      Math.max(12,points.length*8),.0017,5,false),chromeGlint);
    glint.name=name+' · polished highlight';glint.castShadow=false;
    sofa.add(glint);
  }
  for(const side of [-1,1]){
    const x=side*(width/2+.015); // Chrome hoop remains visible OUTSIDE upholstery.
    rail(side<0?'Left chrome arm outline':'Right chrome arm outline',[
      [x,.110,-depth/2+.10],[x,.100,-depth/2+.060],
      [x,.52,-depth/2+.060],[x,.555,-depth/2+.030],
      [x,.562,depth/2-.095],[x,.535,depth/2-.056],
      [x,.145,depth/2-.056],[x,.100,depth/2-.092]
    ],.007);
    rail(side<0?'Left chrome middle crossbar':'Right chrome middle crossbar',[
      [x,.340,-depth/2+.055],[x,.342,depth/2-.059]
    ],.006);
    for(const z of [-depth/2+.10,depth/2-.10]){
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(.010,.012,.15,8),feetMetal);
      leg.position.set(side*(width/2-.078),.085,z);
      leg.castShadow=true;sofa.add(leg);
    }
  }
  for(const x of [-.025,.025]){
    const leg=new THREE.Mesh(new THREE.CylinderGeometry(.011,.011,.13,8),feetMetal);
    leg.position.set(x,.080,depth/2-.125);
    leg.castShadow=true;sofa.add(leg);
  }
  return sofa;
}


/**
 * Thick light greige woven rug, designed to project well forward of the sofa.
 * Its base and raised textile top are real geometry, not a decal on the floor.
 * Shared canvas texture gives a soft, irregular woven pile without hair meshes.
 */
export function createSofaRug(THREE, {width=2.55,depth=1.90,thicknessM=.048} = {}) {
  if(!(width>1.5&&depth>1&&thicknessM>=.025))
   throw new RangeError('Invalid rug dimensions');
  const rug=new THREE.Group();rug.name='Raised light greige woven living-room rug';
  rug.userData={type:'rug',widthM:width,depthM:depth,thicknessM};
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;
  const ctx=canvas.getContext('2d'),image=ctx.createImageData(256,256);
  let seed=27837;
  function rng(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
    const i=(y*256+x)*4;
    const weave=((x%4===0)?5:0)+((y%5===0)?-4:0);
    const noise=(rng()-.5)*23+weave;
    image.data[i]=Math.max(0,Math.min(255,220+noise));
    image.data[i+1]=Math.max(0,Math.min(255,214+noise));
    image.data[i+2]=Math.max(0,Math.min(255,205+noise));
    image.data[i+3]=255;
  }
  ctx.putImageData(image,0,0);
  // Short, irregular specks suggest loop-pile fibres at walking height.
  for(let i=0;i<9000;i++){
    const x=Math.floor(rng()*256),y=Math.floor(rng()*256);
    ctx.fillStyle=rng()>.5?'rgba(250,246,239,.19)':'rgba(112,106,100,.095)';
    ctx.fillRect(x,y,1+rng()*2,1);
  }
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(width*1.1,depth*1.1);texture.anisotropy=2;
  const bodyMat=new THREE.MeshStandardMaterial({color:0xc5bdb2,roughness:1});
  const pileMat=new THREE.MeshStandardMaterial({color:0xe4dfd8,map:texture,roughness:1,metalness:0});
  const bodyHeight=thicknessM*.75,pileHeight=thicknessM*.46;
  const body=new THREE.Mesh(new RoundedBoxGeometry(width,bodyHeight,depth,3,.014),bodyMat);
  body.name='Thick woven carpet bound edge';
  body.position.y=bodyHeight/2;body.castShadow=true;body.receiveShadow=true;rug.add(body);
  const pile=new THREE.Mesh(new RoundedBoxGeometry(width-.024,pileHeight,depth-.024,3,.009),pileMat);
  pile.name='Light raised soft woven top';
  pile.position.y=thicknessM-pileHeight/2;
  pile.castShadow=true;pile.receiveShadow=true;rug.add(pile);
  return rug;
}
