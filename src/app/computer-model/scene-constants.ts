import * as THREE from 'three';

export interface SceneLight {
  light: THREE.Light;
  position?: THREE.Vector3;
}

export interface SceneConfig {
  model: {
    filePath: string;
    fileName: string;
    scaling: number;
    position: THREE.Vector3;
  };
  renderer: {
    rendererParamter: THREE.WebGLRendererParameters;
    devicePixelRatio?: number;
    size: {
      width: number;
      height: number;
    };
  };
  lights: SceneLight[];
  camera: {
    fov: number;
    // aspect: number; should be calculated automatically
    near: number;
    far: number;
    position: THREE.Vector3;
    lookAt: THREE.Vector3;
  };
  //   animation: {
  //     sphereStart: number;
  //     sphereEnd: number;
  //     fadeStart: number;
  //     fadeEnd: number;
  //   };
}

export interface InitialSceneConfig {
  devicePixelRatio?: number;
  size: {
    width: number;
    height: number;
  };
}

// export interface SensorAnimationConfig {
//   position: THREE.Vector3;
//   shaderMaterial: THREE.ShaderMaterial;
//   tweenSphereDuration: number;
//   tweenFadeDuration: number;
//   loop: boolean;
// }
