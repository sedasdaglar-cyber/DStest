// ============================================================
// Center Parcs — Search Bar Component Builder
// Figma Plugin — run via Plugins > Development > Import plugin
// ============================================================

// ── DESIGN TOKENS ──────────────────────────────────────────
const TOKENS = {
  color: {
    surface:        { r: 1,     g: 1,     b: 1     }, // #FFFFFF
    brandPink:      { r: 0.812, g: 0.071, b: 0.349 }, // #CF1259
    brandPinkHover: { r: 0.694, g: 0.055, b: 0.298 }, // #B10E4C
    textPrimary:    { r: 0.102, g: 0.102, b: 0.102 }, // #1A1A1A
    textSecondary:  { r: 0.4,   g: 0.4,   b: 0.4   }, // #666666
    divider:        { r: 0.878, g: 0.878, b: 0.878 }, // #E0E0E0
    iconDefault:    { r: 0.2,   g: 0.2,   b: 0.2   }, // #333333
    white:          { r: 1,     g: 1,     b: 1     }, // #FFFFFF
    hoverBg:        { r: 0.97,  g: 0.97,  b: 0.97  }, // #F7F7F7
  },
  font: {
    family: "Inter",
    sizeBody:  15,
    sizeDate:  16,
    sizeLabel: 12,
    sizeCTA:   16,
    sizeClose: 20,
  },
  spacing: {
    containerHeight: 64,
    containerRadius: 40,
    sectionPaddingH: 24,
    ctaPaddingH:     44,
    iconGap:         8,
    sectionGap:      12,
    dateGap:         16,
    dateInternalGap: 2,
  },
  shadow: {
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.10 },
    offset: { x: 0, y: 4 },
    radius: 20,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  },
};

// ── SVG ICONS ──────────────────────────────────────────────
const ICONS = {
  chevronDown: `<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L6 7L11 1" stroke="#333333" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  home: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7.5L9 2L16 7.5V16H12V11H6V16H2V7.5Z" stroke="#333333" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  people: `<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="5" r="3.5" stroke="#333333" stroke-width="1.6"/>
    <path d="M2 17C2 13.134 5.134 10 9 10C12.866 10 16 13.134 16 17" stroke="#333333" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="16" cy="5" r="2.8" stroke="#333333" stroke-width="1.5"/>
    <path d="M18 10.5C19.8 11.2 21 12.9 21 17" stroke="#333333" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  arrowRight: `<svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 6H19M14 1L19 6L14 11" stroke="#333333" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  close: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L13 13M13 1L1 13" stroke="#666666" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`,
};

// ── HELPERS ────────────────────────────────────────────────
function solid(color, opacity = 1) {
  return [{ type: 'SOLID', color, opacity }];
}

function noFill() {
  return [];
}

async function loadFonts() {
  await figma.loadFontAsync({ family: TOKENS.font.family, style: "Regular" });
  await figma.loadFontAsync({ family: TOKENS.font.family, style: "Medium" });
  await figma.loadFontAsync({ family: TOKENS.font.family, style: "SemiBold" });
  await figma.loadFontAsync({ family: TOKENS.font.family, style: "Bold" });
}

function txt(content, size, style, color) {
  const t = figma.createText();
  t.characters = content;
  t.fontSize = size;
  t.fontName = { family: TOKENS.font.family, style };
  t.fills = solid(color);
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  return t;
}

function icon(svgString, name) {
  const node = figma.createNodeFromSvg(svgString);
  node.name = name;
  return node;
}

function autoFrame(name, direction = 'HORIZONTAL') {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction;
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.fills = noFill();
  f.clipsContent = false;
  return f;
}

function hStack(name, gap = 8, alignItems = 'CENTER') {
  const f = autoFrame(name, 'HORIZONTAL');
  f.itemSpacing = gap;
  f.counterAxisAlignItems = alignItems;
  f.primaryAxisAlignItems = 'CENTER';
  return f;
}

function vStack(name, gap = 4) {
  const f = autoFrame(name, 'VERTICAL');
  f.itemSpacing = gap;
  f.counterAxisAlignItems = 'MIN';
  f.primaryAxisAlignItems = 'MIN';
  return f;
}

function setHPadding(frame, h) {
  frame.paddingLeft = h;
  frame.paddingRight = h;
}

function dividerLine() {
  const d = figma.createRectangle();
  d.name = "Divider";
  d.resize(1, 36);
  d.fills = solid(TOKENS.color.divider);
  d.layoutAlign = 'INHERIT';
  d.layoutGrow = 0;
  return d;
}

