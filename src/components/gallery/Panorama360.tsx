"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/** Horizontal sweep the viewer keeps, whatever the container's shape. */
const TARGET_HFOV_DEG = 100;

/**
 * Interactive 360° viewer for an equirectangular photo: the image is
 * mapped onto the inside of a sphere, so dragging looks around it the
 * way Street View does, and it drifts on its own when left alone.
 *
 * Costs nothing until it is needed. The flat image renders immediately
 * and three.js is only fetched once the panorama scrolls into view — if
 * that import fails, or the device has no WebGL, the flat image simply
 * stays. The render loop also stops whenever the panorama is off-screen.
 */
export function Panorama360({
  src,
  flatSrc,
  alt,
  hint,
}: {
  /** Equirectangular texture (2:1) mapped onto the sphere. */
  src: string;
  /** Smaller flat version shown before, and instead of, the viewer. */
  flatSrc: string;
  alt: string;
  hint: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [dragged, setDragged] = useState(false);
  const reduceMotion = useReducedMotion();

  // The animation loop reads the preference through a ref, so changing
  // it takes effect without tearing the whole viewer down and back up.
  const reduceRef = useRef(reduceMotion);
  useEffect(() => {
    reduceRef.current = reduceMotion;
  }, [reduceMotion]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    async function start() {
      let THREE: typeof import("three");
      try {
        THREE = await import("three");
      } catch {
        return; // keep the flat image
      }
      if (disposed || !host) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      } catch {
        return; // no WebGL on this device
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, 1, 1, 1100);

      // A sphere turned inside-out, so we sit at its centre looking out.
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      geometry.scale(-1, 1, 1);

      const texture = new THREE.TextureLoader().load(
        src,
        () => {
          if (!disposed) setLive(true);
        },
        undefined,
        () => {
          /* texture failed — the flat image underneath stays visible */
        }
      );
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const canvas = renderer.domElement;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      canvas.style.cursor = "grab";
      // Without this the browser claims the gesture and scrolls the page
      // instead of letting us rotate — the viewer would be unusable on a
      // phone, which is where most of these visits happen.
      canvas.style.touchAction = "none";
      canvas.style.userSelect = "none";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", alt);
      host.appendChild(canvas);

      /**
       * Fit the lens to the frame. The panorama sits in a wide letterbox,
       * and a fixed vertical FOV would fan out to a fish-eye horizontally
       * on a 3:1 crop, so the horizontal sweep is what we hold constant.
       */
      const applySize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (!w || !h) return;
        const aspect = w / h;
        const hfov = THREE.MathUtils.degToRad(TARGET_HFOV_DEG);
        const vfov = 2 * Math.atan(Math.tan(hfov / 2) / aspect);
        camera.fov = THREE.MathUtils.clamp(
          THREE.MathUtils.radToDeg(vfov),
          30,
          90
        );
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      applySize();

      // Look direction in degrees. setFromSphericalCoords puts theta=0 on
      // +Z, so this opens on the ocean side rather than mid-frame.
      let lon = 90;
      let lat = 0;
      let pointerDown = false;
      let startX = 0;
      let startY = 0;
      let startLon = 0;
      let startLat = 0;
      let visible = true;
      let frame = 0;

      const target = new THREE.Vector3();

      const render = () => {
        if (!pointerDown && !reduceRef.current) lon += 0.02;
        const phi = THREE.MathUtils.degToRad(90 - lat);
        const theta = THREE.MathUtils.degToRad(lon);
        target.setFromSphericalCoords(500, phi, theta);
        camera.lookAt(target);
        renderer.render(scene, camera);
      };

      const loop = () => {
        frame = requestAnimationFrame(loop);
        if (visible) render();
      };

      const onPointerDown = (e: PointerEvent) => {
        pointerDown = true;
        startX = e.clientX;
        startY = e.clientY;
        startLon = lon;
        startLat = lat;
        canvas.style.cursor = "grabbing";
        canvas.setPointerCapture(e.pointerId);
        setDragged(true);
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!pointerDown) return;
        lon = startLon - (e.clientX - startX) * 0.12;
        lat = THREE.MathUtils.clamp(
          startLat + (e.clientY - startY) * 0.12,
          -80,
          80
        );
      };
      const onPointerUp = (e: PointerEvent) => {
        pointerDown = false;
        canvas.style.cursor = "grab";
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {
          /* pointer was already released */
        }
      };

      canvas.addEventListener("pointerdown", onPointerDown);
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerup", onPointerUp);
      canvas.addEventListener("pointercancel", onPointerUp);

      const resizeObserver = new ResizeObserver(applySize);
      resizeObserver.observe(host);

      // Idle while off-screen: no rendering, no battery drain.
      const visibilityObserver = new IntersectionObserver(
        (entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
        },
        { rootMargin: "100px" }
      );
      visibilityObserver.observe(host);

      const dispose = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointermove", onPointerMove);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointercancel", onPointerUp);
        canvas.remove();
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
      };

      // Unmounted while three.js was still loading: clean up right away,
      // because the effect's cleanup already ran and will not run again.
      if (disposed) {
        dispose();
        return;
      }

      teardown = dispose;
      loop();
    }

    // Only build the viewer once the panorama is nearly on screen.
    const trigger = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        trigger.disconnect();
        void start();
      },
      { rootMargin: "300px" }
    );
    trigger.observe(host);

    return () => {
      disposed = true;
      trigger.disconnect();
      teardown?.();
    };
  }, [src, alt]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Flat frame: the instant placeholder, and the permanent fallback
          when three.js or WebGL is unavailable. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flatSrc}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          live ? "opacity-0" : "opacity-100"
        }`}
        loading="lazy"
        decoding="async"
      />
      <div ref={hostRef} className="absolute inset-0 h-full w-full" />

      {live && !dragged && (
        <span className="pointer-events-none absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-ivory/25 bg-night/55 px-4 py-1.5 text-[11px] tracking-[0.14em] text-ivory/90 uppercase backdrop-blur-sm">
          {hint}
        </span>
      )}
    </div>
  );
}
