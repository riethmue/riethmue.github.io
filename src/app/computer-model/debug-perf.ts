import { environment } from '../../environments/environment';

export class DebugPerf {
  private lastTs = 0;
  private fps = 0;
  private frames = 0;
  private accTime = 0;
  private overlay?: HTMLDivElement;
  private enabled = true; // hehe :3
  constructor() {
    if (this.enabled) this.createOverlay();
  }

  init(renderer: any) {
    if (!this.enabled) return;
    renderer.info.autoReset = false;
  }

  beginFrame(renderer: any) {
    if (!this.enabled) return;
    renderer.info.reset();
  }

  endFrame(renderer: any, ts: number) {
    if (!this.enabled) return;
    if (this.lastTs === 0) this.lastTs = ts;
    const dt = ts - this.lastTs;
    this.lastTs = ts;
    this.frames += 1;
    this.accTime += dt;
    if (this.accTime >= 500) {
      this.fps = Math.round((this.frames * 1000) / this.accTime);
      this.frames = 0;
      this.accTime = 0;
    }

    const info = renderer.info;
    const calls = info.render.calls;
    const tris = info.render.triangles;
    const lines = info.render.lines;
    const points = info.render.points;
    const geos = info.memory.geometries;
    const texs = info.memory.textures;

    if (this.overlay && this.fps) {
      this.overlay.textContent =
        `FPS: ${this.fps}  |  Calls: ${calls}  |  Triangles: ${tris}  |  ` +
        `Lines: ${lines}  |  Points: ${points}  |  Geometries: ${geos}  |  Textures: ${texs}`;
    }
  }

  private createOverlay() {
    this.overlay = document.createElement('div');
    Object.assign(this.overlay.style, {
      position: 'fixed',
      top: '8px',
      left: '8px',
      padding: '6px 10px',
      background: 'rgba(0,0,0,0.6)',
      color: '#0f0',
      font: '12px/1.3 monospace',
      zIndex: '99999',
      borderRadius: '6px',
      pointerEvents: 'none',
      whiteSpace: 'pre',
    } as CSSStyleDeclaration);
    this.overlay.textContent = 'Measuring…';
    document.body.appendChild(this.overlay);
  }
}
