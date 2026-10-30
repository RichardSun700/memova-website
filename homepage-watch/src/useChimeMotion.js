import { createRef, useCallback, useLayoutEffect, useMemo, useRef } from "react";

const TAP_DISTANCE = 7;
const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
const still = () => ({ angle: 0, velocity: 0, yaw: 0, yawVelocity: 0, lift: 0, liftVelocity: 0 });
const quiet = (motion) =>
  Math.abs(motion.angle) < 0.025 && Math.abs(motion.velocity) < 0.07 &&
  Math.abs(motion.yaw) < 0.025 && Math.abs(motion.yawVelocity) < 0.08 &&
  Math.abs(motion.lift) < 0.02 && Math.abs(motion.liftVelocity) < 0.07;

function releaseCapture(drag) {
  if (!drag) return;
  try {
    if (drag.element.hasPointerCapture?.(drag.pointerId))
      drag.element.releasePointerCapture(drag.pointerId);
  } catch {
    // A detached button or a browser-cancelled gesture may already lack capture.
  }
}

/**
 * refs[i] belongs on the button (transform-origin: top center; touch-action: none).
 * Spread handlers(i) on that same button. They intentionally contain no onClick:
 * the caller handles keyboard activation through onClick when event.detail === 0.
 * pluck(i, strength = 1) only moves a chime; it never opens its note.
 */
