'use strict';

const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { handleRequest } = require('../../server');
const posts = require('../../blog/posts.js');

const root = path.join(__dirname, '..', '..');
const validCategories = new Set([
  'Noticias',
  'Historia',
  'Desarrollo',
  'Actualizaciones',
  'Tutoriales',
  'Comunidad',
  'Releases'
]);

function dispatch(pathname) {
  return new Promise((resolve, reject) => {
    const req = new EventEmitter();
    req.url = pathname;
    req.method = 'GET';
    req.socket = { remoteAddress: '127.0.0.1' };

    const res = {
      statusCode: null,
      headers: {},
      writeHead(statusCode, headers = {}) {
        this.statusCode = statusCode;
        this.headers = headers;
      },
      end(body = '') {
        resolve({ statusCode: this.statusCode, headers: this.headers, body: String(body) });
      }
    };

    try {
      handleRequest(req, res);
    } catch (error) {
      reject(error);
    }
  });
}

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

test('los artículos tienen slugs únicos, categorías válidas y contenido real', () => {
  assert.ok(posts.length >= 7, 'el blog debe tener publicaciones');

  const slugs = new Set();
  for (const post of posts) {
    assert.match(post.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `slug inválido: ${post.slug}`);
    assert.equal(slugs.has(post.slug), false, `slug duplicado: ${post.slug}`);
    slugs.add(post.slug);

    assert.ok(post.title && post.title.length > 3, 'título obligatorio');
    assert.ok(post.excerpt && post.excerpt.length > 10, 'resumen obligatorio');
    assert.ok(validCategories.has(post.category), `categoría inválida: ${post.category}`);
    assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/, `fecha inválida: ${post.date}`);
    assert.equal(Number.isNaN(Date.parse(post.date + 'T12:00:00Z')), false, `fecha inválida: ${post.date}`);
    assert.equal(post.demo, undefined, `el contenido publicado no debe ser de ejemplo: ${post.slug}`);
    assert.ok(Array.isArray(post.content) && post.content.length > 0, `contenido obligatorio: ${post.slug}`);
  }

  const featured = posts.filter(post => post.featured);
  assert.equal(featured.length, 1, 'debe existir exactamente un artículo destacado');
});

test('feed y sitemap incluyen todas las publicaciones', () => {
  const feed = read('blog/feed.xml');
  const sitemap = read('sitemap.xml');

  for (const post of posts) {
    const url = `https://dylanoswebsite.vercel.app/blog/${post.slug}/`;
    assert.ok(feed.includes(url), `falta ${post.slug} en feed.xml`);
    assert.ok(sitemap.includes(url), `falta ${post.slug} en sitemap.xml`);
    assert.ok(feed.includes(post.title), `falta el título de ${post.slug} en feed.xml`);
  }
});

test('la portada del blog también está prerenderizada', () => {
  const file = 'blog/index.html';
  assert.ok(fs.existsSync(path.join(root, file)), `falta ${file}`);

  const html = read(file);
  const featured = posts.find(post => post.featured) || posts[0];
  const archive = posts.filter(post => !post.featured);

  assert.ok(html.includes(featured.title), 'falta el artículo destacado');
  assert.equal((html.match(/class="post-card"/g) || []).length, archive.length);
  assert.ok(html.includes('<div id="featured-post" class="featured-slot"><article class="featured-post">'));
  assert.ok(html.includes(`${posts.length} publicaciones`));
  assert.ok(!html.includes('<noscript>'), 'la portada generada no necesita el aviso de JavaScript');
});

test('cada artículo tiene una página estática con metadatos y contenido', () => {
  for (const post of posts) {
    const file = `blog/${post.slug}/index.html`;
    assert.ok(fs.existsSync(path.join(root, file)), `falta ${file}`);

    const html = read(file);
    assert.ok(html.includes(`<title>${post.title} — DylanOS Blog</title>`), `título incorrecto en ${file}`);
    assert.ok(html.includes(`href="https://dylanoswebsite.vercel.app/blog/${post.slug}/"`), `canonical incorrecta en ${file}`);
    assert.ok(html.includes('<meta property="og:type" content="article">'), `og:type incorrecto en ${file}`);
    assert.ok(html.includes('<meta property="og:image" content="https://dylanoswebsite.vercel.app/'), `og:image incorrecta en ${file}`);
    assert.ok(html.includes('id="post-jsonld"'), `falta JSON-LD en ${file}`);
    assert.ok(html.includes(`<h1 id="post-title" tabindex="-1">${post.title}</h1>`), `falta el título visible en ${file}`);
    assert.ok(html.includes('id="post-content" class="blog-article__content"><p>'), `falta el contenido en ${file}`);
    assert.ok(html.includes('<div id="blog-index" hidden>'), `no se oculta el listado en ${file}`);
    assert.ok(!html.includes('<section id="post-view" class="blog-post-view" aria-labelledby="post-title" hidden>'), `la vista de artículo sigue oculta en ${file}`);
  }
});

test('la página carga el contenido antes que el render y declara RSS y canonical', () => {
  const html = read('blog/blog.html');

  assert.ok(html.indexOf('src="./posts.js"') > -1);
  assert.ok(html.indexOf('src="./posts.js"') < html.indexOf('src="./blog.js"'));
  assert.match(html, /id="canonical-link"/);
  assert.match(html, /rel="alternate"[^>]+feed\.xml/);
  assert.match(html, /id="post-related"/);
});

test('el servidor sirve índices, artículos y recursos del blog', async () => {
  const index = await dispatch('/blog/');
  assert.equal(index.statusCode, 200);
  assert.match(index.headers['Content-Type'], /text\/html/);
  assert.match(index.body, /posts\.js/);
  assert.ok(index.body.includes(posts.find(post => post.featured).title), 'la portada servida debe estar prerenderizada');

  const slug = posts[0].slug;
  const article = await dispatch(`/blog/${slug}/`);
  assert.equal(article.statusCode, 200);
  assert.match(article.headers['Content-Type'], /text\/html/);
  assert.ok(article.body.includes(posts[0].title), 'el artículo servido debe estar prerenderizado');
  assert.ok(article.body.includes('<meta property="og:type" content="article">'));

  const redirect = await dispatch(`/blog/${slug}`);
  assert.equal(redirect.statusCode, 301);
  assert.equal(redirect.headers.Location, `/blog/${slug}/`);

  const script = await dispatch('/blog/posts.js');
  assert.equal(script.statusCode, 200);
  assert.match(script.headers['Content-Type'], /javascript/);

  const styles = await dispatch('/blog/blog.css');
  assert.equal(styles.statusCode, 200);
  assert.match(styles.headers['Content-Type'], /text\/css/);

  const feed = await dispatch('/blog/feed.xml');
  assert.equal(feed.statusCode, 200);
  assert.match(feed.headers['Content-Type'], /xml/);
});

test('las rutas de artículo no permiten traversal', async () => {
  const response = await dispatch('/blog/%2E%2E/server.js');
  assert.equal(response.statusCode, 404);

  const hidden = await dispatch('/blog/.env');
  assert.equal(hidden.statusCode, 404);
});
