import {
  PerspectiveCamera,
  PlaneBufferGeometry,
  Points,
  Scene,
  ShaderMaterial,
  Texture,
  Vector3,
  WebGLRenderer
} from 'three';

import dotMatrixShader from './dot-matrix-shader.js';


export default class VideoRenderer {
  constructor() {
    this.animationLoopRunning = false;
    this.videos = [];

    this.initTexture();
    this.initRenderer();

    this.animationLoopTick = this.animationLoopTick.bind(this);
  }

  setVideos(videos = []) {
    this.videos = videos;

    if (this.videos.length === 0) {
      this.stop();
    } else {
      this.start();
    }
  }

  getDomElement() {
    return this.renderer.domElement;
  }

  /**
   * @private
   */
  start() {
    if (this.animationLoopRunning) { return; }

    this.animationLoopRunning = true;
    requestAnimationFrame(this.animationLoopTick)
  }

  /**
   * @private
   */
  stop() {
    this.animationLoopRunning = false;
  }

  /**
   * @private
   */
  animationLoopTick() {
    const activeVideos = this.videos;
    const textureCanvas = this.texture.image;

    const n = activeVideos.length;
    const ctx = textureCanvas.getContext('2d');
    const w = textureCanvas.width;
    const h = textureCanvas.height;

    if (n === 0) {
      ctx.clearRect(0, 0, w, h);
    } else {
      activeVideos.forEach((video, index) => {
        const dstSliceWidth = w / n;

        // FIXME: only use a portion of the source-video to prevent distortion
        ctx.drawImage(video, index * dstSliceWidth, 0, dstSliceWidth, h);
      });
    }

    this.render();

    if (this.animationLoopRunning) {
      requestAnimationFrame(this.animationLoopTick);
    }
  }

  /**
   * @private
   */
  render() { /* stub: will be overwritten in initRenderer */ }

  /**
   * @private
   */
  initTexture() {
    const canvas = document.createElement('canvas');

    canvas.width = 512;
    canvas.height = 256;

    // FIXME: configure texture
    this.texture = new Texture(canvas);
  }

  /**
   * @private
   */
  initRenderer() {
    const renderer = new WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xe10079);

    const scene = new Scene();
    // FIXME: maybe we should just use an orthographic camera here?
    const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 6.3);
    camera.lookAt(new Vector3(0, 0, 0));

    const material = new ShaderMaterial(dotMatrixShader);
    material.uniforms.texture.value = this.texture;
    material.uniforms.scale.value = window.innerHeight / 2;

    // FIXME: resolution and size might be configurable
    const points = new Points(
        new PlaneBufferGeometry(16, 9, 160, 90),
        material);

    scene.add(points);

    // bind events
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      material.uniforms.scale.value = window.innerHeight / 2;
    });

    // finalize
    this.renderer = renderer;
    this.render = () => {
      this.texture.needsUpdate = true;

      renderer.render(scene, camera);
    }
  }
}