export function useChimeMotion({ count = 3, active = true, reduced = false, onTap } = {}) {
  const total = Math.max(1, Math.floor(Number(count) || 1));
  const refs = useMemo(() => Array.from({ length: total }, () => createRef()), [total]);
  const motions = useRef(Array.from({ length: total }, still));
  const controls = useRef({ active, reduced, onTap });
  controls.current = { active, reduced, onTap };
  const dragRef = useRef(null);
  const frame = useRef(null);
  const previous = useRef(null);

  const paint = useCallback(() => {
    refs.forEach((ref, index) => {
      const node = ref.current;
      const motion = motions.current[index];
      if (!node || !motion) return;
      node.style.setProperty("--chime-angle", `${motion.angle.toFixed(3)}deg`);
      node.style.setProperty("--chime-yaw", `${motion.yaw.toFixed(3)}deg`);
      node.style.setProperty("--chime-lift", `${motion.lift.toFixed(3)}px`);
    });
  }, [refs]);

  const reset = useCallback(() => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    frame.current = null;
    previous.current = null;
    const drag = dragRef.current;
    dragRef.current = null;
    releaseCapture(drag);
    motions.current = Array.from({ length: total }, still);
    paint();
  }, [total, paint]);

  const wake = useCallback(() => {
    if (!controls.current.active || controls.current.reduced || frame.current !== null) return;
    const tick = (timestamp) => {
      frame.current = null;
      if (!controls.current.active || controls.current.reduced) {
        reset();
        return;
      }
      const dt = previous.current === null ? 1 / 60
        : Math.max(0.001, Math.min((timestamp - previous.current) / 1000, 1 / 30));
      previous.current = timestamp;
      let moving = false;
      motions.current.forEach((motion, index) => {
        // A held chime paints only when the pointer changes. Holding still does
        // not keep a RAF loop alive after the other chimes have settled.
        if (dragRef.current?.index === index) return;
        const frequency = 3.8 + index * 0.27;
        motion.velocity += (-frequency * frequency * motion.angle - (2.5 + index * 0.12) * motion.velocity) * dt;
        motion.angle += motion.velocity * dt;
        motion.yawVelocity += (-26 * motion.yaw - 5 * motion.yawVelocity) * dt;
        motion.yaw += motion.yawVelocity * dt;
        motion.liftVelocity += (-36 * motion.lift - 6 * motion.liftVelocity) * dt;
        motion.lift += motion.liftVelocity * dt;
        if (Math.abs(motion.angle) > 42) {
          motion.angle = clamp(motion.angle, 42);
          motion.velocity *= -0.12;
        }
        motion.yaw = clamp(motion.yaw, 18);
        motion.lift = clamp(motion.lift, 12);
        if (quiet(motion)) Object.assign(motion, still());
        else moving = true;
      });
      paint();
      if (moving) frame.current = window.requestAnimationFrame(tick);
      else previous.current = null;
    };
    previous.current = null;
    frame.current = window.requestAnimationFrame(tick);
  }, [paint, reset]);

  const transfer = useCallback((index, impulse) => {
    [index - 1, index + 1].forEach((neighbor) => {
      const motion = motions.current[neighbor];
      if (motion && dragRef.current?.index !== neighbor)
        motion.velocity = clamp(motion.velocity + impulse, 90);
    });
  }, []);

  const pluck = useCallback((index, strength = 1) => {
    const motion = motions.current[index];
    if (!motion || !controls.current.active || controls.current.reduced || dragRef.current?.index === index) return;
    const impulse = clamp(Number(strength) || 0, 2.5);
    motion.velocity = clamp(motion.velocity + impulse * 26, 130);
    motion.yawVelocity = clamp(motion.yawVelocity + impulse * 4, 45);
    motion.liftVelocity = clamp(motion.liftVelocity - Math.abs(impulse) * 2, 25);
    transfer(index, impulse * 2.1);
    wake();
  }, [transfer, wake]);

  useLayoutEffect(() => {
    reset();
    return reset;
  }, [reset]);
  useLayoutEffect(() => {
    if (!active || reduced) reset();
  }, [active, reduced, reset]);

  const cancel = useCallback((event, index) => {
    const drag = dragRef.current;
    if (!drag || drag.index !== index || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    releaseCapture(drag);
    const motion = motions.current[index];
    if (motion) {
      motion.velocity = 0;
      motion.yawVelocity = 0;
      motion.liftVelocity = 0;
    }
    if (!controls.current.active || controls.current.reduced) reset();
    else wake();
  }, [reset, wake]);

  const handlers = useCallback((index) => ({
    onPointerEnter(event) {
      if (event.pointerType === "touch" || dragRef.current || !motions.current[index]) return;
      const rect = event.currentTarget.getBoundingClientRect();
      pluck(index, event.clientX < rect.left + rect.width / 2 ? -0.2 : 0.2);
    },
    onPointerDown(event) {
      if (!controls.current.active || !motions.current[index] || dragRef.current || event.button !== 0 || event.isPrimary === false) return;
      event.preventDefault();
      const motion = motions.current[index];
      dragRef.current = {
        index, pointerId: event.pointerId, element: event.currentTarget,
        startX: event.clientX, startY: event.clientY,
        lastAt: performance.now(), maxDistance: 0,
        startAngle: motion.angle, startYaw: motion.yaw, startLift: motion.lift,
        velocity: 0, yawVelocity: 0, liftVelocity: 0,
      };
      motion.velocity = motion.yawVelocity = motion.liftVelocity = 0;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.focus({ preventScroll: true });
    },
    onPointerMove(event) {
      const drag = dragRef.current;
      if (!drag || drag.index !== index || drag.pointerId !== event.pointerId) return;
      if (event.cancelable) event.preventDefault();
      const dx = event.clientX - drag.startX, dy = event.clientY - drag.startY;
      drag.maxDistance = Math.max(drag.maxDistance, Math.hypot(dx, dy));
      const now = performance.now();
      const dt = Math.max(0.008, (now - drag.lastAt) / 1000);
      drag.lastAt = now;
      if (controls.current.reduced) return;
      const motion = motions.current[index];
      const angle = clamp(drag.startAngle + dx * 0.16, 30);
      const yaw = clamp(drag.startYaw + dx * 0.065 + dy * 0.035, 14);
      const lift = clamp(drag.startLift + dy * 0.06 - Math.abs(dx) * 0.012, 9);
      drag.velocity = clamp(drag.velocity * 0.55 + ((angle - motion.angle) / dt) * 0.45, 140);
      drag.yawVelocity = clamp(drag.yawVelocity * 0.55 + ((yaw - motion.yaw) / dt) * 0.45, 65);
      drag.liftVelocity = clamp(drag.liftVelocity * 0.55 + ((lift - motion.lift) / dt) * 0.45, 35);
      motion.angle = angle;
      motion.yaw = yaw;
      motion.lift = lift;
      wake();
    },
    onPointerUp(event) {
      const drag = dragRef.current;
      if (!drag || drag.index !== index || drag.pointerId !== event.pointerId) return;
      const distance = Math.max(drag.maxDistance, Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY));
      dragRef.current = null;
      releaseCapture(drag);
      if (!controls.current.active) { reset(); return; }
      if (distance < TAP_DISTANCE) {
        pluck(index, 0.65);
        controls.current.onTap?.(index);
        return;
      }
      if (controls.current.reduced) { reset(); return; }
      const motion = motions.current[index];
      const fresh = performance.now() - drag.lastAt < 100;
      motion.velocity = fresh ? drag.velocity : 0;
      motion.yawVelocity = fresh ? drag.yawVelocity : 0;
      motion.liftVelocity = fresh ? drag.liftVelocity : 0;
      transfer(index, clamp(motion.velocity * 0.08 + motion.angle * 0.12, 10));
      wake();
    },
    onPointerCancel(event) { cancel(event, index); },
    onLostPointerCapture(event) { cancel(event, index); },
  }), [cancel, pluck, reset, transfer, wake]);

  return { refs, handlers, pluck };
}
