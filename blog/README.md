# Adding new posts

1. Copy `template.html` to a new folder under `blog/`, e.g. `blog/my-new-post/index.html`.
2. Replace `<!--TITLE-->`, `<!--DATE-->`, `<!--DESCRIPTION-->`, and `<!--CONTENT-->` with your post's data.
3. Commit and push. GitHub Pages will serve your new post at `/blog/my-new-post/`.

Automatic index generation

Run the included Node script to regenerate `blog/index.html` from your post folders:

```bash
npm run generate-blog-index
```

The script scans each folder under `blog/` for `index.html`, extracts the `<title>`, `meta description`, and `<time datetime>` (when present), and writes an updated `blog/index.html` sorted by date.

