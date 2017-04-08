//language=GLSL
const vertexShader = `
    uniform float size;
    uniform float scale;
    uniform sampler2D texture;

    varying float vLuma;

    #include <common>

    vec3 lumaWeights = vec3(0.299, 0.587, 0.114);

    void main() {
      vec3 color = texture2D(texture, uv).rgb;
      // dot product used to get the sum of components
      vLuma = dot(lumaWeights * color, vec3(1.0));

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = size * (scale / -mvPosition.z);
    }
`;

//language=GLSL
const fragmentShader = `
  varying float vLuma;

  float circleCoefficient(vec2 p, float radius) {
    float r = 1.0 - length(p);
    return smoothstep(1.0 - radius, 1.01 - radius, r);
  }

  void main() {
    vec2 p = 2.0 * gl_PointCoord - vec2(1.0, 1.0);
    float c1 = (1.0 - smoothstep(0.4, 0.5, vLuma));
    float c2 = smoothstep(0.4, 1.0, 1.0 - vLuma);

    gl_FragColor = c1 *
        circleCoefficient(p, c2) *
        vec4(0.0, 0.0, 0.0, 1.0);
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
    texture: { value: null }
  }
}