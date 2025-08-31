import { ElementRef, EventEmitter } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
// import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';
import { CustomControls } from './custom-controls';
import { DracoModel } from './draco-model';
import { SceneConfig } from './scene-constants';
import { environment } from '../../environments/environment';

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
    document.addEventListener('mousemove', this.onMouseMove, false);
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
    console.log('initRenderer', this.config);
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
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
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
    void main()
    {
        //calculate the vertex position as expected in a perpective renderer
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        //now onto the alpha calculation
        //get the vertex vertex normal
        vec3 nmal = normal;
        // find vector from the vertex to camera and then normalise it
        vec3 viewVector =  normalize((cameraPosition - normal));
        // now find the dot poduct
        // faceing the camera is 1 and perpendicular is 0 so for this effect you want to minus it from 1
        // note that alpha is the varying float passed between the vertex and fragment shader
        alpha =  alphaBase - dot(nmal, viewVector);
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

    // this.pixelPass = new ShaderPass(PixelShader);
    // this.pixelPass.material.uniforms['resolution'].value = new THREE.Vector2(
    //   window.innerWidth,
    //   window.innerHeight
    // );
    // this.pixelPass.uniforms['resolution'].value.multiplyScalar(
    //   window.devicePixelRatio
    // );
    // this.pixelPass.uniforms['pixelSize'].value = 8;
    // this.effectComposer.addPass(this.pixelPass);

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

      const color = new THREE.Color();
      color.setHSL(
        Math.random(),
        0.7 + 0.2 * Math.random(),
        0.5 + 0.1 * Math.random()
      );

      const mat = new THREE.MeshPhongMaterial({ color: color, shininess: 200 });

      const mesh = new THREE.Mesh(geom, mat);

      const scale = 3 + Math.random();
      const randomizer = 0.5;
      const radiusDelta = 500;
      mesh.scale.set(scale, scale, scale);
      mesh.position
        .set(
          Math.random() - randomizer,
          Math.random() - randomizer,
          Math.random() - randomizer
        )
        .normalize();
      mesh.position.multiplyScalar(Math.random() * radiusDelta);
      mesh.rotation.set(
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
      );
      group.add(mesh);
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
    this.config.renderer.size.width = width;
    this.config.renderer.size.height = height;
    this.camera.aspect = this.calculateAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer?.setSize(width, height);
    this.renderer?.render(this, this.camera);
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

  onMouseDown(event) {
    const canvas = this.renderer.domElement;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };

    mouse.x = (mouse.x / canvas.width) * 2 - 1;
    mouse.y = -(mouse.y / canvas.height) * 2 + 1;

    this.raycaster.setFromCamera(mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    if (intersects.length > 0) {
      this.modelClicked.emit();
    }
  }

  onMouseHover(event) {
    const canvas = this.renderer.domElement;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };

    mouse.x = (mouse.x / canvas.width) * 2 - 1;
    mouse.y = -(mouse.y / canvas.height) * 2 + 1;

    this.raycaster.setFromCamera(mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    if (intersects.length > 0) {
      const child = intersects[0].object as THREE.Mesh;
      if (child?.name) {
        (child?.material as THREE.MeshStandardMaterial)?.color.set(
          Math.random() * 0xffffff
        );
      }
    } else {
      this.hoverModel = false;
      this.scene.traverse((child: any) => {
        if (child.isMesh) {
          if (child?.name) {
            (child?.material as THREE.MeshStandardMaterial)?.color.set(
              0xffffff
            );
          }
        }
      });
    }
  }

  animation(renderer, scene, camera, controls) {
    //renderer.render(scene, camera);
    this.effectComposer.render();
    controls.update();
  }

  private calculateAspectRatio() {
    return this.config.renderer.size.width / this.config.renderer.size.height;
  }
}