// ── SECTION BUILDERS ──────────────────────────────────────

function buildDestination() {
  const section = hStack("Section/Destination", TOKENS.spacing.sectionGap);
  section.paddingTop = 0;
  section.paddingBottom = 0;
  setHPadding(section, TOKENS.spacing.sectionPaddingH);
  section.primaryAxisSizingMode = 'FIXED';
  section.counterAxisSizingMode = 'FIXED';
  section.resize(288, TOKENS.spacing.containerHeight);
  section.counterAxisAlignItems = 'CENTER';

  const label = txt("7 domaines (France)", TOKENS.font.sizeBody, "Regular", TOKENS.color.textPrimary);
  label.layoutGrow = 1;

  const chev = icon(ICONS.chevronDown, "Icon/ChevronDown");

  section.appendChild(label);
  section.appendChild(chev);
  return section;
}

function buildOccupants() {
  const section = hStack("Section/Occupants", TOKENS.spacing.iconGap);
  section.paddingTop = 0;
  section.paddingBottom = 0;
  setHPadding(section, TOKENS.spacing.sectionPaddingH);
  section.primaryAxisSizingMode = 'FIXED';
  section.counterAxisSizingMode = 'FIXED';
  section.resize(276, TOKENS.spacing.containerHeight);
  section.counterAxisAlignItems = 'CENTER';

  const homeIco  = icon(ICONS.home, "Icon/Home");
  const num1     = txt("1", TOKENS.font.sizeBody, "SemiBold", TOKENS.color.textPrimary);
  const peopleIco = icon(ICONS.people, "Icon/People");
  const persText = txt("5 personnes", TOKENS.font.sizeBody, "Regular", TOKENS.color.textPrimary);
  const chev     = icon(ICONS.chevronDown, "Icon/ChevronDown");

  // Spacer between occupant groups and chevron
  const spacer = figma.createFrame();
  spacer.name = "Spacer";
  spacer.fills = noFill();
  spacer.resize(1, 1);
  spacer.layoutGrow = 1;

  section.appendChild(homeIco);
  section.appendChild(num1);

  // Small gap before people icon
  const gap = figma.createFrame();
  gap.name = "_gap";
  gap.fills = noFill();
  gap.resize(8, 1);
  section.appendChild(gap);

  section.appendChild(peopleIco);
  section.appendChild(persText);
  section.appendChild(spacer);
  section.appendChild(chev);
  return section;
}

function buildDates(filled = true) {
  const section = hStack("Section/Dates", TOKENS.spacing.dateGap);
  section.paddingTop = 0;
  section.paddingBottom = 0;
  setHPadding(section, TOKENS.spacing.sectionPaddingH);
  section.primaryAxisSizingMode = 'FIXED';
  section.counterAxisSizingMode = 'FIXED';
  section.resize(380, TOKENS.spacing.containerHeight);
  section.counterAxisAlignItems = 'CENTER';

  if (filled) {
    // Date start
    const startStack = vStack("DateStart", TOKENS.spacing.dateInternalGap);
    startStack.appendChild(txt("29/05/26", TOKENS.font.sizeDate, "Bold", TOKENS.color.textPrimary));
    startStack.appendChild(txt("Vendredi", TOKENS.font.sizeLabel, "Regular", TOKENS.color.textSecondary));

    // Arrow
    const arrowIco = icon(ICONS.arrowRight, "Icon/ArrowRight");

    // Date end
    const endStack = vStack("DateEnd", TOKENS.spacing.dateInternalGap);
    endStack.appendChild(txt("01/06/26", TOKENS.font.sizeDate, "Bold", TOKENS.color.textPrimary));
    endStack.appendChild(txt("Lundi", TOKENS.font.sizeLabel, "Regular", TOKENS.color.textSecondary));

    // Spacer
    const spacer = figma.createFrame();
    spacer.name = "Spacer";
    spacer.fills = noFill();
    spacer.resize(1, 1);
    spacer.layoutGrow = 1;

    // Close
    const closeIco = icon(ICONS.close, "Icon/Close");

    section.appendChild(startStack);
    section.appendChild(arrowIco);
    section.appendChild(endStack);
    section.appendChild(spacer);
    section.appendChild(closeIco);
  } else {
    // Empty state — placeholder text
    const placeholder = txt("Arrivée — Départ", TOKENS.font.sizeBody, "Regular", TOKENS.color.textSecondary);
    section.appendChild(placeholder);
  }
  return section;
}

