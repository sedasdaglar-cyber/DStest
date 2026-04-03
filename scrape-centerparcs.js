const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
  });
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Navigating to centerparcs.fr...');
  await page.goto('https://www.centerparcs.fr/', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  // Accept cookies if present
  try {
    await page.click('[id*="accept"], [class*="accept"], button:has-text("Accepter"), button:has-text("Tout accepter")', { timeout: 5000 });
    await page.waitForTimeout(1000);
  } catch (e) {
    console.log('No cookie banner or already dismissed');
  }

  // Full page screenshot
  await page.screenshot({ path: '/home/user/DStest/screenshot-full.png', fullPage: false });
  console.log('Full screenshot saved');

  // Find the search bar component
  // Look for the search/booking bar
  const searchSelectors = [
    '[class*="search"]',
    '[class*="Search"]',
    '[class*="booking"]',
    '[class*="Booking"]',
    'form',
    '[class*="hero"]',
    '[class*="Hero"]',
  ];

  let searchBar = null;
  for (const sel of searchSelectors) {
    try {
      const els = await page.$$(sel);
      for (const el of els) {
        const bbox = await el.boundingBox();
        if (bbox && bbox.width > 400 && bbox.height < 200 && bbox.height > 40) {
          searchBar = el;
          console.log(`Found search bar with selector: ${sel}, bbox:`, bbox);
          break;
        }
      }
      if (searchBar) break;
    } catch (e) {}
  }

  if (searchBar) {
    const bbox = await searchBar.boundingBox();
    // Screenshot the search bar area with some padding
    await page.screenshot({
      path: '/home/user/DStest/screenshot-searchbar.png',
      clip: {
        x: Math.max(0, bbox.x - 20),
        y: Math.max(0, bbox.y - 20),
        width: bbox.width + 40,
        height: bbox.height + 40
      }
    });
    console.log('Search bar screenshot saved');

    // Extract CSS styles
    const styles = await page.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        rect,
        backgroundColor: computed.backgroundColor,
        borderRadius: computed.borderRadius,
        border: computed.border,
        boxShadow: computed.boxShadow,
        padding: computed.padding,
        height: computed.height,
        width: computed.width,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        innerHTML: el.innerHTML.substring(0, 3000)
      };
    }, searchBar);

    console.log('=== SEARCH BAR STYLES ===');
    console.log(JSON.stringify(styles, null, 2));
  }

  // Also try to get detailed info by analyzing the visual search component
  // Extract all text visible in the search area
  const pageContent = await page.evaluate(() => {
    // Look for elements containing "domaines", "personnes", "Rechercher"
    const allElements = document.querySelectorAll('*');
    const results = [];
    for (const el of allElements) {
      const text = el.textContent.trim();
      if (
        (text.includes('domaines') || text.includes('personnes') || text.includes('Rechercher')) &&
        text.length < 500 &&
        el.children.length < 20
      ) {
        const computed = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          results.push({
            tag: el.tagName,
            className: el.className,
            id: el.id,
            text: text.substring(0, 200),
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            styles: {
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              fontFamily: computed.fontFamily,
              fontSize: computed.fontSize,
              fontWeight: computed.fontWeight,
              borderRadius: computed.borderRadius,
              padding: computed.padding,
              border: computed.border,
              boxShadow: computed.boxShadow,
              display: computed.display,
              gap: computed.gap,
              alignItems: computed.alignItems
            }
          });
        }
      }
    }
    return results;
  });

  console.log('\n=== ELEMENTS WITH SEARCH CONTENT ===');
  console.log(JSON.stringify(pageContent.slice(0, 20), null, 2));

  // Extract the search widget container and all its children styles
  const searchWidgetData = await page.evaluate(() => {
    // Try to find the search bar container by looking for the pink button
    const buttons = document.querySelectorAll('button, a, [role="button"]');
    let searchContainer = null;

    for (const btn of buttons) {
      const text = btn.textContent.trim();
      if (text.includes('Rechercher') || text.includes('rechercher')) {
        // Go up the tree to find the container
        let parent = btn.parentElement;
        while (parent && parent !== document.body) {
          const rect = parent.getBoundingClientRect();
          if (rect.width > 600) {
            searchContainer = parent;
            break;
          }
          parent = parent.parentElement;
        }
        break;
      }
    }

    if (!searchContainer) return null;

    const extractStyles = (el, depth = 0) => {
      if (depth > 5) return null;
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const children = [];
      for (const child of el.children) {
        const childData = extractStyles(child, depth + 1);
        if (childData) children.push(childData);
      }
      return {
        tag: el.tagName,
        className: el.className,
        id: el.id,
        text: el.textContent.trim().substring(0, 100),
        rect: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
        styles: {
          bg: computed.backgroundColor,
          color: computed.color,
          fontFamily: computed.fontFamily,
          fontSize: computed.fontSize,
          fontWeight: computed.fontWeight,
          lineHeight: computed.lineHeight,
          letterSpacing: computed.letterSpacing,
          borderRadius: computed.borderRadius,
          border: computed.border,
          borderWidth: computed.borderWidth,
          borderColor: computed.borderColor,
          boxShadow: computed.boxShadow,
          padding: computed.padding,
          paddingTop: computed.paddingTop,
          paddingRight: computed.paddingRight,
          paddingBottom: computed.paddingBottom,
          paddingLeft: computed.paddingLeft,
          margin: computed.margin,
          display: computed.display,
          flexDirection: computed.flexDirection,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent,
          gap: computed.gap,
          width: computed.width,
          height: computed.height,
          minHeight: computed.minHeight,
          cursor: computed.cursor,
          opacity: computed.opacity
        },
        children
      };
    };

    return extractStyles(searchContainer);
  });

  console.log('\n=== SEARCH WIDGET FULL TREE ===');
  console.log(JSON.stringify(searchWidgetData, null, 2));

  await browser.close();
  console.log('\nDone!');
})();
