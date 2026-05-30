#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname);
const outFile = path.join(blogDir, 'index.html');

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (e) { return null; }
}

function extract(meta, html) {
  if (!html) return null;
  const m = html.match(meta);
  return m ? m[1].trim() : null;
}

function parsePost(dir) {
  const idx = path.join(blogDir, dir, 'index.html');
  const content = readFileSafe(idx);
  if (!content) return null;

  const title = extract(/<title>([^<]+)<\/title>/i, content) || extract(/<h1[^>]*>([\s\S]*?)<\/h1>/i, content) || dir;
  const description = extract(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']\s*\/?>/i, content) || '';
  const dateText = extract(/<time[^>]*datetime=["']([^"']+)["'][^>]*>/i, content) || extract(/<p class=["']text-muted["'][^>]*>([^<]+)<\/p>/i, content) || '';
  const date = dateText ? (new Date(dateText).toISOString()) : '';

  return {
    title,
    description,
    date,
    url: `/blog/${dir}/`,
    slug: dir
  };
}

function buildIndex(posts) {
  const listItems = posts.map(p => {
    const date = p.date ? `<p class="text-muted">${new Date(p.date).toLocaleDateString()}</p>` : '';
    const desc = p.description ? `<p>${p.description}</p>` : '';
    return `<li class="mb-3"><h3><a href="${p.url}">${p.title}</a></h3>${date}${desc}</li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blog - Michael L. Shaheen</title>
  <meta name="description" content="Blog index">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
  <link rel="icon" type="image/png" href="/img/favicon/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/img/favicon/favicon.svg" />
  <link rel="shortcut icon" href="/img/favicon/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/img/favicon/apple-touch-icon.png" />
  <link rel="manifest" href="/img/favicon/site.webmanifest" />
</head>
<body>
  <script>
    (function() {
      const paletteCount = 11;
      var palettes = [];
      for (let i = 0; i <= paletteCount; i++) {
        palettes.push('palette-' + i);
      }        
      var randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
      document.body.classList.add(randomPalette);
    })();
  </script>
  <nav class="navbar navbar-expand-lg navbar-light fixed-top">
      <div class="container">
          <a class="navbar-brand" href="/#home">MS</a> <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ms-auto">
                  <li class="nav-item">
                      <a class="nav-link" href="/#home">Home</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="/#about">About</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="/#timeline">Experience</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="/#skills">Skills</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="/#education">Distinctions</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="/#projects">Projects</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link active" href="/blog/">Blog</a>
                  </li>
                  <li class="nav-item">
                      <a class="nav-link" href="/#contact">Contact</a>
                  </li>
                  <li class="nav-item nav-icons-mobile">
                      <a class="nav-link nav-icon-link" href="mailto:michael@michaelshaheen.com" aria-label="Email">
                          <i class="fas fa-envelope"></i> Email
                      </a>
                      <a class="nav-link nav-icon-link" href="https://www.linkedin.com/in/michaelshaheen/" target="_blank" aria-label="LinkedIn Profile">
                          <i class="fab fa-linkedin"></i> LinkedIn
                      </a>
                  </li>
              </ul>
          </div>
          <div class="navbar-icons-desktop">
              <a class="navbar-email" href="mailto:michael@michaelshaheen.com" aria-label="Email">
                  <i class="fas fa-envelope"></i>
              </a>
              <a class="navbar-linkedin" href="https://www.linkedin.com/in/michaelshaheen/" target="_blank" aria-label="LinkedIn Profile">
                  <i class="fab fa-linkedin"></i>
              </a>
          </div>
      </div>
  </nav>

  <main class="container" style="padding-top:120px; padding-bottom: 80px; min-height: 70vh;">
    <h1 class="mb-4 section-title">Blog</h1>
    <ul class="list-unstyled">
      ${listItems}
    </ul>
  </main>

  <footer class="footer py-5">
      <div class="container">
          <div class="row mb-4">
              <div class="col-lg-4">
                  <div class="footer-left">
                      <div class="footer-info-item">
                          <i class="fas fa-map-marker-alt"></i>
                          <span>Pittsburgh, PA</span>
                      </div>
                      <div class="footer-info-item">
                          <i class="fas fa-phone"></i>
                          <a href="tel:412-496-4412" class="footer-info-link">412-496-4412</a>
                      </div>
                      <div class="footer-info-item">
                          <i class="fas fa-envelope"></i>
                          <a href="mailto:michael@michaelshaheen.com" class="footer-info-link">michael@michaelshaheen.com</a>
                      </div>
                      <div class="footer-info-item">
                          <i class="fab fa-linkedin"></i>
                          <a href="https://www.linkedin.com/in/michaelshaheen/" target="_blank" class="footer-info-link">LinkedIn</a>
                      </div>
                  </div>
              </div>
              <div class="col-lg-4">
                  <div class="footer-center">
                      <a href="/sitemap.xml" class="footer-sitemap-link">
                          <i class="fas fa-sitemap"></i> Sitemap
                      </a>
                  </div>
              </div>
              <div class="col-lg-4">
                  <nav class="footer-nav">
                      <ul class="footer-nav-list">
                          <li><a href="/#home" class="footer-nav-link"><i class="fas fa-home"></i> Home</a></li>
                          <li><a href="/#about" class="footer-nav-link"><i class="fas fa-user"></i> About</a></li>
                          <li><a href="/#timeline" class="footer-nav-link"><i class="fas fa-briefcase"></i> Experience</a></li>
                          <li><a href="/#skills" class="footer-nav-link"><i class="fas fa-code"></i> Skills</a></li>
                          <li><a href="/#education" class="footer-nav-link"><i class="fas fa-graduation-cap"></i> Distinctions</a></li>
                          <li><a href="/#projects" class="footer-nav-link"><i class="fas fa-folder"></i> Projects</a></li>
                          <li><a href="/blog/" class="footer-nav-link"><i class="fas fa-blog"></i> Blog</a></li>
                          <li><a href="/#contact" class="footer-nav-link"><i class="fas fa-envelope"></i> Contact</a></li>
                      </ul>
                  </nav>
              </div>
          </div>
          <div class="row">
              <div class="col-lg-12 text-center">
                  <p class="footer-copyright mb-0">&copy; 2025 Michael L. Shaheen. All rights reserved.</p>
              </div>
          </div>
      </div>
  </footer>

  <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <script src="/js/script.js"></script>
</body>
</html>`;
}

function main() {
  const entries = fs.readdirSync(blogDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .filter(name => !['.git', 'template.html'].includes(name));

  const posts = entries.map(parsePost).filter(Boolean);
  // sort by date desc when available
  posts.sort((a,b) => {
    if (a.date && b.date) return new Date(b.date) - new Date(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  const out = buildIndex(posts);
  fs.writeFileSync(outFile, out, 'utf8');
  console.log(`Wrote ${outFile} with ${posts.length} posts.`);
}

main();
