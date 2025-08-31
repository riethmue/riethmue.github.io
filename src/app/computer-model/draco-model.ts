import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { SceneConfig } from './scene-constants';

export class DracoModel extends THREE.Object3D {
  private static dracoLoaderInstance: DRACOLoader;
  private static gltfLoaderInstance: GLTFLoader;

  public static getDracoLoaderInstance(): DRACOLoader {
    if (!DracoModel.dracoLoaderInstance) {
      DracoModel.dracoLoaderInstance = new DRACOLoader();
    }
    return DracoModel.dracoLoaderInstance;
  }

  public static getGltfLoaderInstance(): GLTFLoader {
    if (!DracoModel.gltfLoaderInstance) {
      DracoModel.gltfLoaderInstance = new GLTFLoader();
    }
    return DracoModel.gltfLoaderInstance;
  }

  constructor() {
    super();
  }

  public static load(config: SceneConfig): Promise<any> {
    DracoModel.getDracoLoaderInstance().setDecoderPath('assets/draco/');
    DracoModel.getGltfLoaderInstance().setDRACOLoader(
      DracoModel.getDracoLoaderInstance()
    );
    return new Promise((resolve, reject) => {
      DracoModel.getGltfLoaderInstance().setPath(config.model.filePath);
      DracoModel.getGltfLoaderInstance().load(
        config.model.fileName,
        (loadedObject) => {
          resolve(loadedObject);
        },
        () => {}, // TODO: implement loading screen
        (error) => {
          reject(error);
        }
      );
    });
  }
}
