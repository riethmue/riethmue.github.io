import * as THREE from 'three';

interface ControlEvent {
  type: 'change' | 'start' | 'end';
}

/**
 * CustomControls – based on OrbitControls, but with pan/zoom-limits.
 */
export class CustomControls extends THREE.EventDispatcher<ControlEvent> {
  declare dispatchEvent: (event: ControlEvent) => void;

  object: THREE.Camera;
  domElement: HTMLElement;

  // pan
  minXPan = -Infinity;
  maxXPan = Infinity;
  minYPan = -Infinity;
  maxYPan = Infinity;

  // flags
  enabled = true;

  // orbit target
  target = new THREE.Vector3();

  // dolly
  minDistance = 0;
  maxDistance = Infinity;

  // zoom
  minZoom = 0;
  maxZoom = Infinity;

  // vertical limits
  minPolarAngle = 0;
  maxPolarAngle = Math.PI;

  // vertical limits
  minAzimuthAngle = -Infinity;
  maxAzimuthAngle = Infinity;

  // damping
  enableDamping = false;
  dampingFactor = 0.05;

  // zoom
  enableZoom = true;
  zoomSpeed = 1.0;

  // rotation
  enableRotate = true;
  rotateSpeed = 1.0;

  // panning
  enablePan = true;
  panSpeed = 1.0;
  screenSpacePanning = false;
  keyPanSpeed = 7.0;

  // auto rotation
  autoRotate = false;
  autoRotateSpeed = 2.0;

  // keys
  enableKeys = true;
  keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

