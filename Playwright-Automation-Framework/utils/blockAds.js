const AD_PATTERNS = [
  '**/*googlesyndication*/**',
  '**/*doubleclick*/**',
  '**/*googleadservices*/**',
  '**/*google-analytics*/**',
  '**/*googletagmanager*/**',
  '**/*adservice*/**',
  '**/pagead/**',
  '**/*adsbygoogle*',
];

async function blockAds(context) {
  for (const pattern of AD_PATTERNS) {
    await context.route(pattern, (route) => route.abort());
  }
  // Hide any ad iframes/overlays that still render.
  await context.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent =
      'ins.adsbygoogle, iframe[id^="aswift"], iframe[src*="ads"], #ad_position_box, .google-auto-placed { display: none !important; }';
    document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));
  });
}

module.exports = { blockAds };