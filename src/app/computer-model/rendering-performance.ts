import { environment } from '../../environments/environment';
import { isMobile } from '../util/utils';

export class RenderingPerformance {
  private enabled = !isMobile();
  private lastTs = 0;
  private fps = 0;
  private frames = 0;
  private accTime = 0;
  private overlay?: HTMLDivElement;
  private BREAKPOINT = 900;
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
    const calls = info.render.calls.toString().padStart(3, ' ');
    const tris = info.render.triangles.toString().padStart(7, ' ');
    const lines = info.render.lines.toString().padStart(5, ' ');
    const points = info.render.points.toString().padStart(5, ' ');
    const geos = info.memory.geometries.toString().padStart(4, ' ');
    const texs = info.memory.textures.toString().padStart(3, ' ');

    console.log('innerWidth', window.innerWidth);
    const wide = window.innerWidth > this.BREAKPOINT;
    console.log('wide', wide);
    if (wide) {
      this.overlay.textContent =
        `FPS: ${this.fps.toString().padStart(3, ' ')}  |  ` +
        `Calls: ${calls}  |  Triangles: ${tris}  |  Lines: ${lines}  |  ` +
        `Points: ${points}  |  Geometries: ${geos}  |  Textures: ${texs}`;
    } else {
      console.log('weit');
      this.overlay.textContent =
        `FPS: ${this.fps
          .toString()
          .padStart(3, ' ')} | Calls: ${calls} | Tris: ${tris}\n` +
        `Lines: ${lines} | Points: ${points} | Geos: ${geos} | Texs: ${texs}`;
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
      zIndex: '99998',
      borderRadius: '6px',
      pointerEvents: 'none',
      whiteSpace: 'pre',
      maxWidth: `${Math.round(window.innerWidth * 0.9)}px`,
    } as CSSStyleDeclaration);
    this.overlay.textContent = 'Measuring…';
    document.body.appendChild(this.overlay);
  }
}
