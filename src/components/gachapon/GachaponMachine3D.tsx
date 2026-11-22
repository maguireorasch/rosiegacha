import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gachaponAudio } from '../../lib/gachaponAudio';
import type { CapsuleColor, GachaponPhase } from '../../types/gachapon';

interface GachaponMachine3DProps {
  phase: GachaponPhase;
  spinSignal: number;
  dispensedColor: CapsuleColor | null;
  hasDispensedInTray: boolean;
  remainingCount: number;
  onPhaseChange: (next: GachaponPhase) => void;
  onRequestSpin: () => void;
  onTrayCapsuleClick: () => void;
}

interface DomeCapsule {
  group: THREE.Group;
  color: CapsuleColor;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  radius: number;
}

const CAPSULE_COLORS: CapsuleColor[] = ['pink', 'yellow', 'blue', 'purple', 'white'];

function createMarqueePlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 512, 160);
    grad.addColorStop(0, '#FFF6FA');
    grad.addColorStop(0.5, '#FFFFFF');
    grad.addColorStop(1, '#FFE8F1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 160);

    ctx.strokeStyle = '#C2336C';
    ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, 496, 144);

    ctx.strokeStyle = '#FAD4E4';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 472, 120);

    ctx.fillStyle = '#B53B6D';
    ctx.font = 'bold 34px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("ROSIE'S HAPPY CAPSULES", 256, 66);

    ctx.fillStyle = '#D95F90';
    ctx.font = '600 21px Quicksand, sans-serif';
    ctx.fillText('♡  TURN HANDLE FOR A LITTLE REMINDER  ♡', 256, 112);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const _tmpVec = new THREE.Vector3();
const _deltaVec = new THREE.Vector3();

