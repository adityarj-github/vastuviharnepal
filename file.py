from pathlib import Path
from shutil import copy2
from tempfile import mkdtemp

folder = Path("src/components/header")
client = folder / "HeaderClient.tsx"
stylesheet = folder / "Header.module.css"

if not client.is_file() or not stylesheet.is_file():
    raise SystemExit("Run this from the Next.js project root.")

def replace(source, old, new):
    if source.count(old) != 1:
        raise SystemExit(f"Could not locate {old[:65]!r}. No files changed.")
    return source.replace(old, new, 1)

def locate(source, marker, offset=0):
    index = source.find(marker, offset)
    if index < 0:
        raise SystemExit(f"Could not locate {marker!r}. No files changed.")
    return index

tsx = client.read_text(encoding="utf-8")
css = stylesheet.read_text(encoding="utf-8")

if "styles.headerCollapsed" in tsx and ".headerCollapsed::before" in css:
    print("The header animation is already installed.")
    raise SystemExit(0)

start = locate(tsx, "export function HeaderClient(")
end = locate(tsx, "  // Close desktop dropdown", start)
tsx = tsx[:start] + '''export function HeaderClient(props: HeaderClientProps) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return <PublicHeader key={pathname} {...props} isHomePage={pathname === "/"} />;
}

function PublicHeader({ logos, links, cta, socials, isHomePage }: HeaderClientProps & { isHomePage: boolean }) {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isForceExpanded, setIsForceExpanded] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileContactOpen, setMobileContactOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    let previousY = window.scrollY;
    setIsAtTop(previousY < 80);

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY === previousY) return;
      previousY = currentY;
      const atTop = currentY < 80;
      restoreFocus.current = Boolean((atTop ? menuRef : contentRef).current?.contains(document.activeElement));
      setIsAtTop(atTop);
      setIsForceExpanded(false);
      if (!atTop) setContactOpen(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

''' + tsx[end:]

start = locate(tsx, "  const handleFloatingMenuClick")
end = locate(tsx, "  const activeLogo", start)
tsx = tsx[:start] + '''  const hideHeader = !isAtTop && !isForceExpanded && !mobileOpen;
  const showSolidBg = !isAtTop || isForceExpanded;

  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    const target = hideHeader
      ? menuRef.current?.querySelector("button")
      : contentRef.current?.querySelector("a");
    target?.focus({ preventScroll: true });
  }, [hideHeader]);

  const handleFloatingMenuClick = () => {
    restoreFocus.current = Boolean(menuRef.current?.contains(document.activeElement));
    setIsForceExpanded(true);
  };

''' + tsx[end:]

tsx = replace(tsx, "styles.headerHidden", "styles.headerCollapsed")
tsx = replace(
    tsx,
    '        <div className={`container ${styles.inner}`}>',
    '''        <div
          ref={contentRef}
          id="site-header-content"
          className={`container ${styles.inner}`}
          inert={hideHeader}
        >''',
)

start = locate(tsx, "      </header>")
end = locate(tsx, "      {/* Mobile Full-Screen Drawer */}", start)
tsx = tsx[:start] + '''        <div
          ref={menuRef}
          className={styles.floatingMenu}
          inert={!hideHeader}
        >
          <ActionButton
            text="Menu"
            icon={<MenuIcon />}
            aria-controls="site-header-content"
            aria-expanded={!hideHeader}
            onClick={handleFloatingMenuClick}
          />
        </div>
      </header>

''' + tsx[end:]

start = locate(css, ".header {")
end = locate(css, "/* Nav links when header is solid white */", start)
css = css[:start] + '''.header {
  --menu-width: 7rem;
  --menu-height: 2.7rem;
  --menu-inset: var(--content-padding);
  --header-radius: 0px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  isolation: isolate;
  border-bottom: 1px solid transparent;
}

.header::before {
  content: "";
  position: absolute;
  z-index: -1;
  inset: 0;
  pointer-events: none;
  border: 1px solid transparent;
  border-radius: var(--header-radius);
  clip-path: inset(0 round var(--header-radius));
  background-color: transparent;
  transition:
    clip-path 440ms cubic-bezier(0.22, 1, 0.36, 1) var(--collapse-delay, 0ms),
    background-color 260ms ease,
    border-color 260ms ease;
}

.headerSolid::before {
  background-color: #fff;
  border-color: rgba(1, 28, 91, 0.08);
}

.headerCollapsed {
  --collapse-delay: 80ms;
  pointer-events: none;
}

.headerCollapsed::before {
  --menu-edge: calc((100% - var(--menu-height)) / 2);
  clip-path: inset(
    var(--menu-edge) var(--menu-inset) var(--menu-edge)
    calc(100% - var(--menu-inset) - var(--menu-width)) round 999px
  );
  background-color: var(--color-primary);
  border-color: transparent;
}

''' + css[end:]

start = locate(css, ".headerHidden {")
end = locate(css, "/* Inner Page Header", start)
css = css[:start] + css[end:]
css = replace(
    css,
    ".headerInnerPage {\n  top: var(--page-margin);",
    ".headerInnerPage {\n"
    "  --header-radius: 32px;\n"
    "  --menu-inset: var(--container-pad);\n"
    "  top: var(--page-margin);",
)

start = locate(css, ".headerInnerPage.headerSolid {")
end = locate(css, "@media (max-width: 960px)", start)
css = css[:start] + '''.headerInnerPage.headerSolid {
  --header-radius: 20px;
}

''' + css[end:]

css = replace(
    css,
    "  .headerInnerPage {\n    top: 0.5rem;",
    "  .headerInnerPage {\n    --header-radius: 24px;\n    top: 0.5rem;",
)
css = replace(css, "  height: 76px;\n}", '''  height: 76px;
  opacity: 1;
  transition: opacity 180ms ease 190ms;
}

.headerCollapsed .inner {
  opacity: 0;
  transition: opacity 100ms ease;
}''')
css = replace(
    css,
    "  height: 48px;\n  width: auto;\n  object-fit: contain;",
    "  width: calc(48px * 180 / 52);\n  height: 48px;\n  object-fit: contain;",
)
css = replace(
    css,
    "  .logoImg {\n    height: 45px;",
    "  .logoImg {\n    width: calc(45px * 180 / 52);\n    height: 45px;",
)

start = locate(css, ".floatingMenu {")
end = locate(css, "/* =========================================", start)
css = css[:start] + '''.floatingMenu {
  position: absolute;
  top: 50%;
  right: var(--menu-inset);
  z-index: 1;
  width: var(--menu-width);
  height: var(--menu-height);
  transform: translateY(-50%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;
}

.floatingMenu > button {
  width: 100%;
  height: 100%;
}

.headerCollapsed .floatingMenu {
  opacity: 1;
  pointer-events: auto;
  transition-delay: 200ms;
}

@media (prefers-reduced-motion: reduce) {
  .header::before,
  .header .inner,
  .header .floatingMenu {
    transition: none;
  }
}

''' + css[end:]

css = css.rstrip() + '''

@media (max-width: 380px) {
  .inner {
    gap: 0.5rem;
  }

  .logoImg {
    width: min(37vw, 135px);
    height: auto;
    aspect-ratio: 180 / 52;
  }
}
'''

backup = Path(mkdtemp(prefix=".header-animation-backup-", dir="."))
for path, updated in ((client, tsx), (stylesheet, css)):
    saved = backup / path
    saved.parent.mkdir(parents=True, exist_ok=True)
    copy2(path, saved)
    path.write_text(updated, encoding="utf-8")
    print(f"Updated {path}")

print(f"Original files backed up in {backup}")
