import { ElementRef, EventEmitter } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CustomControls } from './custom-controls';
import { DracoModel } from './draco-model';
import { SceneConfig } from './scene-constants';
import { environment } from '../../environments/environment';
import { PixelArtShader } from './shader/pixel-art-shader';

export class ModelScene {
  modelClicked = new EventEmitter<void>();
  sceneLoaded = new EventEmitter<any>();
  scene = new THREE.Scene();
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  controls: any;
  effectComposer: EffectComposer;
  renderPass: RenderPass;
  pixelPass: ShaderPass;
  glitchPass: GlitchPass;

  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  originalMaterial: THREE.MeshBasicMaterial;
  disconnectedMaterial: THREE.MeshPhongMaterial;
  disconnectedAnimationMaterial: THREE.ShaderMaterial;
  animationMaterial: THREE.ShaderMaterial;
  clickedObject: any;
  onMouseDownClick: any;
  onMouseMove: any;
  initialModelMaterialColor: any;
  public hoverModel = false;

  constructor(public htmlElement: ElementRef, public config: SceneConfig) {
    this.scene.background = new THREE.Color(0x000000);
    this.onMouseDownClick = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseHover.bind(this);
    document.addEventListener('pointerdown', this.onMouseDownClick, false);
    document.addEventListener('pointermove', this.onMouseMove, false);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initCamera();
    this.initScene();
    this.initRenderer();
    this.addPass();
    this.initControls();
    this.addLights();

    this.renderer.setAnimationLoop(() => {
      this.animation(this.renderer, this.scene, this.camera, this.controls);
    });
  }

  //#region prepare scene
  addLights() {
    if (this.config.lights) {
      this.config.lights.forEach((lightConfig) => {
        if (lightConfig.position) {
          lightConfig.light.position.set(
            lightConfig.position.x,
            lightConfig.position.y,
            lightConfig.position.z
          );
        }
        this.camera.add(lightConfig.light);
      });
    }
  }

  initControls() {
    this.controls = new CustomControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('start', () => {
      //this.controls.autoRotate = false;
    });

    // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.75;

    // zoom
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 0.5;

    if (this.controls.touches) {
      this.controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      };
    }