function buildCTA() {
  const section = hStack("Button/Rechercher", 0);
  section.paddingTop = 0;
  section.paddingBottom = 0;
  setHPadding(section, TOKENS.spacing.ctaPaddingH);
  section.primaryAxisSizingMode = 'AUTO';
  section.counterAxisSizingMode = 'FIXED';
  section.resize(section.width, TOKENS.spacing.containerHeight);
  section.fills = solid(TOKENS.color.brandPink);
  section.topLeftRadius = 0;
  section.bottomLeftRadius = 0;
  section.topRightRadius = TOKENS.spacing.containerRadius;
  section.bottomRightRadius = TOKENS.spacing.containerRadius;
  section.counterAxisAlignItems = 'CENTER';
  section.primaryAxisAlignItems = 'CENTER';

  const label = txt("Rechercher", TOKENS.font.sizeCTA, "Bold", TOKENS.color.white);
  section.appendChild(label);
  return section;
}

// ── COMPONENT BUILDERS ────────────────────────────────────

function buildContainer(name) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = 'HORIZONTAL';
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'FIXED';
  frame.resize(frame.width, TOKENS.spacing.containerHeight);
  frame.cornerRadius = TOKENS.spacing.containerRadius;
  frame.fills = solid(TOKENS.color.surface);
  frame.effects = [TOKENS.shadow];
  frame.clipsContent = true;
  frame.itemSpacing = 0;
  frame.paddingTop = 0;
  frame.paddingBottom = 0;
  frame.paddingLeft = 0;
  frame.paddingRight = 0;
  frame.primaryAxisAlignItems = 'MIN';
  frame.counterAxisAlignItems = 'CENTER';
  return frame;
}

// ── VARIANTS ──────────────────────────────────────────────

function buildVariantDefault() {
  const container = buildContainer("SearchBar/Default");
  container.appendChild(buildDestination());
  container.appendChild(dividerLine());
  container.appendChild(buildOccupants());
  container.appendChild(dividerLine());
  container.appendChild(buildDates(false));
  container.appendChild(buildCTA());
  return container;
}

function buildVariantWithDates() {
  const container = buildContainer("SearchBar/WithDates");
  container.appendChild(buildDestination());
  container.appendChild(dividerLine());
  container.appendChild(buildOccupants());
  container.appendChild(dividerLine());
  container.appendChild(buildDates(true));
  container.appendChild(buildCTA());
  return container;
}

function buildHoverCTA() {
  const container = buildContainer("SearchBar/HoverCTA");
  container.appendChild(buildDestination());
  container.appendChild(dividerLine());
  container.appendChild(buildOccupants());
  container.appendChild(dividerLine());
  container.appendChild(buildDates(true));

  // Darker CTA on hover
  const ctaHover = buildCTA();
  const ctaSection = ctaHover.findChild(n => n.name === "Button/Rechercher") || ctaHover;
  ctaHover.fills = solid(TOKENS.color.brandPinkHover);
  container.appendChild(ctaHover);
  return container;
}

// ── FRAME LABELS ──────────────────────────────────────────

async function addLabel(text, x, y) {
  const t = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
  t.characters = text;
  t.fontSize = 13;
  t.fontName = { family: "Inter", style: "SemiBold" };
  t.fills = solid(TOKENS.color.textSecondary);
  t.x = x;
  t.y = y;
  return t;
}

// ── MAIN ──────────────────────────────────────────────────

