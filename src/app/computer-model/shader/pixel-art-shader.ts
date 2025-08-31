import * as THREE from 'three';

export const PixelArtShader = {
  uniforms: {
    tDiffuse: { value: null },
    pixelSize: { value: 8.0 },
    resolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float pixelSize;
    varying vec2 vUv;

    #include <tonemapping_pars_fragment>

    void main() {
      vec2 pixelPos = floor(vUv * resolution / pixelSize) * pixelSize / resolution;

      vec4 color = texture2D(tDiffuse, pixelPos);

      gl_FragColor = color;

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
};