    if (this.controls.mouseButtons) {
      this.controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      };
    }

    this.controls.screenSpacePanning = false;
    this.controls.enablePan = false;
    this.controls.minYPan = 35;
    this.controls.maxYPan = 250;

    this.controls.minDistance = 50;
    this.controls.maxDistance = 300;

    this.controls.autoRotate = true;

    // // lock rotation to x-axis
    this.controls.minPolarAngle = Math.PI / 2;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.controls.target = this.config.camera.lookAt;

    // CustomControls fires change event only on zoom change
    this.controls.addEventListener('change', this.onZoomChanged.bind(this));

    this.controls.update();
    this.controls.saveState();
  }

  // check latest doc when start to use this
  initControlsOrbit() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('start', () => {
      this.controls.autoRotate = false;
    });

    // an animation loop is required when either damping or auto-rotation are enabled
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.75;

    // zoom
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 0.5;

    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN,
    };

    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.ROTATE,
    };

    this.controls.screenSpacePanning = false;
    this.controls.enablePan = false;
    this.controls.minYPan = 35;
    this.controls.maxYPan = 250;

    this.controls.minDistance = 50;
    this.controls.maxDistance = 300;

    this.controls.autoRotate = true;

    // // lock rotation to x-axis
    this.controls.minPolarAngle = Math.PI / 2;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.controls.target = this.config.camera.lookAt;

    // CustomControls fires change event only on zoom change
    this.controls.addEventListener('change', this.onZoomChanged.bind(this));

    this.controls.update();
    this.controls.saveState();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      this.config.camera.fov,
      this.calculateAspectRatio(),
      this.config.camera.near,
      this.config.camera.far
    );

    this.camera.position.set(
      this.config.camera.position.x,
      this.config.camera.position.y,
      this.config.camera.position.z
    );
    this.camera.updateProjectionMatrix();

    this.scene.add(this.camera);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer(
      this.config.renderer.rendererParameter
    );
    this.renderer?.setSize(
      this.config.renderer.size.width,
      this.config.renderer.size.height
    );

    if (this.config.renderer.devicePixelRatio) {
      this.renderer?.setPixelRatio(this.config.renderer.devicePixelRatio);
    }
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    if ((this.renderer as any).debug) {
      (this.renderer as any).debug.checkShaderErrors = !environment.production;
    }

    this.htmlElement.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
  }

  vertexShader() {
    return `
    varying float alpha;
    uniform float alphaBase;
    void main() {
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPos;

      vec3 nmal = normalize(normalMatrix * normal);
      vec3 viewVector = normalize(-mvPos.xyz);
      alpha = alphaBase - dot(nmal, viewVector);
    }
    `;
  }

  fragmentShader() {
    return `
    uniform vec3 colorOption;
    varying float alpha;
    void main() {
        // make the fragment white with the alpha calculated from the vertex shader
        gl_FragColor = vec4(colorOption.x, colorOption.y ,colorOption.z , alpha);
    }
    `;
  }

  async initScene() {
    try {
      const obj = await DracoModel.load(this.config);
      const gltfScene = obj.scene;
      gltfScene.position.set(
        this.config.model.position.x,
        this.config.model.position.y,
        this.config.model.position.z
      );
      gltfScene.scale.set(
        this.config.model.scaling,
        this.config.model.scaling,
        this.config.model.scaling
      );
      gltfScene.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.DoubleSide;
        }
      });
      this.scene.add(gltfScene);
      this.addGeometries();
      this.scene.updateMatrixWorld(true);
      //this.prepareMaterials();
      this.sceneLoaded.emit();
    } catch (error) {
      console.error(error);
    }
  }

  async addPass() {
    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.addPass(new RenderPass(this.scene, this.camera));

    this.pixelPass = new ShaderPass(PixelArtShader);
    this.pixelPass.material.transparent = false;
    this.pixelPass.uniforms['resolution'].value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    );
    this.pixelPass.uniforms['resolution'].value.multiplyScalar(
      window.devicePixelRatio
    );
    this.pixelPass.uniforms['pixelSize'].value = 8;
    this.effectComposer.addPass(this.pixelPass);

    this.glitchPass = new GlitchPass();
    this.effectComposer.addPass(this.glitchPass);
  }

  async addGeometries() {
    const geometries = [
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.ConeGeometry(1, 1, 32),
      new THREE.TetrahedronGeometry(1),
    ];

    const group = new THREE.Group();

    for (let i = 0; i < 50; i++) {
      const geom = geometries[Math.floor(Math.random() * geometries.length)];
      const scale = 3 + Math.random();
      const radiusDelta = 500;
      let mesh: THREE.Mesh;
      let tries = 0;
      let tooClose = true;

      while (tooClose && tries < 50) {
        tries++;
        const mat = new THREE.MeshPhongMaterial({
          color: new THREE.Color().setHSL(
            Math.random(),
            0.7 + 0.2 * Math.random(),
            0.5 + 0.1 * Math.random()
          ),
        });
        mesh = new THREE.Mesh(geom, mat);

        mesh.scale.set(scale, scale, scale);
        mesh.position
          .set(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
          )
          .normalize()
          .multiplyScalar(Math.random() * radiusDelta);

        // Check distance to others
        tooClose = group.children.some((child: THREE.Mesh) => {
          const minDist =
            (child.geometry.boundingSphere?.radius ?? 1) * child.scale.x +
            (mesh.geometry.boundingSphere?.radius ?? 1) * mesh.scale.x;
          return child.position.distanceTo(mesh.position) < minDist * 0.6; // 0.6 = safety factor
        });
      }

      group.add(mesh!);
    }

    this.scene.add(group);
  }

  // this method is based on threejs version 0.134.0:
  // https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
  // https://github.com/mrdoob/three.js/blob/r134/docs/manual/en/introduction/How-to-dispose-of-objects.html
  // it should be safe for future versions
  async clearAll(obj) {
    if (!obj) {
      return;
    }

    // recursion
    obj.children?.forEach(async (child) => {
      await this.clearAll(child);
      // remove obj from scene
      if (obj instanceof THREE.Scene) {
        obj?.remove(child);
      }
    });

    // dispose geometries
    if (obj.geometry) {
      obj.geometry.dispose();
    }

    // dispose materials and inner properties
    if (obj.material) {
      // in case of materials, map, lightMap, bumpMap, normalMap, envMap, normalMap, specularMap
      Object.keys(obj.material).forEach((prop) => {
        // undefined
        if (!obj.material[prop]) {
          return;
        }
        if (
          obj.material[prop] !== null &&
          typeof obj.material[prop].dispose === 'function'
        ) {
          obj.material[prop].dispose();
        }
      });
      obj.material.dispose();
    }

    // dispose textures
    if (obj instanceof THREE.Texture) {
      obj?.dispose();
    }

    // dispose render targets
    if (obj instanceof THREE.WebGLRenderTarget) {
      obj.dispose();
    }

    // dispose everything which got a dispose function
    if (!(obj instanceof THREE.Scene) && typeof obj.dispose === 'function') {
      obj.dispose();
    }

    // set everything to undefined because it's recommended
    obj = undefined;
  }

  public disposeAll() {
    // remove listeners
    document.removeEventListener('pointerdown', this.onMouseDownClick, false);
    document.removeEventListener('mousemove', this.onMouseMove, false);

    // stop animations
    this.renderer.setAnimationLoop(null);
    // renderer
    // this.renderer?.dispose();
    this.renderer?.forceContextLoss();
    // this.renderer.domElement = undefined;

    // https://github.com/mrdoob/three.js/issues/20346
    // unfortunatly: there are still WebGL artefacts which got not disposed yet

    this.clearAll({
      children: [
        this.disconnectedMaterial,
        this.animationMaterial,
        this.disconnectedMaterial,
        this.originalMaterial,
        this.disconnectedAnimationMaterial,
        this.renderer,
        this.controls,
        this.camera,
        this.mouse,
        this.clickedObject,
        // this.animationHashMap,
        // this.disconnectedAnimationMap,
        this,
      ],
    });
  }

  public resetView() {
    // reset orbitcontrols
    this.controls?.reset();
    this.scene
      .getObjectByName('Scene')
      ?.position.set(
        this.config.model.position.x,
        this.config.model.position.y,
        this.config.model.position.z
      );
    this.controls.autoRotate = true;
  }

  public resizeView(width: number, height: number) {
    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));

    const dpr = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(dpr);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    const anyComposer = this.effectComposer as any;
    if (typeof anyComposer?.setPixelRatio === 'function') {
      anyComposer.setPixelRatio(dpr);
      this.effectComposer.setSize(width, height);
    } else {
      this.effectComposer.setSize(width * dpr, height * dpr);
    }

    // set resolution uniform the SAME way as in addPass()
    if (this.pixelPass?.uniforms?.['resolution']) {
      (this.pixelPass.uniforms['resolution'].value as THREE.Vector2)
        .set(width, height)
        .multiplyScalar(dpr);
    }

    this.effectComposer.render();
    this.controls?.update?.();
  }

  private debugResizeTag(tag: string) {
    // EN: Compare DOM client size, renderer size, DPR, drawing buffer size
    const rect = this.renderer.domElement.getBoundingClientRect();
    const rs = new THREE.Vector2();
    const db = new THREE.Vector2();
    this.renderer.getSize(rs);
    this.renderer.getDrawingBufferSize(db);

    console.log(
      `[${tag}]`,
      {
        client: { w: Math.round(rect.width), h: Math.round(rect.height) },
        rendererSize: { w: rs.x, h: rs.y },
        drawingBuffer: { w: db.x, h: db.y },
        dpr: this.renderer.getPixelRatio?.(),
      },
      'composer?',
      !!this.effectComposer,
      'pixelPass?',
      !!this.pixelPass,
      'loop?',
      typeof (this.renderer as any).getAnimationLoop === 'function'
        ? !!this.renderer.getAnimationLoop()
        : 'unknown'
    );
  }

  private getPointerNDC(ev: PointerEvent): THREE.Vector2 {
    // Use bounding rect to convert client coords to NDC [-1, 1]
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndcX = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    return new THREE.Vector2(ndcX, ndcY);
  }

  onZoomChanged(event) {
    const zoomLevel = this.controls.target.distanceTo(
      this.controls.object.position
    );
    if (zoomLevel <= 500) {
      this.controls.screenSpacePanning = true;
      this.controls.enablePan = true;
    } else {
      this.controls.screenSpacePanning = false;
      this.controls.enablePan = false;
    }
  }

  onMouseDown = (ev: PointerEvent) => {
    const ndc = this.getPointerNDC(ev);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.scene.children, true);
    if (hits.length) this.modelClicked.emit();
  };
  onMouseHover = (ev: PointerEvent) => {
    const ndc = this.getPointerNDC(ev);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.scene.children, true);
    if (hits.length) {
      const m = hits[0].object as THREE.Mesh;
      if (m?.name)
        (m.material as THREE.MeshStandardMaterial)?.color.set(
          Math.random() * 0xffffff
        );
    } else {
      this.hoverModel = false;
      this.scene.traverse((c: any) => {
        if (c.isMesh && c?.name)
          (c.material as THREE.MeshStandardMaterial)?.color.set(0xffffff);
      });
    }
  };

  animation(renderer, scene, camera, controls) {
    //renderer.render(scene, camera);
    this.effectComposer.render();
    controls.update();
  }

  private calculateAspectRatio() {
    return this.config.renderer.size.width / this.config.renderer.size.height;
  }
}
