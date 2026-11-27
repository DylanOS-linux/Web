const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const root = join(__dirname, '../..');
const index = readFileSync(join(root, 'index.html'), 'utf8');
const admin = readFileSync(join(root, 'admin/versions/index.html'), 'utf8');
const catalogueScript = readFileSync(join(root, 'scripts/dylanos-downloads.js'), 'utf8');
const homepageBundle = readFileSync(join(root, 'scripts/index-viqq3O5v.js'), 'utf8');

test('public releases stay inside the production DylanOS shell', () => {
  assert.match(index, /styles\/index-Dy2IKqv_\.css/);
  assert.match(index, /scripts\/index-viqq3O5v\.js/);
  assert.match(index, /relative min-h-screen bg-\[#050505\] text-white overflow-x-hidden/);
  assert.match(index, /id="descargas"/);
  assert.match(index, /styles\/releases\.css/);
  assert.match(index, /scripts\/dylanos-downloads\.js/);
});

test('catalogue mounts after the official React bundle hydrates the page', () => {
  assert.match(catalogueScript, /getElementById\(['"]descargas['"]\)/);
  assert.match(catalogueScript, /addEventListener\(['"]load['"]/);
  assert.match(catalogueScript, /MutationObserver/);
  assert.match(catalogueScript, /id="releases-grid"/);
});

test('Copilot replacement shell is not loaded by the public site', () => {
  assert.doesNotMatch(index, /styles\/dylanos\.css/);
  assert.doesNotMatch(index, /scripts\/app\.js/);
  assert.doesNotMatch(index, /class="site-nav"/);
  assert.doesNotMatch(index, /class="hero"/);
});

test('release and admin styles are isolated from the production shell', () => {
  const releases = readFileSync(join(root, 'styles/releases.css'), 'utf8');
  assert.doesNotMatch(releases, /(^|[},\s])\.(hero|site-nav|section|shell)(\W|$)/m);
  assert.match(admin, /admin\/versions\/admin\.css|href="admin\.css"/);
  assert.doesNotMatch(admin, /styles\/dylanos\.css/);
});

test('experience section uses the desktop screenshot and positioned callouts', () => {
  const screenshot = 'dylanos-desktop-widgets.png';
  const altText = 'Escritorio de DylanOS con widgets de reloj, calendario y clima';
  const windowTitle = 'dylanos — escritorio';
  const sections = [
    index.slice(index.indexOf('Diseñado para sentirse diferente.'), index.indexOf('Una interfaz que desaparece cuando trabajas.')),
    homepageBundle.slice(homepageBundle.indexOf('Diseñado para sentirse diferente.'), homepageBundle.indexOf('Una interfaz que desaparece cuando trabajas.')),
  ];
  const mockupComponent = homepageBundle.slice(
    homepageBundle.indexOf('function F0('),
    homepageBundle.indexOf('const jM='),
  );

  assert.ok(sections.every(section => section.length > 0), 'experience sections should be present in both outputs');
  assert.ok(mockupComponent.includes(windowTitle), 'the screenshot frame should have a desktop title bar');
  assert.ok(existsSync(join(root, 'images', screenshot)), 'the supplied desktop screenshot should be present');
  assert.ok(sections.every(section => section.includes(screenshot)), 'both outputs should reference the supplied screenshot');
  assert.ok(sections.every(section => section.includes(altText)), 'both outputs should describe the screenshot accessibly');
  assert.match(sections[0], /glass-strong rounded-2xl border border-white\/10 p-2 shadow-2xl/);
  assert.match(mockupComponent, /glass-strong rounded-2xl border border-white\/10 p-2 shadow-2xl/);
  assert.equal((sections[0].match(/class="[^"]*absolute [^"]*glass rounded-full/g) || []).length, 3);
  assert.ok(sections.every(section => !section.includes('Interfaz moderna')));
  assert.equal((sections[0].match(/experience-breath/g) || []).length, 3);
  assert.match(homepageBundle, /duration:6,repeat:1\/0,ease:"easeInOut"/);
  assert.match(readFileSync(join(root, 'styles/experience-motion.css'), 'utf8'), /@media \(prefers-reduced-motion: reduce\) \{\s*\.experience-breath/);
  assert.match(index, /class="[^"]*\babsolute right-2 top-24/);
  assert.match(homepageBundle, /label:"Centro de control",pos:"right-2 top-24"/);
  assert.doesNotMatch(sections[0], /absolute undefined/);
});
