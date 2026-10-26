import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();

test('1. Category horizontal scroll container exists in page.tsx with natural scroll', () => {
  const pagePath = path.join(projectRoot, 'src', 'app', 'page.tsx');
  assert.ok(fs.existsSync(pagePath), 'page.tsx must exist');

  const content = fs.readFileSync(pagePath, 'utf8');

  // Verify horizontal scroll classes and single-row alignment
  assert.match(content, /overflow-x-auto/, 'Must use overflow-x-auto for horizontal scrolling');
  assert.match(content, /whitespace-nowrap/, 'Categories must not wrap to new lines');
  assert.match(content, /no-scrollbar/, 'Must hide ugly scrollbars');
  assert.match(content, /handleMouseDown/, 'Must support drag-to-scroll on desktop');
});

test('2. Categories have dedicated luxury icons and PROMOTION is styled with high-tech badge', () => {
  const pagePath = path.join(projectRoot, 'src', 'app', 'page.tsx');
  const content = fs.readFileSync(pagePath, 'utf8');

  // Verify categories array contains icons
  assert.match(content, /Crown/, 'Tous category must use Crown icon');
  assert.match(content, /Smartphone/, 'Phones category must use Smartphone icon');
  assert.match(content, /Laptop/, 'Computers category must use Laptop icon');
  assert.match(content, /Flame/, 'Promotion category must use Flame icon');
  assert.match(content, /data-cat-id/, 'Buttons must have data-cat-id for programmatic auto-centering');
});

test('3. CSS utilities support invisible scrollbars for sleek aesthetics', () => {
  const cssPath = path.join(projectRoot, 'src', 'app', 'globals.css');
  const content = fs.readFileSync(cssPath, 'utf8');

  assert.match(content, /\.no-scrollbar/, 'globals.css must define .no-scrollbar utility');
  assert.match(content, /scrollbar-width:\s*none/, 'Must specify scrollbar-width: none');
});
