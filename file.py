from pathlib import Path

path = Path("src/components/common/NavyCtaCard.module.css")
if not path.is_file():
    raise SystemExit("Run this from the Vastu Vihar project root.")

before = """@media (width > 760px) {
  .art {
    translate: min(1.2vw, 1.5rem) 0.45rem;
  }
}"""

after = """@media (width > 760px) {
  .art {
    justify-self: end;
    margin-inline-end: -10px;
    translate: 0 0.45rem;
  }
}"""

css = path.read_text(encoding="utf-8")
if after in css:
    print("The image is already right-aligned.")
elif css.count(before) != 1:
    raise SystemExit("Could not find the desktop image rule. No changes saved.")
else:
    path.write_text(css.replace(before, after, 1), encoding="utf-8")
    print(f"Updated {path}")
