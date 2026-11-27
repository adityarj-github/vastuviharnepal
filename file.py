from pathlib import Path
from shutil import copy2
from tempfile import mkdtemp

path = Path("src/components/gallery-page/GalleryHero3D.tsx")
if not path.is_file():
    raise SystemExit("Run this script from the project root.")

source = path.read_text(encoding="utf-8")
if "const followPointer = useRef(false);" in source and "swipeSpan" in source:
    print("The faster mobile swipe is already applied.")
    raise SystemExit(0)


def change(old, new):
    global source
    if source.count(old) != 1:
        raise SystemExit(
            f"Could not identify the gallery code near {old[:72]!r}. No files were changed."
        )
    source = source.replace(old, new, 1)


change(
    "type AngleRef = { readonly current: number };",
    """type AngleRef = { readonly current: number };
type FollowPointerRef = { current: boolean };""",
)
change(
    "function CameraRig({ targetAngle, isMobile }: {\n  targetAngle: AngleRef;",
    "function CameraRig({ targetAngle, followPointer, isMobile }: {\n"
    "  targetAngle: AngleRef;\n  followPointer: FollowPointerRef;",
)
change(
    "    const next = reducedMotion.current ? target : THREE.MathUtils.damp(",
    """    const direct = followPointer.current || reducedMotion.current;
    followPointer.current = false;
    const next = direct ? target : THREE.MathUtils.damp(""",
)
change(
    "  onSelectPhoto,\n  targetAngle,\n  isMobile,",
    "  onSelectPhoto,\n  targetAngle,\n  followPointer,\n  isMobile,",
)
change(
    "  onSelectPhoto: (item: GalleryPhotoItem) => void;\n  targetAngle: AngleRef;",
    "  onSelectPhoto: (item: GalleryPhotoItem) => void;\n"
    "  targetAngle: AngleRef;\n  followPointer: FollowPointerRef;",
)
change(
    "<CameraRig targetAngle={targetAngle} isMobile={isMobile} />",
    "<CameraRig targetAngle={targetAngle} followPointer={followPointer} isMobile={isMobile} />",
)
change(
    "  const targetAngle = useRef(0);",
    "  const targetAngle = useRef(0);\n  const followPointer = useRef(false);",
)
change(
    "  const pointer = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null);",
    """  const pointer = useRef<{
    id: number;
    x: number;
    y: number;
    dragging: boolean;
    fast: boolean;
    radiansPerPixel: number;
  } | null>(null);""",
)
change(
    "  const setAngle = useCallback((angle: number) => {",
    "  const setAngle = useCallback((angle: number, direct = false) => {",
)
change(
    "    targetAngle.current = next;\n    invalidateRef.current?.();",
    "    targetAngle.current = next;\n    followPointer.current = direct;\n    invalidateRef.current?.();",
)
change(
    """    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, dragging: false };
  }, []);""",
    """    const fast = isMobile || e.pointerType === "touch";
    // Roughly one fifth of the gallery width pans from the center to a side.
    const swipeSpan = Math.max(48, e.currentTarget.clientWidth * 0.2);
    pointer.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      dragging: false,
      fast,
      radiansPerPixel: fast ? 0.72 / swipeSpan : 0.0026,
    };
  }, [isMobile]);""",
)
change(
    "      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) {",
    """      const threshold = p.fast ? 5 : 8;
      if (Math.abs(dy) > threshold && Math.abs(dy) > Math.abs(dx)) {""",
)
change(
    "      if (Math.abs(dx) < 8) return;",
    "      if (Math.abs(dx) < threshold) return;",
)
change(
    "    setAngle(targetAngle.current + dx * (isMobile ? 0.0035 : 0.0026));\n"
    "    p.x = e.clientX;\n  }, [isMobile, setAngle]);",
    "    setAngle(targetAngle.current + dx * p.radiansPerPixel, p.fast);\n"
    "    p.x = e.clientX;\n  }, [setAngle]);",
)
change(
    """    if (pointer.current?.id !== e.pointerId) return;
    pointer.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);""",
    """    // Capture transfers from the touched canvas to this wrapper.
    if (e.type === "lostpointercapture" && e.target !== e.currentTarget) return;
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    if (e.type === "pointerup" && p.fast && p.dragging) {
      const remaining = e.clientX - p.x;
      setAngle(targetAngle.current + remaining * p.radiansPerPixel, true);
    }
    pointer.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }, [setAngle]);""",
)
change(
    "              targetAngle={targetAngle}\n              isMobile={isMobile}",
    "              targetAngle={targetAngle}\n"
    "              followPointer={followPointer}\n              isMobile={isMobile}",
)

backup = Path(mkdtemp(prefix=".gallery-swipe-backup-", dir="."))
copy2(path, backup / path.name)
path.write_text(source, encoding="utf-8")
print(f"Updated {path}. Backup saved in {backup}")
