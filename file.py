from pathlib import Path
from shutil import copy2
from tempfile import mkdtemp

cards = (
    ("homes/ExploreHomesClient.tsx", "project", 36),
    ("models-page/OtherModelsCarousel.tsx", "item", 20),
)

updates = {}
for filename, model, spaces in cards:
    path = Path("src/components") / filename
    if not path.is_file():
        raise SystemExit("Run this from the Next.js project root.")

    source = path.read_text(encoding="utf-8")
    indent = " " * spaces
    before = f"{indent}captionText={{{model}.name}}\n{indent}showTooltip={{true}}"
    after = f"{indent}showTooltip={{false}}"
    if after in source:
        continue
    if source.count(before) != 1:
        raise SystemExit(f"Could not locate the hover tooltip in {path}. No files changed.")
    updates[path] = source.replace(before, after, 1)

if not updates:
    print("The hover pills are already removed.")
    raise SystemExit(0)

backup = Path(mkdtemp(prefix=".model-hover-backup-", dir="."))
for path, source in updates.items():
    copy2(path, backup / path.name)
    path.write_text(source, encoding="utf-8")
    print(f"Updated {path}")

print(f"Originals saved to {backup}")
