const reducedMotion = "(prefers-reduced-motion: reduce)";

export function motionScrollBehavior(): ScrollBehavior {
  return window.matchMedia(reducedMotion).matches ? "auto" : "smooth";
}

export function motionInterval(callback: () => void, delay: number) {
  const preference = window.matchMedia(reducedMotion);
  let timer: number | undefined;

  const sync = () => {
    window.clearInterval(timer);
    timer = preference.matches ? undefined : window.setInterval(callback, delay);
  };

  sync();
  preference.addEventListener("change", sync);
  return () => {
    preference.removeEventListener("change", sync);
    window.clearInterval(timer);
  };
}
