#!/usr/bin/env node
/**
 * Genera el blog estático de DylanOS a partir de blog/posts.js:
 *
 *   - blog/<slug>/index.html  Página pre-renderizada de cada artículo.
 *   - blog/feed.xml           Canal RSS.
 *   - sitemap.xml             Mapa del sitio con el blog y sus artículos.
 *
 * Uso: npm run blog:build
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const posts = require(path.join(root, 'blog', 'posts.js'));

const SITE_URL = 'https://dylanoswebsite.vercel.app';
const LOGO_URL = SITE_URL + '/images/8357dd421_Screenshot_1-removebg-preview.webp';
const BLOG_TEMPLATE = path.join(root, 'blog', 'blog.html');
const DEFAULT_DESCRIPTION = 'Noticias, actualizaciones, desarrollo y novedades de DylanOS.';

const categories = {
  Noticias: 'noticias',
  Historia: 'historia',
  Desarrollo: 'desarrollo',
  Actualizaciones: 'actualizaciones',
  Tutoriales: 'tutoriales',
  Comunidad: 'comunidad',
  Releases: 'releases'
};

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
});

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function escapeXml(value) {
  return escapeHtml(value);
}

function slugify(value) {
  return String(value == null ? '' : value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categorySlug(value) {
  return categories[value] || slugify(value) || 'general';
}

function postUrl(post) {
  return `${SITE_URL}/blog/${post.slug}/`;
}

function formatDate(value) {
  return dateFormatter.format(new Date(`${value}T12:00:00Z`));
}

function readingTime(post) {
  const blocks = Array.isArray(post.content) ? post.content : [];
  const words = [post.excerpt]
    .concat(blocks.flatMap(block => {
      if (typeof block === 'string') return [block];
      if (!block || typeof block !== 'object') return [];
      return [block.heading, block.text, block.code, block.quote, block.cite].concat(Array.isArray(block.list) ? block.list : []);
    }))
    .filter(Boolean)
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / 200)) + ' min de lectura';
}

function renderBlock(block) {
  if (typeof block === 'string') {
    return `<p>${escapeHtml(block)}</p>`;
  }
  if (!block || typeof block !== 'object') return '';
  if (block.heading) {
    return `<h2>${escapeHtml(block.heading)}</h2>`;
  }
  if (Array.isArray(block.list)) {
    return `<ul>${block.list.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  }
  if (typeof block.code === 'string') {
    const lang = block.lang ? ` data-lang="${escapeHtml(block.lang)}"` : '';
    return `<pre class="blog-code"${lang}><code>${escapeHtml(block.code.trim())}</code></pre>`;
  }
  if (block.quote) {
    const cite = block.cite ? `<cite>${escapeHtml(block.cite)}</cite>` : '';
    return `<blockquote class="blog-quote"><p>${escapeHtml(block.quote)}</p>${cite}</blockquote>`;
  }
  if (block.text) {
    return `<p>${escapeHtml(block.text)}</p>`;
  }
  return '';
}

function renderContent(post) {
  return post.content.map(renderBlock).join('');
}

function renderVisual(post) {
  const visual = categorySlug(post.visual || post.category);
  const glyph = post.image ? '' : (post.glyph || '//');
  const image = post.image
    ? `<img class="post-visual__img" src="${escapeHtml(post.image)}" alt="" loading="eager" decoding="async">`
    : '';

  return (
    `<div id="post-visual" class="post-visual post-visual--${escapeHtml(visual)} blog-article__visual"` +
    ` data-glyph="${escapeHtml(glyph)}" role="img" aria-label="Portada: ${escapeHtml(post.category)}">` +
      image +
      `<span class="post-visual__tag">${escapeHtml(post.category)}</span>` +
      '<span class="post-visual__code">01</span>' +
    '</div>'
  );
}

function renderCard(post, index) {
  const url = `/blog/${post.slug}/`;
  const visual = categorySlug(post.visual || post.category);
  const glyph = post.glyph || '//';
  const image = post.image
    ? `<img class="post-visual__img" src="${escapeHtml(post.image)}" alt="" loading="lazy" decoding="async">`
    : '';

  return (
    `<article class="post-card" style="--card-index:${index}">` +
      `<div class="post-visual post-visual--${escapeHtml(visual)} post-card__visual"` +
      ` data-glyph="${escapeHtml(glyph)}" role="img" aria-label="Portada: ${escapeHtml(post.category)}">` +
        image +
        `<span class="post-visual__tag">${escapeHtml(post.category)}</span>` +
        `<span class="post-visual__code">${String(index + 1).padStart(2, '0')}</span>` +
      '</div>' +
      '<div class="post-card__body">' +
        '<div class="post-card__top">' +
          `<span class="post-category">${escapeHtml(post.category)}</span>` +
          (post.demo ? '<span class="demo-badge">Ejemplo</span>' : '') +
        '</div>' +
        `<h3 class="post-card__title"><a href="${url}">${escapeHtml(post.title)}</a></h3>` +
        `<p class="post-card__excerpt">${escapeHtml(post.excerpt)}</p>` +
        `<div class="post-card__meta"><div class="post-meta">` +
          `<span>${escapeHtml(post.author)}</span>` +
          '<span class="post-meta__sep" aria-hidden="true"></span>' +
          `<time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>` +
          '<span class="post-meta__sep" aria-hidden="true"></span>' +
          `<span>${escapeHtml(readingTime(post))}</span>` +
        '</div></div>' +
        `<a class="post-card__link" href="${url}">Leer más ` +
          '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
        '</a>' +
      '</div>' +
    '</article>'
  );
}

function renderFeatured(post) {
  if (!post) return '';
  const url = `/blog/${post.slug}/`;
  const visual = categorySlug(post.visual || post.category);
  const glyph = post.glyph || '//';
  const image = post.image
    ? `<img class="post-visual__img" src="${escapeHtml(post.image)}" alt="" loading="lazy" decoding="async">`
    : '';

  return (
    '<article class="featured-post">' +
      `<div class="post-visual post-visual--${escapeHtml(visual)} featured-post__visual"` +
      ` data-glyph="${escapeHtml(glyph)}" role="img" aria-label="Portada: ${escapeHtml(post.category)}">` +
        image +
        `<span class="post-visual__tag">${escapeHtml(post.category)}</span>` +
        '<span class="post-visual__code">01</span>' +
      '</div>' +
      '<div class="featured-post__body">' +
        '<div class="featured-post__badges">' +
          `<span class="post-category">${escapeHtml(post.category)}</span>` +
          (post.demo ? '<span class="demo-badge">Ejemplo</span>' : '') +
        '</div>' +
        `<h3 class="featured-post__title"><a href="${url}">${escapeHtml(post.title)}</a></h3>` +
        `<p class="featured-post__excerpt">${escapeHtml(post.excerpt)}</p>` +
        '<div class="post-meta">' +
          `<span>${escapeHtml(post.author)}</span>` +
          '<span class="post-meta__sep" aria-hidden="true"></span>' +
          `<time datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>` +
          '<span class="post-meta__sep" aria-hidden="true"></span>' +
          `<span>${escapeHtml(readingTime(post))}</span>` +
        '</div>' +
        `<a class="blog-btn blog-btn--primary featured-post__link" href="${url}">Leer artículo ` +
          '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
        '</a>' +
      '</div>' +
    '</article>'
  );
}

function renderFilters(archive) {
  const categories = ['Todos'].concat(Array.from(new Set(archive.map(post => post.category))));
  return categories.map(category => {
    const count = category === 'Todos'
      ? archive.length
      : archive.filter(post => post.category === category).length;
    return (
      `<button type="button" class="blog-filter" data-category="${escapeHtml(category)}" aria-pressed="${category === 'Todos'}">` +
        `${escapeHtml(category)}<span class="blog-filter__count">${count}</span>` +
      '</button>'
    );
  }).join('');
}

function renderIndex(template, sorted) {
  const featured = sorted.find(post => post.featured) || sorted[0] || null;
  const archive = sorted.filter(post => !post.featured);
  const allCategories = Array.from(new Set(sorted.map(post => post.category)));
  const countText = sorted.length === 0
    ? 'Todavía no hay publicaciones'
    : `${sorted.length} ${sorted.length === 1 ? 'publicación' : 'publicaciones'} · ` +
      `${allCategories.length} ${allCategories.length === 1 ? 'categoría' : 'categorías'} · ` +
      `${archive.length} en el archivo`;
  const statusText = `Mostrando ${archive.length} ${archive.length === 1 ? 'artículo' : 'artículos'} del archivo.`;

  let html = template;
  html = replaceOnce(html, '<div id="featured-post" class="featured-slot"></div>', `<div id="featured-post" class="featured-slot">${renderFeatured(featured)}</div>`, 'featured-post');
  html = replaceOnce(html, '<div id="blog-filters" class="blog-filters" role="group" aria-label="Filtrar artículos por categoría"></div>', `<div id="blog-filters" class="blog-filters" role="group" aria-label="Filtrar artículos por categoría">${renderFilters(archive)}</div>`, 'blog-filters');
  html = replaceOnce(html, '<div id="posts-grid" class="posts-grid"></div>', `<div id="posts-grid" class="posts-grid">${archive.map(renderCard).join('')}</div>`, 'posts-grid');
  html = replaceOnce(html, '<p class="blog-section__hint" id="posts-count">Cargando artículos…</p>', `<p class="blog-section__hint" id="posts-count">${escapeHtml(countText)}</p>`, 'posts-count');
  html = replaceOnce(html, '<p id="posts-status" class="sr-only" aria-live="polite"></p>', `<p id="posts-status" class="sr-only" aria-live="polite">${escapeHtml(statusText)}</p>`, 'posts-status');
  html = html.replace(/  <noscript>[\s\S]*?  <\/noscript>\n\n/, '');

  return html;
}

function renderRelated(post) {
  const others = posts.filter(item => item.slug !== post.slug);
  const related = others
    .filter(item => item.category === post.category)
    .concat(others.filter(item => item.category !== post.category))
    .slice(0, 2);

  if (related.length === 0) return '<div id="post-related-grid" class="posts-grid posts-grid--related"></div>';

  return '<div id="post-related-grid" class="posts-grid posts-grid--related">' +
    related.map((item, index) => {
      const url = `/blog/${item.slug}/`;
      const visual = categorySlug(item.visual || item.category);
      const glyph = item.glyph || '//';
      const image = item.image
        ? `<img class="post-visual__img" src="${escapeHtml(item.image)}" alt="" loading="lazy" decoding="async">`
        : '';

      return (
        `<article class="post-card" style="--card-index:${index}">` +
          `<div class="post-visual post-visual--${escapeHtml(visual)} post-card__visual"` +
          ` data-glyph="${escapeHtml(glyph)}" role="img" aria-label="Portada: ${escapeHtml(item.category)}">` +
            image +
            `<span class="post-visual__tag">${escapeHtml(item.category)}</span>` +
            `<span class="post-visual__code">${String(index + 1).padStart(2, '0')}</span>` +
          '</div>' +
          '<div class="post-card__body">' +
            '<div class="post-card__top">' +
              `<span class="post-category">${escapeHtml(item.category)}</span>` +
            '</div>' +
            `<h3 class="post-card__title"><a href="${url}">${escapeHtml(item.title)}</a></h3>` +
            `<p class="post-card__excerpt">${escapeHtml(item.excerpt)}</p>` +
            `<div class="post-card__meta"><div class="post-meta">` +
              `<span>${escapeHtml(item.author)}</span>` +
              '<span class="post-meta__sep" aria-hidden="true"></span>' +
              `<time datetime="${escapeHtml(item.date)}">${escapeHtml(formatDate(item.date))}</time>` +
              '<span class="post-meta__sep" aria-hidden="true"></span>' +
              `<span>${escapeHtml(readingTime(item))}</span>` +
            '</div></div>' +
            `<a class="post-card__link" href="${url}">Leer más ` +
              '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
            '</a>' +
          '</div>' +
        '</article>'
      );
    }).join('') +
  '</div>';
}

function articleJsonLd(post) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'es',
    articleSection: post.category,
    author: {
      '@type': 'Organization',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'DylanOS',
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL
      }
    },
    image: post.image ? SITE_URL + post.image : LOGO_URL,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl(post)
    },
    url: postUrl(post)
  }).replace(/</g, '\\u003c');
}

function replaceOnce(html, search, replacement, label) {
  const index = html.indexOf(search);
  if (index === -1) throw new Error(`No se encontró el marcador: ${label}`);
  if (html.indexOf(search, index + 1) !== -1) throw new Error(`Marcador duplicado: ${label}`);
  return html.slice(0, index) + replacement + html.slice(index + search.length);
}

function renderArticle(template, post) {
  const title = `${post.title} — DylanOS Blog`;
  const url = postUrl(post);
  let html = template;

  html = replaceOnce(
    html,
    '<title>DylanOS Blog — Noticias, desarrollo y comunidad</title>',
    `<title>${escapeHtml(title)}</title>`,
    'title'
  );
  html = replaceOnce(
    html,
    '<meta name="description" content="Blog oficial de DylanOS: noticias, desarrollo, actualizaciones, tutoriales, comunidad y releases del proyecto.">',
    `<meta name="description" content="${escapeHtml(post.excerpt)}">`,
    'description'
  );
  html = replaceOnce(
    html,
    '<link rel="canonical" id="canonical-link" href="https://dylanoswebsite.vercel.app/blog/">',
    `<link rel="canonical" id="canonical-link" href="${escapeHtml(url)}">`,
    'canonical'
  );
  html = replaceOnce(html, '<meta property="og:type" content="website">', '<meta property="og:type" content="article">', 'og:type');
  html = replaceOnce(html, '<meta property="og:title" content="DylanOS Blog">', `<meta property="og:title" content="${escapeHtml(title)}">`, 'og:title');
  html = replaceOnce(
    html,
    '<meta property="og:description" content="Noticias, actualizaciones, desarrollo y novedades de DylanOS.">',
    `<meta property="og:description" content="${escapeHtml(post.excerpt)}">`,
    'og:description'
  );
  html = replaceOnce(
    html,
    `<meta property="og:image" content="${LOGO_URL}">`,
    `<meta property="og:image" content="${escapeHtml(post.image ? SITE_URL + post.image : LOGO_URL)}">`,
    'og:image'
  );
  html = replaceOnce(
    html,
    '<meta property="og:url" content="https://dylanoswebsite.vercel.app/blog/">',
    `<meta property="og:url" content="${escapeHtml(url)}">`,
    'og:url'
  );
  html = replaceOnce(html, '<meta name="twitter:title" content="DylanOS Blog">', `<meta name="twitter:title" content="${escapeHtml(title)}">`, 'twitter:title');
  html = replaceOnce(
    html,
    '<meta name="twitter:description" content="Noticias, actualizaciones, desarrollo y novedades de DylanOS.">',
    `<meta name="twitter:description" content="${escapeHtml(post.excerpt)}">`,
    'twitter:description'
  );
  const jsonLdPattern = /  <script type="application\/ld\+json">[\s\S]*?  <\/script>/;
  if (!jsonLdPattern.test(html)) throw new Error('No se encontró el JSON-LD del blog.');
  html = html.replace(
    jsonLdPattern,
    `  <script type="application/ld+json" id="post-jsonld">${articleJsonLd(post)}</script>`
  );

  html = replaceOnce(
    html,
    '<section class="blog-hero" id="blog-hero"',
    '<section class="blog-hero" id="blog-hero" hidden',
    'hero'
  );
  html = replaceOnce(html, '<div id="blog-index">', '<div id="blog-index" hidden>', 'index');
  html = replaceOnce(
    html,
    '<section id="post-view" class="blog-post-view" aria-labelledby="post-title" hidden>',
    '<section id="post-view" class="blog-post-view" aria-labelledby="post-title">',
    'post-view'
  );
  html = replaceOnce(
    html,
    '<span id="post-category" class="post-category"></span>',
    `<span id="post-category" class="post-category">${escapeHtml(post.category)}</span>`,
    'post-category'
  );
  html = replaceOnce(
    html,
    '<h1 id="post-title" tabindex="-1"></h1>',
    `<h1 id="post-title" tabindex="-1">${escapeHtml(post.title)}</h1>`,
    'post-title'
  );
  html = replaceOnce(
    html,
    '<p id="post-excerpt" class="blog-article__lede"></p>',
    `<p id="post-excerpt" class="blog-article__lede">${escapeHtml(post.excerpt)}</p>`,
    'post-excerpt'
  );
  html = replaceOnce(html, '<span id="post-author"></span>', `<span id="post-author">${escapeHtml(post.author)}</span>`, 'post-author');
  html = replaceOnce(
    html,
    '<time id="post-date"></time>',
    `<time id="post-date" datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>`,
    'post-date'
  );
  html = replaceOnce(
    html,
    '<span id="post-reading-time"></span>',
    `<span id="post-reading-time">${escapeHtml(readingTime(post))}</span>`,
    'post-reading-time'
  );
  html = replaceOnce(
    html,
    '<div id="post-visual" class="blog-article__visual"></div>',
    renderVisual(post),
    'post-visual'
  );
  html = replaceOnce(
    html,
    '<div id="post-content" class="blog-article__content"></div>',
    `<div id="post-content" class="blog-article__content">${renderContent(post)}</div>`,
    'post-content'
  );
  html = replaceOnce(
    html,
    '<section id="post-related" class="blog-related" aria-labelledby="post-related-title" hidden>',
    '<section id="post-related" class="blog-related" aria-labelledby="post-related-title">',
    'post-related'
  );
  html = replaceOnce(
    html,
    '<div id="post-related-grid" class="posts-grid posts-grid--related"></div>',
    renderRelated(post),
    'post-related-grid'
  );

  html = html.replace(/  <noscript>[\s\S]*?  <\/noscript>\n\n/, '');

  html = replaceOnce(
    html,
    '</head>',
    `  <meta property="article:published_time" content="${post.date}">\n` +
    `  <meta property="article:section" content="${escapeHtml(post.category)}">\n` +
    '</head>',
    'head-close'
  );

  return html;
}

function rssDate(value) {
  const date = new Date(`${value}T12:00:00Z`);
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${dayNames[date.getUTCDay()]}, ${day} ${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()} 12:00:00 GMT`;
}

function renderFeed(sorted) {
  const items = sorted.map(post => (
    '    <item>\n' +
    `      <title>${escapeXml(post.title)}</title>\n` +
    `      <link>${postUrl(post)}</link>\n` +
    `      <guid isPermaLink="true">${postUrl(post)}</guid>\n` +
    `      <category>${escapeXml(post.category)}</category>\n` +
    `      <pubDate>${rssDate(post.date)}</pubDate>\n` +
    `      <description>${escapeXml(post.excerpt)}</description>\n` +
    '    </item>\n'
  )).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DylanOS Blog</title>
    <link>${SITE_URL}/blog/</link>
    <description>Noticias, desarrollo, actualizaciones, tutoriales, comunidad y releases de DylanOS.</description>
    <language>es</language>
    <lastBuildDate>${rssDate(sorted[0].date)}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>

${items}  </channel>
</rss>
`;
}

function renderSitemap(sorted) {
  const entries = [
    { url: `${SITE_URL}/`, lastmod: '2026-11-01', priority: '1.0' },
    { url: `${SITE_URL}/blog/`, lastmod: sorted[0].date, priority: '0.8' },
    ...sorted.map(post => ({ url: postUrl(post), lastmod: post.date, priority: '0.6' })),
    { url: `${SITE_URL}/DylanOSdocs/`, lastmod: '2026-11-01', priority: '0.9' }
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => (
  '  <url>\n' +
  `    <loc>${entry.url}</loc>\n` +
  `    <lastmod>${entry.lastmod}</lastmod>\n` +
  `    <priority>${entry.priority}</priority>\n` +
  '  </url>'
)).join('\n')}
</urlset>
`;
}

function main() {
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error('blog/posts.js no contiene publicaciones.');
  }

  const sorted = posts.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const template = fs.readFileSync(BLOG_TEMPLATE, 'utf8');

  fs.writeFileSync(path.join(root, 'blog', 'index.html'), renderIndex(template, sorted));

  for (const post of sorted) {
    const directory = path.join(root, 'blog', post.slug);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, 'index.html'), renderArticle(template, post));
  }

  fs.writeFileSync(path.join(root, 'blog', 'feed.xml'), renderFeed(sorted));
  fs.writeFileSync(path.join(root, 'sitemap.xml'), renderSitemap(sorted));

  console.log(`Blog generado: ${sorted.length} artículos, índice, feed.xml y sitemap.xml.`);
}

main();