export const GachaponMachine3D: React.FC<GachaponMachine3DProps> = ({
  phase,
  spinSignal,
  dispensedColor,
  hasDispensedInTray,
  remainingCount,
  onPhaseChange,
  onRequestSpin,
  onTrayCapsuleClick,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const lastSpinSignalRef = useRef<number>(spinSignal);

  const phaseRef = useRef<GachaponPhase>(phase);
  const dispensedColorRef = useRef<CapsuleColor | null>(dispensedColor);
  const hasTrayRef = useRef<boolean>(hasDispensedInTray);
  const remainingCountRef = useRef<number>(remainingCount);
  const onPhaseRef = useRef(onPhaseChange);
  const onRequestSpinRef = useRef(onRequestSpin);
  const onTrayClickRef = useRef(onTrayCapsuleClick);

  phaseRef.current = phase;
  dispensedColorRef.current = dispensedColor;
  hasTrayRef.current = hasDispensedInTray;
  remainingCountRef.current = remainingCount;
  onPhaseRef.current = onPhaseChange;
  onRequestSpinRef.current = onRequestSpin;
  onTrayClickRef.current = onTrayCapsuleClick;

  const startSpinSequenceRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (spinSignal !== lastSpinSignalRef.current) {
      lastSpinSignalRef.current = spinSignal;
      startSpinSequenceRef.current?.();
    }
  }, [spinSignal]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 40);
    camera.position.set(0, 0.55, 6.7);
    camera.lookAt(0, 0.18, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Crisp Studio Three-Point Lighting with rich saturation
    const hemiLight = new THREE.HemisphereLight(0xfff4f8, 0x7a2448, 0.92);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf6, 1.28);
    keyLight.position.set(3.2, 5.8, 5.2);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffd6e7, 0.85);
    rimLight.position.set(-3.8, 3.0, -3.5);
    scene.add(rimLight);

    const traySpotLight = new THREE.PointLight(0xffe8a3, 0, 2.5);
    traySpotLight.position.set(0, -0.78, 1.65);
    scene.add(traySpotLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };

    // Rich, High-Contrast Glossy Pink & Berry Trim Materials
    const pinkBodyMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xe85a93,
        roughness: 0.2,
        metalness: 0.04,
        clearcoat: 0.92,
        clearcoatRoughness: 0.14,
      })
    );
    const pinkTrimMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xc2336c,
        roughness: 0.22,
        metalness: 0.06,
        clearcoat: 0.85,
      })
    );
    const creamMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfff8fb,
        roughness: 0.24,
        metalness: 0.04,
      })
    );
    const roseGoldMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf5cfd8,
        roughness: 0.16,
        metalness: 0.88,
      })
    );
    const chromeMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf6f8fc,
        roughness: 0.12,
        metalness: 0.92,
      })
    );
    const darkInteriorMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x4e1b33,
        roughness: 0.65,
      })
    );
    const glassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.04,
        metalness: 0.02,
        transparent: true,
        opacity: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        depthWrite: false,
      })
    );

    const machine = new THREE.Group();
    scene.add(machine);

    // Soft Ground Shadow Disc
    const shadowDisc = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(1.52, 40)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: 0x843b5d,
          transparent: true,
          opacity: 0.2,
          depthWrite: false,
        })
      )
    );
    shadowDisc.rotation.x = -Math.PI / 2;
    shadowDisc.position.set(0, -1.58, 0);
    machine.add(shadowDisc);

    // Pedestal Foot Base
    const pedestal = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.14, 1.28, 0.26, 40)),
      pinkTrimMat
    );
    pedestal.position.set(0, -1.44, 0);
    machine.add(pedestal);

    const pedestalRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.16, 0.035, 14, 44)),
      creamMat
    );
    pedestalRing.rotation.x = Math.PI / 2;
    pedestalRing.position.set(0, -1.31, 0);
    machine.add(pedestalRing);

    // Main Lower Cabinet Cylinder
    const lowerBody = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.06, 1.13, 1.62, 40)),
      pinkBodyMat
    );
    lowerBody.position.set(0, -0.5, 0);
    machine.add(lowerBody);

    // Decorative Waist Band Between Dome & Cabinet
    const waistCollar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.16, 1.12, 0.22, 40)),
      pinkTrimMat
    );
    waistCollar.position.set(0, 0.36, 0);
    machine.add(waistCollar);

    const waistCreamTrim = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.15, 0.04, 14, 44)),
      creamMat
    );
    waistCreamTrim.rotation.x = Math.PI / 2;
    waistCreamTrim.position.set(0, 0.47, 0);
    machine.add(waistCreamTrim);

    // Cute Heart & Star Charms on the Collar
    const starGeo = trackGeo(new THREE.OctahedronGeometry(0.065, 0));
    const charmMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfce07a,
        emissive: 0xfce07a,
        emissiveIntensity: 0.28,
        roughness: 0.2,
      })
    );
    [-0.78, -0.4, 0.4, 0.78].forEach((cx) => {
      const cz = Math.sqrt(Math.max(0.05, 1.18 * 1.18 - cx * cx));
      const star = new THREE.Mesh(starGeo, charmMat);
      star.position.set(cx, 0.36, cz);
      machine.add(star);
    });

    // High-Contrast Deep Berry-Plum Chamber Floor & Curved Rear Shell
    const domeFloor = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.04, 1.04, 0.08, 36)),
      trackMat(new THREE.MeshStandardMaterial({ color: 0x61203d, roughness: 0.52 }))
    );
    domeFloor.position.set(0, 0.47, 0);
    machine.add(domeFloor);

    const domeBackWall = new THREE.Mesh(
      trackGeo(
        new THREE.CylinderGeometry(
          1.08,
          1.08,
          0.9,
          32,
          1,
          true,
          Math.PI * 0.62,
          Math.PI * 0.76
        )
      ),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x541b35,
          roughness: 0.55,
          side: THREE.DoubleSide,
        })
      )
    );
    domeBackWall.position.set(0, 0.93, 0);
    machine.add(domeBackWall);

    // Front Sign Plate: "ROSIE'S HAPPY CAPSULES"
    const marqueeTex = createMarqueePlaqueTexture();
    textures.push(marqueeTex);
    const marqueeBoard = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(1.42, 0.42, 0.07)),
      creamMat
    );
    marqueeBoard.position.set(0, 0.08, 1.07);
    machine.add(marqueeBoard);

    const marqueeFace = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(1.36, 0.36)),
      trackMat(
        new THREE.MeshStandardMaterial({
          map: marqueeTex,
          roughness: 0.25,
          emissive: 0xffffff,
          emissiveMap: marqueeTex,
          emissiveIntensity: 0.12,
        })
      )
    );
    marqueeFace.position.set(0, 0.08, 1.11);
    machine.add(marqueeFace);

    // Coin Slot Plate (Front-Left)
    const coinBezel = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 24)),
      roseGoldMat
    );
    coinBezel.rotation.x = Math.PI / 2;
    coinBezel.position.set(-0.56, -0.34, 1.03);
    machine.add(coinBezel);

    const coinSlot = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.028, 0.12, 0.03)),
      darkInteriorMat
    );
    coinSlot.position.set(-0.56, -0.34, 1.06);
    machine.add(coinSlot);

    // ================= INTERACTIVE MECHANICAL TURNING CRANK HANDLE =================
    const crankMount = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.26, 0.29, 0.08, 32)),
      chromeMat
    );
    crankMount.rotation.x = Math.PI / 2;
    crankMount.position.set(0.42, -0.36, 1.02);
    machine.add(crankMount);

    const crankBezelRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.25, 0.028, 14, 32)),
      pinkTrimMat
    );
    crankBezelRing.position.set(0.42, -0.36, 1.06);
    machine.add(crankBezelRing);

    const crankPivot = new THREE.Group();
    crankPivot.position.set(0.42, -0.36, 1.09);
    machine.add(crankPivot);

    const crankHub = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.11, 24)),
      roseGoldMat
    );
    crankHub.rotation.x = Math.PI / 2;
    crankPivot.add(crankHub);

    // Long Tactile Turning Bar (Horizontal across center, spins 360°)
    const crankBar = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.46, 0.095, 0.095)),
      pinkTrimMat
    );
    crankBar.position.set(0, 0, 0.07);
    crankPivot.add(crankBar);

    const crankEndKnobL = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.068, 18, 18)),
      creamMat
    );
    crankEndKnobL.position.set(-0.23, 0, 0.07);
    crankPivot.add(crankEndKnobL);

    const crankEndKnobR = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.068, 18, 18)),
      creamMat
    );
    crankEndKnobR.position.set(0.23, 0, 0.07);
    crankPivot.add(crankEndKnobR);

    // Invisible generous hit sphere for easy mouse/touch handle turning
    const handleHitMesh = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.36, 16, 16)),
      trackMat(new THREE.MeshBasicMaterial({ visible: false }))
    );
    handleHitMesh.userData.hitRole = 'handle';
    crankPivot.add(handleHitMesh);

    // ================= LOWER CAPSULE DISPENSING CHUTE & TRAY =================
    const chuteFrame = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.68, 0.56, 0.12)),
      creamMat
    );
    chuteFrame.position.set(-0.14, -0.96, 1.06);
    machine.add(chuteFrame);

    const chuteRecess = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.54, 0.44, 0.24)),
      darkInteriorMat
    );
    chuteRecess.position.set(-0.14, -0.96, 1.02);
    machine.add(chuteRecess);

    // Clear Swinging Chute Flap
    const chuteFlapPivot = new THREE.Group();
    chuteFlapPivot.position.set(-0.14, -0.76, 1.11);
    machine.add(chuteFlapPivot);

    const chuteFlap = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.5, 0.36, 0.025)),
      glassMat
    );
    chuteFlap.position.set(0, -0.18, 0);
    chuteFlapPivot.add(chuteFlap);

    // Protruding Pastel-Pink Collection Tray Cup
    const trayLip = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.74, 0.14, 0.36)),
      pinkTrimMat
    );
    trayLip.position.set(-0.14, -1.24, 1.18);
    machine.add(trayLip);

    const trayRimFront = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.74, 0.16, 0.06)),
      pinkBodyMat
    );
    trayRimFront.position.set(-0.14, -1.16, 1.35);
    machine.add(trayRimFront);

    // ================= TRANSPARENT ACRYLIC GLASS DOME & CROWN LID =================
    const glassCylinder = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.12, 1.12, 0.88, 40, 1, true)),
      glassMat
    );
    glassCylinder.position.set(0, 0.92, 0);
    glassCylinder.renderOrder = 6;
    machine.add(glassCylinder);

    const glassTopDome = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(1.12, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2)),
      glassMat
    );
    glassTopDome.position.set(0, 1.36, 0);
    glassTopDome.renderOrder = 6;
    machine.add(glassTopDome);

    // Pink Crown Lid on Top of Dome
    const crownLid = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.86, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.34)),
      pinkBodyMat
    );
    crownLid.position.set(0, 1.62, 0);
    machine.add(crownLid);

    const crownRim = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.74, 0.045, 14, 40)),
      creamMat
    );
    crownRim.rotation.x = Math.PI / 2;
    crownRim.position.set(0, 2.02, 0);
    machine.add(crownRim);

    const crownKnob = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.14, 24, 24)),
      pinkTrimMat
    );
    crownKnob.position.set(0, 2.54, 0);
    machine.add(crownKnob);

    // ================= 38 VIVID HIGH-CONTRAST CAPSULE BALLS INSIDE DOME =================
    const capsuleRadius = 0.185;
    const upperCapGeo = trackGeo(
      new THREE.SphereGeometry(capsuleRadius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    );
    const lowerCapGeo = trackGeo(
      new THREE.SphereGeometry(capsuleRadius, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)
    );
    const seamRingGeo = trackGeo(new THREE.TorusGeometry(capsuleRadius, 0.016, 10, 26));

    const frostedBottomMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xfff5f9,
        roughness: 0.2,
        metalness: 0.02,
        clearcoat: 0.85,
      })
    );

    const capsuleMaterials: Record<CapsuleColor, THREE.MeshPhysicalMaterial> = {
      pink: trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xf74d94,
          roughness: 0.14,
          clearcoat: 1.0,
          emissive: 0xf74d94,
          emissiveIntensity: 0.08,
        })
      ),
      yellow: trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xf7c325,
          roughness: 0.14,
          clearcoat: 1.0,
          emissive: 0xf7c325,
          emissiveIntensity: 0.08,
        })
      ),
      blue: trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0x2b95e8,
          roughness: 0.14,
          clearcoat: 1.0,
          emissive: 0x2b95e8,
          emissiveIntensity: 0.08,
        })
      ),
      purple: trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0x8c56f5,
          roughness: 0.14,
          clearcoat: 1.0,
          emissive: 0x8c56f5,
          emissiveIntensity: 0.08,
        })
      ),
      white: trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.14,
          clearcoat: 1.0,
          emissive: 0xfff4f8,
          emissiveIntensity: 0.12,
        })
      ),
    };

    const createCapsule = (color: CapsuleColor, startPos: THREE.Vector3): THREE.Group => {
      const g = new THREE.Group();
      const top = new THREE.Mesh(upperCapGeo, capsuleMaterials[color]);
      const bottom = new THREE.Mesh(
        lowerCapGeo,
        color === 'white' ? pinkBodyMat : frostedBottomMat
      );
      const seam = new THREE.Mesh(
        seamRingGeo,
        color === 'white' ? pinkTrimMat : creamMat
      );
      seam.rotation.x = Math.PI / 2;
      g.add(top, bottom, seam);
      g.position.copy(startPos);
      g.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      machine.add(g);
      return g;
    };

    const domeCapsules: DomeCapsule[] = [];
    const spawnDomeCapsules = (count: number) => {
      for (let i = 0; i < count; i++) {
        const cColor = CAPSULE_COLORS[i % CAPSULE_COLORS.length];
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 0.72;
        const startPos = new THREE.Vector3(
          Math.cos(angle) * dist,
          0.72 + Math.floor(i / 10) * 0.34 + Math.random() * 0.12,
          Math.sin(angle) * dist
        );
        const group = createCapsule(cColor, startPos);
        domeCapsules.push({
          group,
          color: cColor,
          pos: startPos,
          vel: new THREE.Vector3(0, 0, 0),
          radius: capsuleRadius,
        });
      }
    };
    spawnDomeCapsules(Math.max(0, Math.min(50, remainingCountRef.current)));

    // Tray Capsule Group (Dispensed Winner)
    let trayCapsule: THREE.Group | null = null;
    let trayCapsuleHitMesh: THREE.Mesh | null = null;
    let trayRollProgress = 1;
    let trayIdleRock = 0;
    let flapOpenAngle = 0;

    // Crank & Bounce Animation State
    let crankAngle = 0;
    let targetCrankAngle = 0;
    let spinAnimTimer = 0;
    let bounceBurstDone = false;
    let ambientTimer = 0;

    startSpinSequenceRef.current = () => {
      if (phaseRef.current !== 'idle' && phaseRef.current !== 'ready') return;
      gachaponAudio.playHandleRotate();
      targetCrankAngle = crankAngle + Math.PI * 2;
      spinAnimTimer = 0;
      bounceBurstDone = false;
      onPhaseRef.current('cranking');
    };

    // ================= RAYCAST INTERACTION (DRAG HANDLE + CLICK TRAY CAPSULE) =================
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let draggingHandle = false;
    let prevDragAngle = 0;
    let dragAccumulated = 0;

    const getHandleScreenCenter = () => {
      const worldPos = new THREE.Vector3();
      crankPivot.getWorldPosition(worldPos);
      worldPos.project(camera);
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: rect.left + (worldPos.x * 0.5 + 0.5) * rect.width,
        y: rect.top + (-worldPos.y * 0.5 + 0.5) * rect.height,
      };
    };

    const updateNdc = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      updateNdc(e);
      raycaster.setFromCamera(pointerNdc, camera);

      const targets: THREE.Object3D[] = [handleHitMesh];
      if (trayCapsuleHitMesh) targets.push(trayCapsuleHitMesh);

      const hits = raycaster.intersectObjects(targets, false);
      if (hits.length === 0) return;

      const role = hits[0].object.userData.hitRole as string | undefined;
      if (role === 'tray-capsule' && hasTrayRef.current) {
        gachaponAudio.playButtonClick();
        onTrayClickRef.current();
        return;
      }

      if (role === 'handle' && (phaseRef.current === 'idle' || phaseRef.current === 'ready')) {
        draggingHandle = true;
        dragAccumulated = 0;
        const center = getHandleScreenCenter();
        prevDragAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
        renderer.domElement.setPointerCapture(e.pointerId);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingHandle) {
        updateNdc(e);
        raycaster.setFromCamera(pointerNdc, camera);
        const targets: THREE.Object3D[] = [handleHitMesh];
        if (trayCapsuleHitMesh) targets.push(trayCapsuleHitMesh);
        const hits = raycaster.intersectObjects(targets, false);
        renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default';
        return;
      }

      const center = getHandleScreenCenter();
      const currAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
      let delta = currAngle - prevDragAngle;
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;
      prevDragAngle = currAngle;

      crankAngle += delta;
      targetCrankAngle = crankAngle;
      dragAccumulated += Math.abs(delta);

      if (dragAccumulated > 1.15) {
        draggingHandle = false;
        try {
          renderer.domElement.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore
        }
        onRequestSpinRef.current();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!draggingHandle) return;
      draggingHandle = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
      // Simple click/tap on handle triggers full spin!
      if (dragAccumulated < 0.25) {
        onRequestSpinRef.current();
      } else {
        targetCrankAngle = Math.round(crankAngle / (Math.PI * 2)) * (Math.PI * 2);
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 460;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const onContextLost = (ev: Event) => ev.preventDefault();
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.045);

      const currentPhase = phaseRef.current;

      // Sync crank rotation
      if (!draggingHandle) {
        crankAngle = THREE.MathUtils.damp(crankAngle, targetCrankAngle, 8.5, dt);
      }
      crankPivot.rotation.z = -crankAngle;

      // Spin state choreography
      if (currentPhase === 'cranking') {
        spinAnimTimer += dt;
        if (spinAnimTimer > 0.42 && !bounceBurstDone) {
          bounceBurstDone = true;
          gachaponAudio.playCapsuleBounce();
          // Launch capsules inside dome into a lively joyful bounce!
          domeCapsules.forEach((cap) => {
            const swirlAngle = Math.atan2(cap.pos.z, cap.pos.x) + Math.PI / 2;
            cap.vel.set(
              Math.cos(swirlAngle) * (1.8 + Math.random() * 1.4),
              2.6 + Math.random() * 2.4,
              Math.sin(swirlAngle) * (1.8 + Math.random() * 1.4)
            );
          });
          onPhaseRef.current('bouncing');
        }
      } else if (currentPhase === 'bouncing') {
        spinAnimTimer += dt;
        if (spinAnimTimer > 1.25) {
          // Spawn the drawn colored capsule rolling into the lower tray!
          if (trayCapsule) {
            machine.remove(trayCapsule);
            trayCapsule = null;
            trayCapsuleHitMesh = null;
          }
          const winColor = dispensedColorRef.current || 'pink';
          // Remove one capsule from inside the glass dome as it dispenses!
          if (domeCapsules.length > 0) {
            let removeIdx = domeCapsules.findIndex((c) => c.color === winColor);
            if (removeIdx === -1) removeIdx = 0;
            const [removedCap] = domeCapsules.splice(removeIdx, 1);
            machine.remove(removedCap.group);
          }

          const winnerGroup = createCapsule(
            winColor,
            new THREE.Vector3(-0.14, -0.78, 0.84)
          );
          winnerGroup.scale.setScalar(1.22);

          // Clickable invisible hit sphere over tray capsule
          const hit = new THREE.Mesh(
            trackGeo(new THREE.SphereGeometry(0.28, 12, 12)),
            trackMat(new THREE.MeshBasicMaterial({ visible: false }))
          );
          hit.userData.hitRole = 'tray-capsule';
          winnerGroup.add(hit);

          trayCapsule = winnerGroup;
          trayCapsuleHitMesh = hit;
          trayRollProgress = 0;
          trayIdleRock = 0;
          flapOpenAngle = -0.75;

          gachaponAudio.playCapsuleDrop();
          onPhaseRef.current('dispensing');
        }
      } else if (currentPhase === 'dispensing') {
        if (trayRollProgress >= 1) {
          onPhaseRef.current('ready');
        }
      }

      // Refill dome if collection was reset
      if (
        remainingCountRef.current > domeCapsules.length + (hasTrayRef.current ? 1 : 0) &&
        currentPhase === 'idle'
      ) {
        const toAdd =
          remainingCountRef.current - domeCapsules.length - (hasTrayRef.current ? 1 : 0);
        spawnDomeCapsules(Math.min(50, toAdd));
      }

      // Clear tray capsule once opened/removed
      if (!hasTrayRef.current && trayCapsule) {
        machine.remove(trayCapsule);
        trayCapsule = null;
        trayCapsuleHitMesh = null;
      }

      // Rolling exit animation in lower dispensing tray
      if (trayCapsule) {
        if (trayRollProgress < 1) {
          trayRollProgress = Math.min(1, trayRollProgress + dt * 1.45);
          const ease = 1 - Math.pow(1 - trayRollProgress, 3);
          const bounce =
            Math.abs(Math.sin(trayRollProgress * Math.PI * 2.2)) *
            (1 - trayRollProgress) *
            0.09;
          trayCapsule.position.set(
            -0.14,
            THREE.MathUtils.lerp(-0.78, -1.04, ease) + bounce,
            THREE.MathUtils.lerp(0.84, 1.22, ease)
          );
          trayCapsule.rotation.x += dt * 7.8 * (1 - trayRollProgress * 0.45);
        } else {
          trayIdleRock += dt * 2.8;
          trayCapsule.position.x = -0.14 + Math.sin(trayIdleRock) * 0.025;
          trayCapsule.rotation.z = -Math.sin(trayIdleRock) * 0.14;
        }
      }

      flapOpenAngle = THREE.MathUtils.damp(flapOpenAngle, 0, 7, dt);
      chuteFlapPivot.rotation.x = flapOpenAngle;

      traySpotLight.intensity = THREE.MathUtils.damp(
        traySpotLight.intensity,
        hasTrayRef.current ? 3.2 : 0,
        7,
        dt
      );

      // Gentle ambient rolling nudge inside glass dome
      ambientTimer += dt;
      if (ambientTimer > 2.6 && currentPhase === 'idle') {
        ambientTimer = 0;
        for (let k = 0; k < 3; k++) {
          const rand = domeCapsules[Math.floor(Math.random() * domeCapsules.length)];
          if (rand) {
            const ang = Math.random() * Math.PI * 2;
            rand.vel.x += Math.cos(ang) * 0.75;
            rand.vel.z += Math.sin(ang) * 0.75;
          }
        }
      }

      // Capsule physics inside transparent glass dome
      const floorY = 0.51;
      const domeRadius = 1.02;
      for (let i = 0; i < domeCapsules.length; i++) {
        const c = domeCapsules[i];
        c.vel.y -= 10.5 * dt;
        c.pos.addScaledVector(c.vel, dt);

        if (c.pos.y < floorY + c.radius) {
          c.pos.y = floorY + c.radius;
          if (c.vel.y < -0.45) c.vel.y = -c.vel.y * 0.42;
          else c.vel.y = 0;
          c.vel.x *= 0.93;
          c.vel.z *= 0.93;
        }

        // Cylindrical/spherical glass wall boundary
        const radial = Math.hypot(c.pos.x, c.pos.z);
        const maxR =
          c.pos.y > 1.36
            ? Math.max(0.25, Math.sqrt(Math.max(0.05, 1.02 * 1.02 - (c.pos.y - 1.36) ** 2)) - c.radius)
            : domeRadius - c.radius;

        if (radial > maxR && radial > 0.001) {
          const nx = c.pos.x / radial;
          const nz = c.pos.z / radial;
          c.pos.x = nx * maxR;
          c.pos.z = nz * maxR;
          const vn = c.vel.x * nx + c.vel.z * nz;
          if (vn > 0) {
            c.vel.x -= 1.55 * vn * nx;
            c.vel.z -= 1.55 * vn * nz;
          }
        }

        if (c.pos.y > 1.88) {
          c.pos.y = 1.88;
          c.vel.y = -Math.abs(c.vel.y) * 0.45;
        }

        for (let j = i + 1; j < domeCapsules.length; j++) {
          const other = domeCapsules[j];
          _deltaVec.subVectors(c.pos, other.pos);
          const dist = _deltaVec.length();
          const minDist = c.radius + other.radius;
          if (dist > 0.0001 && dist < minDist) {
            const overlap = (minDist - dist) * 0.5;
            _tmpVec.copy(_deltaVec).divideScalar(dist);
            c.pos.addScaledVector(_tmpVec, overlap);
            other.pos.addScaledVector(_tmpVec, -overlap);

            const relVel = c.vel.dot(_tmpVec) - other.vel.dot(_tmpVec);
            if (relVel < 0) {
              const imp = relVel * 0.65;
              c.vel.addScaledVector(_tmpVec, -imp);
              other.vel.addScaledVector(_tmpVec, imp);
            }
          }
        }

        c.group.position.copy(c.pos);
        c.group.rotation.x += (c.vel.z / c.radius) * dt;
        c.group.rotation.z -= (c.vel.x / c.radius) * dt;
      }

      renderer.render(scene, camera);
      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);

      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      envTarget.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="relative h-[440px] w-full max-w-[460px] sm:h-[520px] select-none"
      aria-label="Interactive 3D pastel pink Gachapon machine with turning handle and colorful capsule balls"
    />
  );
};
