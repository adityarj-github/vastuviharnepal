from pathlib import Path
from shutil import copy2
from tempfile import mkdtemp

root = Path("src/components")
updates = {}


def edit(filename, before, after):
    path = root / filename
    if not path.is_file():
        raise SystemExit(f"Missing {path}. Run from the project root after the model card updates.")

    source = updates.get(path, path.read_text(encoding="utf-8"))
    if after in source:
        return
    if source.count(before) != 1:
        raise SystemExit(f"Could not locate {before[:80]!r} in {path}. No files changed.")

    updates[path] = source.replace(before, after, 1)


home = "homes/ExploreHomes.module.css"

for filename, metadata in (
    ("models-page/ModelsGrid.module.css", "meta"),
    (home, "meta"),
    ("models-page/OtherModelsCarousel.module.css", "cardBody"),
):
    edit(filename, "  grid-template-rows: auto 1fr;", "  grid-template-rows: 1fr auto;")
    edit(filename, '  content: "";\n  grid-area: 2 / 1;', '  content: "";\n  grid-area: 1 / 1;')
    edit(filename, f".{metadata} {{\n  grid-area: 1 / 1;", f".{metadata} {{\n  grid-area: 2 / 1;")
    edit(
        filename,
        "  inset: 0 0 -2.35rem;\n  background: linear-gradient(\n    to bottom,",
        "  inset: -2.35rem 0 0;\n  background: linear-gradient(\n    to top,",
    )
    edit(
        filename,
        ".cardInner .badge {\n  top: auto;\n  bottom: 14px;",
        ".cardInner .badge {\n  top: 14px;\n  bottom: auto;",
    )

edit(
    home,
    "  grid-area: 1 / 1;\n  width: 100%;\n  aspect-ratio: 4 / 4.6;",
    "  grid-area: 1 / 1;\n  width: 100%;\n  aspect-ratio: 4 / 3.35;",
)

image = "models-page/ModelCardImage.tsx"
edit(
    image,
    "  const pointer = useRef({ x: 0, y: 0 });",
    """  const pointer = useRef({ x: 0, y: 0 });
  const lens = useRef<{ x: number; y: number } | null>(null);
  const lastFrame = useRef(0);""",
)

path = root / image
source = updates.get(path, path.read_text(encoding="utf-8"))
if "function drawLens(now: number)" not in source:
    start = source.find("  function move(")
    end = source.find("  return (", start)
    if start < 0 or end < 0:
        raise SystemExit("Could not find the existing model card hover. No files changed.")

    updates[path] = source[:start] + '''  function drawLens(now: number) {
    frame.current = 0;
    const photo = image.current;
    const layer = surface.current;
    if (!photo?.complete || !photo.naturalWidth || !layer || !zoomPreference?.matches) return;

    const bounds = layer.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const target = pointer.current;
    const previous = lens.current ?? target;
    const dx = target.x - previous.x;
    const dy = target.y - previous.y;
    const distance = Math.hypot(dx, dy);
    const settled = distance < 0.75;
    const elapsed = lastFrame.current ? Math.min(now - lastFrame.current, 32) : 16;
    const follow = 1 - Math.exp(-elapsed / 58);
    const center = settled ? target : { x: previous.x + dx * follow, y: previous.y + dy * follow };
    lens.current = center;

    const source = photo.currentSrc || photo.src;
    if (source !== zoomSource.current) {
      layer.style.setProperty("--card-zoom-source", `url(${JSON.stringify(source)})`);
      zoomSource.current = source;
    }

    const x = center.x - bounds.left;
    const y = center.y - bounds.top;
    const radiusX = Math.min(88, bounds.width * 0.195);
    const radiusY = Math.min(78, bounds.height * 0.22);
    const stretch = settled ? 0 : Math.min(1, distance / 85);
    const tailX = Math.max(-22, Math.min(22, dx * 0.22));
    const tailY = Math.max(-18, Math.min(18, dy * 0.22));

    layer.style.setProperty("--card-zoom-x", `${x}px`);
    layer.style.setProperty("--card-zoom-y", `${y}px`);
    layer.style.setProperty("--card-zoom-rx", `${radiusX + Math.min(radiusX * 0.24, Math.abs(dx) * 0.15)}px`);
    layer.style.setProperty("--card-zoom-ry", `${radiusY + Math.min(radiusY * 0.24, Math.abs(dy) * 0.15)}px`);
    layer.style.setProperty("--card-tail-x", `${x - tailX}px`);
    layer.style.setProperty("--card-tail-y", `${y - tailY}px`);
    layer.style.setProperty("--card-tail-rx", `${radiusX * stretch * 0.76}px`);
    layer.style.setProperty("--card-tail-ry", `${radiusY * stretch * 0.68}px`);
    layer.style.setProperty("--card-zoom-scale", String(1.15 + stretch * 0.045));
    if (!layer.hasAttribute("data-card-zoom")) layer.setAttribute("data-card-zoom", "");

    lastFrame.current = settled ? 0 : now;
    if (!settled) frame.current = requestAnimationFrame(drawLens);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    zoomPreference ??= window.matchMedia(zoomMedia);
    if (!zoomPreference.matches) return;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (!frame.current) frame.current = requestAnimationFrame(drawLens);
  }

  function stop() {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    lastFrame.current = 0;
    lens.current = null;
    surface.current?.removeAttribute("data-card-zoom");
  }

''' + source[end:]

css = "models-page/ModelCardImage.module.css"
path = root / css
source = path.read_text(encoding="utf-8")
if "--card-tail-x" not in source:
    start = source.find("      mask-image: radial-gradient(")
    end = source.find("      transition: opacity", start)
    if start < 0 or end < 0:
        raise SystemExit("Could not find the existing zoom mask. No files changed.")

    updates[path] = source[:start] + '''      mask-image:
        radial-gradient(
          ellipse var(--card-zoom-rx, 19.5%) var(--card-zoom-ry, 22%)
          at var(--card-zoom-x, 50%) var(--card-zoom-y, 50%),
          #000 20%,
          rgb(0 0 0 / 0.95) 36%,
          rgb(0 0 0 / 0.56) 62%,
          rgb(0 0 0 / 0.16) 84%,
          transparent 100%
        ),
        radial-gradient(
          ellipse var(--card-tail-rx, 0px) var(--card-tail-ry, 0px)
          at var(--card-tail-x, 50%) var(--card-tail-y, 50%),
          rgb(0 0 0 / 0.63), transparent 100%
        );
''' + source[end:]

edit(
    css,
    "      transform: scale(1.19);",
    "      transform: scale(var(--card-zoom-scale, 1.15));",
)

if not updates:
    print("The model card refinements are already installed.")
    raise SystemExit(0)

backup = Path(mkdtemp(prefix=".model-card-refinement-backup-", dir="."))
for path in updates:
    saved = backup / path
    saved.parent.mkdir(parents=True, exist_ok=True)
    copy2(path, saved)

for path, contents in updates.items():
    path.write_text(contents, encoding="utf-8")
    print(f"Updated {path}")

print(f"Originals saved to {backup}")
