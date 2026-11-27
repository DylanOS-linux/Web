/* ============================================================
   DylanOS Blog — render
   ------------------------------------------------------------
   El contenido vive en blog/posts.js. Este archivo se encarga
   de las portadas, los filtros, la vista de artículo, las URLs
   limpias y los metadatos de cada publicación.
   ============================================================ */

(function () {
  "use strict";

  const SITE_URL = "https://dylanoswebsite.vercel.app";
  const source = typeof window !== "undefined" && Array.isArray(window.DylanOSBlogPosts)
    ? window.DylanOSBlogPosts
    : [];

  const posts = source.slice().sort(function (a, b) {
    return String(b.date).localeCompare(String(a.date));
  });

  const categorySlugs = {
    Noticias: "noticias",
    Desarrollo: "desarrollo",
    Actualizaciones: "actualizaciones",
    Tutoriales: "tutoriales",
    Comunidad: "comunidad",
    Releases: "releases"
  };

  const dateFormatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });

  let activeCategory = "Todos";

  const arrowIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function slugify(value) {
    return String(value == null ? "" : value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getCategorySlug(category) {
    return categorySlugs[category] || slugify(category) || "general";
  }

  function postUrl(post) {
    return "/blog/" + encodeURIComponent(post.slug) + "/";
  }

  function absoluteUrl(pathname) {
    if (/^https?:\/\//i.test(pathname)) return pathname;
    return SITE_URL + (pathname.charAt(0) === "/" ? pathname : "/" + pathname);
  }

  function formatDate(value) {
    return dateFormatter.format(new Date(value + "T12:00:00Z"));
  }

  function readingTime(post) {
    const blocks = Array.isArray(post.content) ? post.content : [];
    const words = [post.excerpt]
      .concat(blocks.flatMap(function (block) {
        if (typeof block === "string") return [block];
        if (!block || typeof block !== "object") return [];
        return [block.heading, block.text, block.code, block.quote, block.cite].concat(Array.isArray(block.list) ? block.list : []);
      }))
      .filter(Boolean)
      .join(" ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    return Math.max(1, Math.round(words / 200)) + " min de lectura";
  }

  function visualMarkup(post, index, extraClass) {
    const visual = getCategorySlug(post.visual || post.category);
    const glyph = post.glyph || "//";
    const tag = '<span class="post-visual__tag">' + escapeHtml(post.category) + "</span>";
    const code = '<span class="post-visual__code">' + String(index + 1).padStart(2, "0") + "</span>";
    const classes = "post-visual" + (extraClass ? " " + extraClass : "");

    if (post.image) {
      return (
        '<div class="' + classes + '">' +
          '<img class="post-visual__img" src="' + escapeHtml(post.image) + '" alt="" loading="lazy" decoding="async">' +
          tag +
          code +
        "</div>"
      );
    }

    return (
      '<div class="' + classes + " post-visual--" + escapeHtml(visual) + '" data-glyph="' + escapeHtml(glyph) + '" role="img" aria-label="Portada: ' + escapeHtml(post.category) + '">' +
        tag +
        code +
      "</div>"
    );
  }

  function metaMarkup(post) {
    return (
      '<div class="post-meta">' +
        "<span>" + escapeHtml(post.author) + "</span>" +
        '<span class="post-meta__sep" aria-hidden="true"></span>' +
        '<time datetime="' + escapeHtml(post.date) + '">' + escapeHtml(formatDate(post.date)) + "</time>" +
        '<span class="post-meta__sep" aria-hidden="true"></span>' +
        "<span>" + escapeHtml(readingTime(post)) + "</span>" +
      "</div>"
    );
  }

  function cardMarkup(post, index) {
    const url = postUrl(post);

    return (
      '<article class="post-card" style="--card-index:' + index + '">' +
        visualMarkup(post, index, "post-card__visual") +
        '<div class="post-card__body">' +
          '<div class="post-card__top">' +
            '<span class="post-category">' + escapeHtml(post.category) + "</span>" +
            (post.demo ? '<span class="demo-badge">Ejemplo</span>' : "") +
          "</div>" +
          '<h3 class="post-card__title"><a href="' + url + '">' + escapeHtml(post.title) + "</a></h3>" +
          '<p class="post-card__excerpt">' + escapeHtml(post.excerpt) + "</p>" +
          '<div class="post-card__meta">' + metaMarkup(post) + "</div>" +
          '<a class="post-card__link" href="' + url + '">Leer más ' + arrowIcon + "</a>" +
        "</div>" +
      "</article>"
    );
  }

  function renderFeatured(post) {
    const target = document.getElementById("featured-post");
    if (!target) return;

    if (!post) {
      target.innerHTML = "";
      return;
    }

    const url = postUrl(post);

    target.innerHTML =
      '<article class="featured-post">' +
        visualMarkup(post, 0, "featured-post__visual") +
        '<div class="featured-post__body">' +
          '<div class="featured-post__badges">' +
            '<span class="post-category">' + escapeHtml(post.category) + "</span>" +
            (post.demo ? '<span class="demo-badge">Ejemplo</span>' : "") +
          "</div>" +
          '<h3 class="featured-post__title"><a href="' + url + '">' + escapeHtml(post.title) + "</a></h3>" +
          '<p class="featured-post__excerpt">' + escapeHtml(post.excerpt) + "</p>" +
          metaMarkup(post) +
          '<a class="blog-btn blog-btn--primary featured-post__link" href="' + url + '">Leer artículo ' + arrowIcon + "</a>" +
        "</div>" +
      "</article>";
  }

  function getCategories() {
    return Array.from(new Set(posts.map(function (post) {
      return post.category;
    })));
  }

  function renderFilters() {
    const filters = document.getElementById("blog-filters");
    if (!filters) return;

    const archive = posts.filter(function (post) {
      return !post.featured;
    });
    const categories = ["Todos"].concat(Array.from(new Set(archive.map(function (post) {
      return post.category;
    }))));

    filters.innerHTML = categories.map(function (category) {
      const count = category === "Todos"
        ? archive.length
        : archive.filter(function (post) {
            return post.category === category;
          }).length;

      return (
        '<button type="button" class="blog-filter" data-category="' + escapeHtml(category) + '" aria-pressed="' + (category === activeCategory) + '">' +
          escapeHtml(category) +
          '<span class="blog-filter__count">' + count + "</span>" +
        "</button>"
      );
    }).join("");
  }

  function updateFilterState() {
    const buttons = document.querySelectorAll(".blog-filter");
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.category === activeCategory));
    });
  }

  function renderPosts() {
    const grid = document.getElementById("posts-grid");
    const empty = document.getElementById("posts-empty");
    const status = document.getElementById("posts-status");
    if (!grid) return;

    const archive = posts.filter(function (post) {
      return !post.featured;
    });
    const visible = activeCategory === "Todos"
      ? archive
      : archive.filter(function (post) {
          return post.category === activeCategory;
        });

    grid.innerHTML = visible.map(cardMarkup).join("");

    if (empty) empty.hidden = visible.length > 0;
    if (status) {
      status.textContent = "Mostrando " + visible.length + " " +
        (visible.length === 1 ? "artículo" : "artículos") +
        (activeCategory === "Todos" ? " del archivo." : " de la categoría " + activeCategory + ".");
    }
  }

  function renderBlock(block) {
    if (typeof block === "string") {
      return "<p>" + escapeHtml(block) + "</p>";
    }
    if (!block || typeof block !== "object") return "";
    if (block.heading) {
      return "<h2>" + escapeHtml(block.heading) + "</h2>";
    }
    if (Array.isArray(block.list)) {
      return "<ul>" + block.list.map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") + "</ul>";
    }
    if (typeof block.code === "string") {
      const lang = block.lang ? ' data-lang="' + escapeHtml(block.lang) + '"' : "";
      return "<pre class=\"blog-code\"" + lang + "><code>" + escapeHtml(block.code.trim()) + "</code></pre>";
    }
    if (block.quote) {
      const cite = block.cite ? "<cite>" + escapeHtml(block.cite) + "</cite>" : "";
      return "<blockquote class=\"blog-quote\"><p>" + escapeHtml(block.quote) + "</p>" + cite + "</blockquote>";
    }
    if (block.text) {
      return "<p>" + escapeHtml(block.text) + "</p>";
    }
    return "";
  }

  function setMeta(name, content) {
    const element = document.querySelector('meta[name="' + name + '"]');
    if (element) element.setAttribute("content", content);
  }

  function setMetaProperty(property, content) {
    let element = document.querySelector('meta[property="' + property + '"]');
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("property", property);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  }

  function setCanonical(url) {
    let element = document.getElementById("canonical-link");
    if (!element) {
      element = document.createElement("link");
      element.id = "canonical-link";
      element.rel = "canonical";
      document.head.appendChild(element);
    }
    element.href = url;
  }

  function renderArticleJsonLd(post) {
    let script = document.getElementById("post-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "post-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    const url = absoluteUrl(postUrl(post));
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "dateModified": post.date,
      "inLanguage": "es",
      "articleSection": post.category,
      "author": {
        "@type": "Organization",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "DylanOS",
        "logo": {
          "@type": "ImageObject",
          "url": SITE_URL + "/images/8357dd421_Screenshot_1-removebg-preview.webp"
        }
      },
      "image": post.image ? absoluteUrl(post.image) : SITE_URL + "/images/8357dd421_Screenshot_1-removebg-preview.webp",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "url": url
    }).replace(/</g, "\\u003c");
  }

  function renderRelated(post) {
    const section = document.getElementById("post-related");
    const grid = document.getElementById("post-related-grid");
    if (!section || !grid) return;

    const others = posts.filter(function (item) {
      return item.slug !== post.slug;
    });
    const sameCategory = others.filter(function (item) {
      return item.category === post.category;
    });
    const remaining = others.filter(function (item) {
      return item.category !== post.category;
    });
    const related = sameCategory.concat(remaining).slice(0, 2);

    if (related.length === 0) {
      section.hidden = true;
      grid.innerHTML = "";
      return;
    }

    section.hidden = false;
    grid.innerHTML = related.map(cardMarkup).join("");
  }

  function renderPostView(post) {
    const indexView = document.getElementById("blog-index");
    const postView = document.getElementById("post-view");
    const hero = document.getElementById("blog-hero");
    if (!indexView || !postView) return;

    indexView.hidden = true;
    postView.hidden = false;
    if (hero) hero.hidden = true;

    const url = absoluteUrl(postUrl(post));

    document.title = post.title + " — DylanOS Blog";
    setMeta("description", post.excerpt);
    setMeta("twitter:title", post.title + " — DylanOS Blog");
    setMeta("twitter:description", post.excerpt);
    setMetaProperty("og:type", "article");
    setMetaProperty("og:title", post.title + " — DylanOS Blog");
    setMetaProperty("og:description", post.excerpt);
    setMetaProperty("og:image", absoluteUrl(post.image || "/images/8357dd421_Screenshot_1-removebg-preview.webp"));
    setMetaProperty("og:url", url);
    setMetaProperty("article:published_time", post.date);
    setMetaProperty("article:section", post.category);
    setCanonical(url);
    renderArticleJsonLd(post);

    const category = document.getElementById("post-category");
    const title = document.getElementById("post-title");
    const excerpt = document.getElementById("post-excerpt");
    const author = document.getElementById("post-author");
    const date = document.getElementById("post-date");
    const reading = document.getElementById("post-reading-time");
    const visual = document.getElementById("post-visual");
    const content = document.getElementById("post-content");
    const demoBadge = document.getElementById("post-demo-badge");
    const notice = document.getElementById("post-notice");

    if (category) category.textContent = post.category;
    if (title) title.textContent = post.title;
    if (excerpt) excerpt.textContent = post.excerpt;
    if (author) author.textContent = post.author;
    if (reading) reading.textContent = readingTime(post);
    if (demoBadge) demoBadge.hidden = !post.demo;
    if (notice) notice.hidden = !post.demo;

    if (date) {
      date.dateTime = post.date;
      date.textContent = formatDate(post.date);
    }

    if (visual) {
      visual.className = "post-visual post-visual--" + slugify(post.visual || post.category) + " blog-article__visual";
      visual.dataset.glyph = post.image ? "" : (post.glyph || "//");
      visual.setAttribute("role", "img");
      visual.setAttribute("aria-label", "Portada: " + post.category);
      visual.innerHTML =
        (post.image
          ? '<img class="post-visual__img" src="' + escapeHtml(post.image) + '" alt="" loading="eager" decoding="async">'
          : "") +
        '<span class="post-visual__tag">' + escapeHtml(post.category) + "</span>" +
        '<span class="post-visual__code">01</span>';
    }

    if (content) {
      content.innerHTML = post.content.map(renderBlock).join("");
    }

    renderRelated(post);

    window.scrollTo({ top: 0, behavior: "auto" });
    if (title) title.focus({ preventScroll: true });
  }

  function getRequestedPost() {
    const params = new URLSearchParams(window.location.search);
    let slug = params.get("post");

    if (!slug) {
      const segments = window.location.pathname.replace(/\/+$/, "").split("/");
      const last = segments[segments.length - 1] || "";
      const parent = segments[segments.length - 2] || "";

      if (parent === "blog" && last && last !== "blog" && last.indexOf(".") === -1) {
        try {
          slug = decodeURIComponent(last);
        } catch {
          slug = last;
        }
      }
    }

    if (!slug) return { post: null, slug: null };

    return {
      post: posts.find(function (post) {
        return post.slug === slug;
      }) || null,
      slug: slug
    };
  }

  function showAlert(message) {
    const alert = document.getElementById("blog-alert");
    if (!alert) return;
    alert.textContent = message;
    alert.hidden = false;
  }

  function initMenu() {
    const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle("hidden", !open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    }

    toggle.addEventListener("click", function () {
      setOpen(menu.classList.contains("hidden"));
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) setOpen(false);
    });
  }

  function init() {
    const featured = posts.find(function (post) {
      return post.featured;
    }) || posts[0] || null;

    renderFeatured(featured);
    renderFilters();
    renderPosts();
    initMenu();

    const count = document.getElementById("posts-count");
    if (count) {
      const archiveCount = posts.filter(function (post) {
        return !post.featured;
      }).length;
      count.textContent = posts.length === 0
        ? "Todavía no hay publicaciones"
        : posts.length + (posts.length === 1 ? " publicación" : " publicaciones") +
          " · " + getCategories().length + (getCategories().length === 1 ? " categoría" : " categorías") +
          (archiveCount > 0 ? " · " + archiveCount + " en el archivo" : "");
    }

    if (posts.length === 0) {
      showAlert("El blog todavía no tiene publicaciones. Vuelve pronto para ver las novedades de DylanOS.");
    }

    const filters = document.getElementById("blog-filters");
    if (filters) {
      filters.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-category]");
        if (!button) return;

        activeCategory = button.dataset.category;
        updateFilterState();
        renderPosts();
      });
    }

    const requested = getRequestedPost();
    if (requested.post) {
      renderPostView(requested.post);
    } else if (requested.slug) {
      setMeta("robots", "noindex, follow");
      showAlert("No se encontró el artículo solicitado. Puede que el enlace esté mal escrito o que la publicación ya no exista.");
    }
  }

  init();
})();