async function main() {
  await loadFonts();

  const page = figma.currentPage;

  // ── Showcase frame ──────────────────────────────────────
  const showcase = figma.createFrame();
  showcase.name = "🎨 Center Parcs — Search Bar";
  showcase.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.97 } }];
  showcase.layoutMode = 'VERTICAL';
  showcase.primaryAxisSizingMode = 'AUTO';
  showcase.counterAxisSizingMode = 'AUTO';
  showcase.paddingTop = 64;
  showcase.paddingBottom = 64;
  showcase.paddingLeft = 64;
  showcase.paddingRight = 64;
  showcase.itemSpacing = 48;
  showcase.cornerRadius = 16;

  // Title
  const title = figma.createText();
  title.characters = "Center Parcs — Barre de Recherche";
  title.fontSize = 24;
  title.fontName = { family: "Inter", style: "Bold" };
  title.fills = solid(TOKENS.color.textPrimary);
  showcase.appendChild(title);

  // Variant 1: Default (dates vides)
  const v1Label = figma.createText();
  v1Label.characters = "Variante 1 — Default (dates vides)";
  v1Label.fontSize = 12;
  v1Label.fontName = { family: "Inter", style: "Medium" };
  v1Label.fills = solid(TOKENS.color.textSecondary);
  showcase.appendChild(v1Label);

  const v1 = buildVariantDefault();
  showcase.appendChild(v1);

  // Variant 2: WithDates (dates remplies)
  const v2Label = figma.createText();
  v2Label.characters = "Variante 2 — WithDates (dates sélectionnées)";
  v2Label.fontSize = 12;
  v2Label.fontName = { family: "Inter", style: "Medium" };
  v2Label.fills = solid(TOKENS.color.textSecondary);
  showcase.appendChild(v2Label);

  const v2 = buildVariantWithDates();
  showcase.appendChild(v2);

  // Variant 3: Hover CTA
  const v3Label = figma.createText();
  v3Label.characters = "Variante 3 — Hover CTA";
  v3Label.fontSize = 12;
  v3Label.fontName = { family: "Inter", style: "Medium" };
  v3Label.fills = solid(TOKENS.color.textSecondary);
  showcase.appendChild(v3Label);

  const v3 = buildVariantWithDates();
  // Apply hover color to CTA
  const ctaSection = v3.findChild(n => n.name === "Button/Rechercher");
  if (ctaSection) ctaSection.fills = solid(TOKENS.color.brandPinkHover);
  showcase.appendChild(v3);

  // ── Design Tokens panel ─────────────────────────────────
  const tokenLabel = figma.createText();
  tokenLabel.characters = "── Design Tokens ──────────────────────────────";
  tokenLabel.fontSize = 12;
  tokenLabel.fontName = { family: "Inter", style: "Regular" };
  tokenLabel.fills = solid(TOKENS.color.textSecondary);
  showcase.appendChild(tokenLabel);

  const tokensFrame = figma.createFrame();
  tokensFrame.name = "DesignTokens";
  tokensFrame.layoutMode = 'HORIZONTAL';
  tokensFrame.primaryAxisSizingMode = 'AUTO';
  tokensFrame.counterAxisSizingMode = 'AUTO';
  tokensFrame.fills = noFill();
  tokensFrame.itemSpacing = 12;

  const colorEntries = [
    { name: "surface",     color: TOKENS.color.surface     },
    { name: "brandPink",   color: TOKENS.color.brandPink   },
    { name: "brandHover",  color: TOKENS.color.brandPinkHover },
    { name: "textPrimary", color: TOKENS.color.textPrimary },
    { name: "textSecond",  color: TOKENS.color.textSecondary },
    { name: "divider",     color: TOKENS.color.divider     },
  ];

  for (const entry of colorEntries) {
    const chip = figma.createFrame();
    chip.name = `color/${entry.name}`;
    chip.layoutMode = 'VERTICAL';
    chip.primaryAxisSizingMode = 'AUTO';
    chip.counterAxisSizingMode = 'FIXED';
    chip.resize(72, chip.height);
    chip.itemSpacing = 6;
    chip.fills = noFill();

    const swatch = figma.createRectangle();
    swatch.name = "swatch";
    swatch.resize(72, 40);
    swatch.cornerRadius = 8;
    swatch.fills = solid(entry.color);
    // Border for light colors
    if (entry.name === 'surface') {
      swatch.strokes = solid(TOKENS.color.divider);
      swatch.strokeWeight = 1;
    }

    const chipLabel = figma.createText();
    chipLabel.characters = entry.name;
    chipLabel.fontSize = 10;
    chipLabel.fontName = { family: "Inter", style: "Regular" };
    chipLabel.fills = solid(TOKENS.color.textSecondary);

    chip.appendChild(swatch);
    chip.appendChild(chipLabel);
    tokensFrame.appendChild(chip);
  }

  showcase.appendChild(tokensFrame);

  // ── Add to page ─────────────────────────────────────────
  page.appendChild(showcase);
  figma.viewport.scrollAndZoomIntoView([showcase]);

  figma.notify("✅ SearchBar créé — 3 variantes + design tokens", { timeout: 4000 });
  figma.closePlugin();
}

main().catch(err => {
  figma.notify("❌ " + err.message, { error: true, timeout: 6000 });
  console.error(err);
  figma.closePlugin();
});