  // mouse & touch
  mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };
  touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

  // reset state
  private target0 = this.target.clone();
  private position0 = new THREE.Vector3();
  private zoom0 = 1;

  // internals
  private spherical = new THREE.Spherical();
  private sphericalDelta = new THREE.Spherical();
  private panOffset = new THREE.Vector3();
  private scale = 1;
  private zoomChanged = false;

  private rotateStart = new THREE.Vector2();
  private rotateEnd = new THREE.Vector2();
  private rotateDelta = new THREE.Vector2();

  private panStart = new THREE.Vector2();
  private panEnd = new THREE.Vector2();
  private panDelta = new THREE.Vector2();

  private dollyStart = new THREE.Vector2();
  private dollyEnd = new THREE.Vector2();
  private dollyDelta = new THREE.Vector2();

  private STATE = {
    NONE: -1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_PAN: 4,
    TOUCH_DOLLY_PAN: 5,
    TOUCH_DOLLY_ROTATE: 6,
    TOUCH_DOLLY: 7,
    TOUCH_ROTATE_PAN: 8,
  };
  private state = this.STATE.NONE;

  constructor(object: THREE.Camera, domElement: HTMLElement) {
    super();

    this.object = object;
    this.domElement = domElement;

    this.position0.copy(this.object.position);
    this.zoom0 = this.object.zoom;

    // Events
    this.domElement.addEventListener('contextmenu', this.onContextMenu);
    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('wheel', this.onMouseWheel, {
      passive: false,
    });

    this.domElement.addEventListener('touchstart', this.onTouchStart, {
      passive: false,
    });
    this.domElement.addEventListener('touchend', this.onTouchEnd);
    this.domElement.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });

    this.domElement.addEventListener('keydown', this.onKeyDown);

    // Element keyboard focus
    if (this.domElement.tabIndex === -1) {
      this.domElement.tabIndex = 0;
    }
  }

  // ============ Public API ============
  getPolarAngle(): number {
    return this.spherical.phi;
  }

  getAzimuthalAngle(): number {
    return this.spherical.theta;
  }

  saveState(): void {
    this.target0.copy(this.target);
    this.position0.copy(this.object.position);
    this.zoom0 = this.object.zoom;
  }

  reset(): void {
    this.target.copy(this.target0);
    this.object.position.copy(this.position0);
    this.object.zoom = this.zoom0;

    this.object.updateProjectionMatrix();
    this.dispatchEvent({ type: 'change' });

    this.update();
    this.state = this.STATE.NONE;
  }

  update(): boolean {
    const offset = new THREE.Vector3();

    // camera.up ist die Orbit-Achse
    const quat = new THREE.Quaternion().setFromUnitVectors(
      this.object.up,
      new THREE.Vector3(0, 1, 0)
    );
    const quatInverse = quat.clone().invert();

    const lastPosition = new THREE.Vector3();
    const lastQuaternion = new THREE.Quaternion();

    const position = this.object.position;

    offset.copy(position).sub(this.target);

    // spin
    offset.applyQuaternion(quat);

    // set offset
    this.spherical.setFromVector3(offset);

    // auto rotation
    if (this.autoRotate && this.state === this.STATE.NONE) {
      this.sphericalDelta.theta -=
        ((2 * Math.PI) / 60 / 60) * this.autoRotateSpeed;
    }

    // damping
    if (this.enableDamping) {
      this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor;
      this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor;
    } else {
      this.spherical.theta += this.sphericalDelta.theta;
      this.spherical.phi += this.sphericalDelta.phi;
    }

    // clamp azimuth
    this.spherical.theta = Math.max(
      this.minAzimuthAngle,
      Math.min(this.maxAzimuthAngle, this.spherical.theta)
    );

    // clamp polar
    this.spherical.phi = Math.max(
      this.minPolarAngle,
      Math.min(this.maxPolarAngle, this.spherical.phi)
    );

    this.spherical.makeSafe();

    // radius / distance
    this.spherical.radius *= this.scale;
    this.spherical.radius = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, this.spherical.radius)
    );

    // check pan limits
    const newX = this.target.x + this.panOffset.x;
    const newY = this.target.y + this.panOffset.y;
    if (
      newX <= this.maxXPan &&
      newX >= this.minXPan &&
      newY <= this.maxYPan &&
      newY >= this.minYPan
    ) {
      if (this.enableDamping) {
        this.target.addScaledVector(this.panOffset, this.dampingFactor);
      } else {
        this.target.add(this.panOffset);
      }
    }

    offset.setFromSpherical(this.spherical);
    offset.applyQuaternion(quatInverse);

    position.copy(this.target).add(offset);
    this.object.lookAt(this.target);

    if (this.enableDamping) {
      this.sphericalDelta.theta *= 1 - this.dampingFactor;
      this.sphericalDelta.phi *= 1 - this.dampingFactor;
      this.panOffset.multiplyScalar(1 - this.dampingFactor);
    } else {
      this.sphericalDelta.set(0, 0, 0);
      this.panOffset.set(0, 0, 0);
    }

    this.scale = 1;

    if (
      this.zoomChanged ||
      lastPosition.distanceToSquared(this.object.position) > 1e-6 ||
      8 * (1 - lastQuaternion.dot(this.object.quaternion)) > 1e-6
    ) {
      this.dispatchEvent({ type: 'change' });
      lastPosition.copy(this.object.position);
      lastQuaternion.copy(this.object.quaternion);
      this.zoomChanged = false;
      return true;
    }

    return false;
  }

  dispose(): void {
    this.domElement.removeEventListener('contextmenu', this.onContextMenu);
    this.domElement.removeEventListener('mousedown', this.onMouseDown);
    this.domElement.removeEventListener('wheel', this.onMouseWheel);
    this.domElement.removeEventListener('touchstart', this.onTouchStart);
    this.domElement.removeEventListener('touchend', this.onTouchEnd);
    this.domElement.removeEventListener('touchmove', this.onTouchMove);
    this.domElement.removeEventListener('keydown', this.onKeyDown);
  }

  // ============ Event Handler ============
  private onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };

  private onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    // handle states here…
  };

  private onMouseWheel = (event: WheelEvent) => {
    event.preventDefault();
    // handle zoom here…
  };

  private onKeyDown = (event: KeyboardEvent) => {
    // handle arrow keys
  };

  private onTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    // handle touch logic
  };

  private onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    // handle touch move
  };

  private onTouchEnd = (_event: TouchEvent) => {
    this.state = this.STATE.NONE;
  };
}
