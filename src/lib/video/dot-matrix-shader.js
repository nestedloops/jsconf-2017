import {Color} from 'three';

//language=GLSL
const vertexShader = `
  uniform float size;
  uniform float scale;
  uniform sampler2D texture;
  uniform float lumMin;
  uniform float lumMax;

  #include <common>

  const vec3 lumaComp = vec3(0.299, 0.587, 0.114);

  void main() {
    vec3 color = texture2D(texture, uv).rgb;
    // dot product used to get the sum of components
    float luma = dot(lumaComp * color, vec3(1.0));

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float distanceScaling = (scale / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = smoothstep(lumMin, lumMax, luma) * size * distanceScaling;
  }
`;

//language=GLSL
const fragmentShader = `
  uniform vec3 pointColor;
  uniform float r0;

  float circle(vec2 p) {
    return 1.0 - smoothstep(r0, 1.0, length(p));
  }

  void main() {
    vec2 p = 2.0 * gl_PointCoord - vec2(1.0, 1.0);
    gl_FragColor = vec4(pointColor, circle(p));
  }
`;

export default {
  vertexShader, fragmentShader,
  transparent: true,
  alphaTest: 0.5,
  depthWrite: false,
  uniforms: {
    size: { value: 0.25 },
    scale: { value: 0 },
    texture: { value: null },
    pointColor: {type: 'c', value: new Color()},
    lumMin: {value: 0.0},
    lumMax: {value: 0.0},
    r0: {value: 0.0}
  }
}