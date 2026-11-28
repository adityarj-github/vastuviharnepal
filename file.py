from pathlib import Path

folder = Path("src/components/homes")
client = folder / "ExploreHomesClient.tsx"
showcase = folder / "ExploreHomesShowcase.tsx"
stylesheet = folder / "ExploreHomes.module.css"

if not all(path.is_file() for path in (client, showcase, stylesheet)):
    raise SystemExit("Run this from the project root after the home model carousel updates.")

intro = '''
    useEffect(() => {
        const section = sectionRef.current;
        const rail = gridRef.current;
        const stage = section?.querySelector<HTMLElement>("#home-model-showcase");
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (!section || !rail || reduceMotion.matches ||
            !("IntersectionObserver" in window) || !Element.prototype.animate) return;

        const rows = stage ? [rail, stage] : [rail];
        const animations = new Set<Animation>();
        const timing = { easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" } as const;

        function cancelAnimations() {
            animations.forEach((animation) => animation.cancel());
            animations.clear();
        }

        function track(animation: Animation) {
            animations.add(animation);
            animation.onfinish = animation.oncancel = () => { animations.delete(animation); };
        }

        const observer = new IntersectionObserver((entries) => {
            for (const { target, intersectionRatio } of entries) {
                if (intersectionRatio < .35) continue;
                observer.unobserve(target);
                target.removeAttribute("data-model-intro-pending");

                const center = target.querySelector<HTMLElement>(
                    target === rail ? '[data-rail-side="active"]' : '[data-slot="0"]'
                );
                if (!center || reduceMotion.matches || target.contains(document.activeElement)) continue;

                const centerBox = center.getBoundingClientRect();
                const neighbors = target === rail
                    ? [center.previousElementSibling, center.nextElementSibling]
                    : Array.from(target.children).filter((card) => card !== center);

                // Read every position before starting any animation.
                const sides = neighbors.flatMap((card) => {
                    if (!card) return [];
                    const box = card.getBoundingClientRect();
                    const offset = (centerBox.left + centerBox.right - box.left - box.right) / 2;
                    return [{ card, offset }];
                });

                track(center.animate([
                    { opacity: 0, scale: ".9", translate: "0 14px" },
                    { opacity: 1, scale: "1", translate: "0 0" },
                ], { ...timing, id: "home-model-center", duration: 400 }));

                for (const { card, offset } of sides) {
                    track(card.animate([
                        { opacity: 0, translate: \`\${offset}px 0\`, scale: ".88" },
                        { opacity: 1, translate: "0 0", scale: "1" },
                    ], { ...timing, id: "home-model-side", duration: 620, delay: 400 }));
                }
            }
        }, { threshold: .35 });

        rows.forEach((row) => {
            const bounds = row.getBoundingClientRect();
            if (bounds.top >= window.innerHeight || bounds.width === 0) {
                row.setAttribute("data-model-intro-pending", "");
            }
            observer.observe(row);
        });

        const clearPending = () => rows.forEach((row) => row.removeAttribute("data-model-intro-pending"));
        const onPreferenceChange = () => {
            if (!reduceMotion.matches) return;
            observer.disconnect();
            cancelAnimations();
            clearPending();
        };

        section.addEventListener("pointerdown", cancelAnimations, { passive: true });
        section.addEventListener("focusin", cancelAnimations);
        reduceMotion.addEventListener("change", onPreferenceChange);
        return () => {
            observer.disconnect();
            section.removeEventListener("pointerdown", cancelAnimations);
            section.removeEventListener("focusin", cancelAnimations);
            reduceMotion.removeEventListener("change", onPreferenceChange);
            cancelAnimations();
            clearPending();
        };
    }, []);
'''.replace("\\`", "`").replace("\\$", "$")

intro_css = '''
.grid .card[data-rail-side="active"] {
    z-index: 2;
}

@media (prefers-reduced-motion: no-preference) {
    .stage[data-model-intro-pending]:not(:focus-within) > article,
    .grid[data-model-intro-pending]:not(:focus-within) > article {
        opacity: 0;
    }
}

@media (max-width: 820px) {
    .section {
        background: transparent;
        padding: 0;
    }

    .section .content {
        max-width: none;
        margin-inline: 0;
        padding-inline: 0;
    }

    .compactModels { width: 100%; }

    .compactModels .grid { padding-block: 0; }
}
'''

try:
    tsx = client.read_text(encoding="utf-8")
    if "home-model-center" not in tsx:
        start = tsx.index(
            '    useEffect(() => {\n'
            '        const grid = gridRef.current;\n'
            '        if (!grid || !("IntersectionObserver" in window)) return;'
        )
        end = tsx.index("    }, []);", start) + len("    }, []);")
        tsx = tsx[:start] + intro.strip("\n") + tsx[end:]

    wide = showcase.read_text(encoding="utf-8")
    wide = wide.replace(
        'className={styles.showcase} data-site-reveal="group"',
        'className={styles.showcase}',
        1,
    )

    css = stylesheet.read_text(encoding="utf-8")
    if intro_css not in css:
        start = css.index("@media (max-width: 1120px) and (prefers-reduced-motion: no-preference) {")
        end = css.index("\n.compactModels {", start)
        css = css[:start] + css[end + 1:]
        css = css.rstrip() + "\n" + intro_css
except (OSError, ValueError) as error:
    raise SystemExit(f"No project files changed. {error}") from error

for path, source in ((client, tsx), (showcase, wide), (stylesheet, css)):
    if path.read_text(encoding="utf-8") != source:
        path.write_text(source, encoding="utf-8")
        print(f"Updated {path}")
