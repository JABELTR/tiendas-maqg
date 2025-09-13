// src/hooks/useIdleLogout.js
import { useEffect, useRef } from "react";

export default function useIdleLogout(onIdle, ms = 15 * 60 * 1000) {
  const timer = useRef(null);

  useEffect(() => {
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(onIdle, ms);
    };
    const evts = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    evts.forEach(e => window.addEventListener(e, reset));
    reset();
    return () => {
      evts.forEach(e => window.removeEventListener(e, reset));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [onIdle, ms]);
}
