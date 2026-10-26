import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

test('1. Mentions Légales page file exists and contains compliant information', () => {
  const filePath = path.join(projectRoot, 'src', 'app', 'mentions-legales', 'page.tsx');
  assert.ok(fs.existsSync(filePath), 'src/app/mentions-legales/page.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Verify key legal sections and company details
  assert.match(content, /PRINCE\s+CFA/, 'Mentions légales must mention PRINCE CFA');
  assert.match(content, /Ouagadougou/, 'Mentions légales must mention Ouagadougou');
  assert.match(content, /Koulouba/, 'Mentions légales must mention Koulouba');
  assert.match(content, /Francs CFA/i, 'Mentions légales must mention official currency Francs CFA');
  assert.match(content, /Propriété Intellectuelle/i, 'Mentions légales must have intellectual property clause');
  assert.match(content, /Hébergement/i, 'Mentions légales must mention hosting infrastructure');
  assert.match(content, /Droit Applicable/i, 'Mentions légales must mention applicable law');
});

test('2. Politique de Confidentialité page file exists and covers privacy requirements', () => {
  const filePath = path.join(projectRoot, 'src', 'app', 'politique-de-confidentialite', 'page.tsx');
  assert.ok(fs.existsSync(filePath), 'src/app/politique-de-confidentialite/page.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');

  // Verify key privacy sections
  assert.match(content, /PRINCE\s+CFA/, 'Privacy policy must mention PRINCE CFA');
  assert.match(content, /Données que nous Collectons/i, 'Privacy policy must describe collected data');
  assert.match(content, /Finalités/i, 'Privacy policy must detail processing purposes');
  assert.match(content, /Vos Droits/i, 'Privacy policy must explain user rights');
  assert.match(content, /Sécurité/i, 'Privacy policy must mention security');
  assert.match(content, /Cookies/i, 'Privacy policy must discuss cookies/storage');
  assert.match(content, /Zéro Revente/i, 'Privacy policy must pledge zero reselling of customer data');
});

test('3. Confidentialité redirect alias exists', () => {
  const filePath = path.join(projectRoot, 'src', 'app', 'confidentialite', 'page.tsx');
  assert.ok(fs.existsSync(filePath), 'src/app/confidentialite/page.tsx must exist as alias/redirect');

  const content = fs.readFileSync(filePath, 'utf8');
  assert.match(content, /politique-de-confidentialite/, 'Must redirect to /politique-de-confidentialite');
});

test('4. Legal and privacy links are integrated into footers (homepage and suivi page) and kept out of MenuDrawer', () => {
  // Main page footer
  const homeContent = fs.readFileSync(path.join(projectRoot, 'src', 'app', 'page.tsx'), 'utf8');
  assert.ok(homeContent.includes('/mentions-legales'), 'Homepage must link to /mentions-legales');
  assert.ok(homeContent.includes('/politique-de-confidentialite'), 'Homepage must link to /politique-de-confidentialite');

  // Suivi page footer
  const suiviContent = fs.readFileSync(path.join(projectRoot, 'src', 'app', 'suivi', 'page.tsx'), 'utf8');
  assert.ok(suiviContent.includes('/mentions-legales'), 'Suivi page must link to /mentions-legales');
  assert.ok(suiviContent.includes('/politique-de-confidentialite'), 'Suivi page must link to /politique-de-confidentialite');

  // Menu Drawer should NOT contain legal links per explicit user request
  const menuContent = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'MenuDrawer.jsx'), 'utf8');
  assert.ok(!menuContent.includes('/mentions-legales'), 'MenuDrawer must not link to /mentions-legales');
  assert.ok(!menuContent.includes('/politique-de-confidentialite'), 'MenuDrawer must not link to /politique-de-confidentialite');
});

test('5. A Propos page file exists, tells Prince CFA story, and is linked in MenuDrawer', () => {
  const filePath = path.join(projectRoot, 'src', 'app', 'a-propos', 'page.tsx');
  assert.ok(fs.existsSync(filePath), 'src/app/a-propos/page.tsx must exist');

  const content = fs.readFileSync(filePath, 'utf8');
  assert.match(content, /PRINCE\s+CFA/, 'A Propos must mention PRINCE CFA');
  assert.match(content, /Koulouba/, 'A Propos must mention Koulouba');
  assert.match(content, /Ouagadougou/, 'A Propos must mention Ouagadougou');
  assert.match(content, /Histoire|Origine/i, 'A Propos must tell the story');

  const menuContent = fs.readFileSync(path.join(projectRoot, 'src', 'components', 'MenuDrawer.jsx'), 'utf8');
  assert.ok(menuContent.includes('/a-propos'), 'MenuDrawer must link to /a-propos');
});
