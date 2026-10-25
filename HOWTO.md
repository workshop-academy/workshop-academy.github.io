# HOWTO: Managing the Workshop Academy Website

This guide covers how the site at **https://workshop-academy.github.io/**
works, how to update it, and how to troubleshoot build errors.

---

## Table of Contents

1. [How the Website Infrastructure Works](#1-how-the-website-infrastructure-works)
2. [Understanding `_config.yml`](#2-understanding-_configyml)
3. [Add a New Poster to the Front Page](#3-add-a-new-poster-to-the-front-page)
4. [Add a New Workshop / Topic Post](#4-add-a-new-workshop--topic-post)
5. [Add a News Announcement](#5-add-a-news-announcement)
6. [Change / Update Organizers](#6-change--update-organizers)
7. [Add a New Poster Picture (Keeping Alignment)](#7-add-a-new-poster-picture-keeping-alignment)
8. [Publishing Changes](#8-publishing-changes)
9. [Troubleshooting Build Errors](#9-troubleshooting-build-errors)

---

## 1. How the Website Infrastructure Works

### Overview

This website is a **static site** built with these technologies:

- **Jekyll** -- a Ruby-based static site generator that converts Markdown
  files, HTML templates, and configuration into a complete website.
- **al-folio theme** -- an academic Jekyll theme (originally from
  https://github.com/alshedivat/al-folio) that provides the layout,
  styling, and components.
- **GitHub Pages** -- a free hosting service from GitHub that serves the
  generated static files at `https://workshop-academy.github.io/`.

### How it works end-to-end

```
You edit .md files  -->  Push to GitHub  -->  GitHub Actions runs  -->  Jekyll builds HTML  -->  Site is deployed
```

1. You write content in **Markdown** (`.md`) files and commit to the `master`
   branch.
2. When you push, **GitHub Actions** workflows are triggered automatically
   (defined in `.github/workflows/`).
3. The workflow installs Ruby, Jekyll, and dependencies from `Gemfile`, then
   runs `bundle exec jekyll build` to generate the static site into `_site/`.
4. The built site is deployed to GitHub Pages and becomes live.

### Key directory structure

```
workshop-academy.github.io/
|-- _config.yml              # Site-wide configuration (the brain of the site)
|-- Gemfile                  # Ruby dependencies (Jekyll plugins)
|-- _pages/                  # Standalone pages (about, cv, projects, etc.)
|   |-- about.md             # Front/home page (permalink: /)
|-- _posts/                  # Blog posts (workshops)
|   |-- YYYY-MM-DD-title.md  # Each workshop post
|-- _news/                   # News announcements
|   |-- announcement_*.md
|-- _includes/               # Reusable HTML components (included with Liquid tags)
|   |-- figure.html          # Image display component
|   |-- organizers.html      # Organizers table
|   |-- news.html            # News listing component
|   |-- latest_posts.html    # Latest posts component
|-- _layouts/                # Page templates
|   |-- about.html           # Layout for the front page
|   |-- post.html            # Layout for blog posts
|   |-- default.html         # Base layout wrapping all pages
|-- _data/                   # Data files (YAML) used by templates
|   |-- coauthors.yml
|-- _sass/                   # Custom stylesheets
|-- assets/
|   |-- img/                 # All images (posters, photos, etc.)
|   |-- pdf/                 # PDF files (downloadable worksheets)
|   |-- json/                # JSON data (resume, etc.)
|-- .github/workflows/       # GitHub Actions CI/CD pipelines
|   |-- deploy.yml           # Main build & deploy workflow
|   |-- jekyll.yml           # Alternative Jekyll Pages workflow
```

### How Jekyll processes content

- **Liquid templates**: Jekyll uses the Liquid templating language. Tags like
  `{{ "{% include figure.html " }}%}` insert reusable HTML components from
  `_includes/`. Tags like `{{ "{{ site.title " }}}}` insert values from
  `_config.yml`.
- **Front matter**: Every content file starts with YAML between `---` lines.
  This tells Jekyll the layout to use, the title, date, and other metadata.
- **Markdown to HTML**: Jekyll converts `.md` files to `.html` using the
  kramdown parser, then wraps them in the specified layout template.
- **Collections**: `_posts/` and `_news/` are Jekyll collections. Files in
  these directories are automatically discovered, sorted, and made available
  to templates.

### GitHub Actions workflows

The repo has two relevant build workflows:

- **`.github/workflows/deploy.yml`** -- The main deployment workflow.
  Triggered on push to `master` or `main`. Installs Ruby 3.2.2, builds
  with Jekyll, and deploys to the `gh-pages` branch using
  `JamesIves/github-pages-deploy-action`.
- **`.github/workflows/jekyll.yml`** -- An alternative workflow using
  GitHub's built-in Pages action. Triggered on push to `master`. Uses
  Ruby 3.1 and deploys via `actions/deploy-pages`.

Both workflows run on every push. If only one is active in your repo
settings, the other will succeed but not affect the live site.

---

## 2. Understanding `_config.yml`

The `_config.yml` file is the central configuration for the entire site.
Changes here affect the site globally. It is **not** published as a page
itself, but it controls how every page is generated.

### Site settings (what you may want to change)

| Setting         | Current Value                                | What it does                                    |
|-----------------|----------------------------------------------|-------------------------------------------------|
| `title`         | `Writing Workshop Academy`                   | Displayed in the browser tab and site header    |
| `first_name`    | `Yaxin`                                      | Used when `title` is set to `blank`             |
| `middle_name`   | `Jasmine`                                    | Used when `title` is set to `blank`             |
| `last_name`     | `Zheng`                                      | Used when `title` is set to `blank`             |
| `email`         | `zhengyaxin06@gmail.com`                     | Contact email                                   |
| `url`           | `https://workshop-academy.github.io`         | Base URL of the site (do not change casually)   |
| `baseurl`       | `/`                                          | Subpath (leave as `/` for root deployment)      |
| `lang`          | `en`                                         | Language of the site                            |
| `icon`          | (emoji)                                      | Favicon -- can be an emoji or image filename    |

### Blog settings

| Setting              | Current Value          | What it does                                    |
|----------------------|------------------------|-------------------------------------------------|
| `blog_name`          | `workshops`            | Title shown on the blog page                    |
| `blog_nav_title`     | `workshops`            | Title in the navigation bar                     |
| `blog_description`   | `workshop topics.`     | Description of the blog                         |
| `permalink`          | `/blog/:year/:title/`  | URL pattern for blog posts                      |

The `permalink` pattern determines the final URL for each post.  For a post
file named `_posts/2026-08-23-workshop-creative-writing.md`, the URL becomes:
`https://workshop-academy.github.io/blog/2026/workshop-creative-writing/`

### Collections (news, projects)

```yaml
collections:
  news:
    defaults:
      layout: post
    output: true
    permalink: /news/:path/
  projects:
    output: true
    permalink: /projects/:path/
```

- `output: true` means each item gets its own page.
- `permalink` sets the URL pattern. News file `_news/announcement_1.md`
  becomes `https://workshop-academy.github.io/news/announcement_1/`.

### Front page sections (announcements and latest posts)

```yaml
announcements:
  enabled: true
  scrollable: true
  limit: 5

latest_posts:
  enabled: true
  scrollable: true
  limit: 5
```

- `enabled` -- show/hide the section on the front page.
- `scrollable` -- add a scroll bar when there are more than 3 items.
- `limit` -- max number of items shown. Remove or leave blank to show all.

### Includes and excludes

```yaml
include: ['_pages']
exclude:
  - bin
  - Gemfile
  - Gemfile.lock
  - vendor
  - HOWTO.md
```

- `include` -- directories/files Jekyll should process (even if they start
  with `_`). `_pages` is listed here so pages like `about.md` get built.
- `exclude` -- files Jekyll should **skip** during build. `HOWTO.md` is
  excluded because it contains Liquid template examples in code blocks that
  Jekyll would try to execute, causing build failures.

**Important:** If you add any new `.md` file at the repo root that contains
Liquid syntax examples (like `{{ "{% include " }}%}`), add it to the
`exclude` list to prevent build errors.

### Giscus comments

```yaml
giscus:
  repo: workshop-academy/workshop-academy.github.io
  repo_id: 789604494
  category: Comments
  category_id: DIC_kwDOA5PmLc4CTBt6
  mapping: title
  ...
```

This enables the Giscus comment system (powered by GitHub Discussions) on
pages that have `giscus_comments: true` in their front matter.

### Plugins

Plugins are listed in both `_config.yml` (under `plugins:`) and `Gemfile`.
Key plugins include:

| Plugin                  | Purpose                                      |
|-------------------------|----------------------------------------------|
| `jekyll-paginate-v2`    | Pagination for the blog listing              |
| `jekyll-archives`       | Year/tag/category archive pages              |
| `jekyll-feed`           | RSS feed generation                          |
| `jekyll-sitemap`        | Sitemap for search engines                   |
| `jekyll-imagemagick`    | Responsive WebP image generation             |
| `jemoji`                | GitHub-style emoji support (`:sparkles:`)    |
| `jekyll-scholar`        | Bibliography/citation support                |
| `jekyll-toc`            | Table of contents generation                 |
| `jekyll-minifier`       | HTML/CSS/JS minification                     |

### Optional features

```yaml
enable_darkmode:            true
enable_masonry:             true
enable_math:                true
enable_medium_zoom:         true
enable_progressbar:         true
enable_header_image:        true
```

These are boolean toggles for site-wide features. Set to `false` to
disable any feature.

---

## 3. Add a New Poster to the Front Page

The front page is controlled by `_pages/about.md` and is published at:
**https://workshop-academy.github.io/**

The poster grid appears directly below the introductory text on that page.

### Step 1 -- Upload the poster image

Place your poster image in `assets/img/`.  Follow the existing naming
convention:

```
workshop_YYYYMM.png       # e.g. workshop_202502.png
writing_YYYYMM.png        # e.g. writing_202506.png
```

### Step 2 -- Edit `_pages/about.md`

Posters are displayed in rows of **3 images** each.  Each row is a
`<div class="row">` containing three `<div class="col-sm">` columns.

To add a poster, either:

- **Replace** an existing image path in a column, or
- **Add a new row** (see below).

#### Adding a new row of posters

Insert a new block **before** the existing rows (so newest posters appear
first).  Copy-paste the template below and replace the image paths:

```html
<div class="row mt-3 mb-3 justify-content-start">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/YOUR_IMAGE_1.png" class="img-fluid rounded z-depth-1" width=120 zoomable=true %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/YOUR_IMAGE_2.png" class="img-fluid rounded z-depth-1" width=120 zoomable=true %}
    </div>
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/YOUR_IMAGE_3.png" class="img-fluid rounded z-depth-1" width=120 zoomable=true %}
    </div>
</div>
```

> **Key points:**
> - Keep `width=120` consistent across all poster images on the front page
>   so they stay aligned.
> - Always use 3 columns per row for uniform layout.
> - If you only have 1 or 2 new images, fill the remaining columns with
>   existing images or leave the `<div class="col-sm ...">` blocks empty.

---

## 4. Add a New Workshop / Topic Post

Blog posts live in the `_posts/` directory.  Each file represents one workshop
or topic.  They are published under the "workshops" blog at:
**https://workshop-academy.github.io/blog/**

Each post gets its own URL based on the permalink pattern
`/blog/:year/:title/`.  For example, the file
`_posts/2026-01-31-workshop-creative-writing-in-AI-era.md` is published at:
**https://workshop-academy.github.io/blog/2026/workshop-creative-writing-in-AI-era/**

The latest posts also appear in the "latest posts" section on the front page
(**https://workshop-academy.github.io/**).

### Step 1 -- Create the Markdown file

File name **must** follow this format:

```
_posts/YYYY-MM-DD-short-title.md
```

For example: `_posts/2026-03-15-workshop-poetry.md`

### Step 2 -- Add front matter

Every post starts with YAML front matter between `---` lines.  Use this
template:

```yaml
---
layout: post
title:  Your Workshop Title
date:   YYYY-MM-DD HH:MM:SS
description: short description of the workshop
tags: workshops links
categories: links
giscus_comments: true
thumbnail: assets/img/YOUR_POSTER.png
---
```

| Field              | Required | Notes                                        |
|--------------------|----------|----------------------------------------------|
| `layout`           | Yes      | Always `post`                                |
| `title`            | Yes      | Displayed as the post heading                |
| `date`             | Yes      | Determines sort order (`YYYY-MM-DD HH:MM:SS`) |
| `description`      | Yes      | Shown in post previews                       |
| `tags`             | Yes      | Use `workshops links` (space-separated)      |
| `categories`       | Yes      | Use `links`                                  |
| `giscus_comments`  | Optional | Set to `true` to enable comments             |
| `thumbnail`        | Optional | Path to the poster image for blog listing    |

### Step 3 -- Write the post body

Below the front matter, write your content in Markdown.  To include the
poster image in the post body:

```html
<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/YOUR_POSTER.png" class="img-fluid rounded z-depth-1" width=250 zoomable=true %}
    </div>
</div>

<div class="caption">
    Your caption text here.
</div>
```

> **Note:** Use `width=250` for images inside blog posts (larger than the
> `width=120` used on the front page).

### Complete example

```markdown
---
layout: post
title:  Creative Writing Workshop (Beyond the Page)
date:   2026-03-15 18:30:16
description: creative writing
tags: workshops links
categories: links
giscus_comments: true
thumbnail: assets/img/workshop_202603.png
---
Workshops: Creative Writing by Beyond the Page :sparkles:

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.html path="assets/img/workshop_202603.png" class="img-fluid rounded z-depth-1" width=250 zoomable=true %}
    </div>
</div>

<div class="caption">
    Creative Writing Workshop.
</div>

Tell us about your experience! :smile:
```

---

## 5. Add a News Announcement

News items live in the `_news/` directory and appear in the "news" section on
the front page (**https://workshop-academy.github.io/**).

Each news item also gets its own page under `/news/`.  For example,
`_news/announcement_1.md` is published at:
**https://workshop-academy.github.io/news/announcement_1/**

All news items are listed at:
**https://workshop-academy.github.io/news/**

### Step 1 -- Create a new Markdown file

```
_news/announcement_TOPIC.md
```

For example: `_news/announcement_spring2026.md`

### Step 2 -- Add front matter

```yaml
---
layout: post
title: Your Announcement Title
date: YYYY-MM-DD HH:MM:SS-0400
inline: false
giscus_comments: true
related_posts: false
---
```

| Field            | Required | Notes                                               |
|------------------|----------|-----------------------------------------------------|
| `layout`         | Yes      | Always `post`                                       |
| `title`          | Yes      | Short title for the news item                       |
| `date`           | Yes      | Include timezone offset (e.g. `-0400`)              |
| `inline`         | Yes      | `false` = full news page; `true` = inline on front page only |
| `giscus_comments`| Optional | Enable Giscus comments                              |
| `related_posts`  | Optional | Show related posts at the bottom                    |
| `hidden`         | Optional | Set to `true` to hide from news listing             |

### Step 3 -- Write the announcement body

Use standard Markdown.  You can include images using the same `figure.html`
pattern shown above.

### Example

```markdown
---
layout: post
title: Upcoming Spring Workshop
date: 2026-03-01 16:00:00-0400
inline: false
giscus_comments: true
related_posts: false
---
## Spring Creative Writing Workshop :sparkles:
Time: Sunday March 15, 2026, 4:00-5:00pm

Join us for a fun creative writing session!

Tell us what you're interested in!
```

---

## 6. Change / Update Organizers

The organizer list is displayed on the front page
(**https://workshop-academy.github.io/**) in the "organizers and speakers"
table near the bottom of the page.

It is controlled by the HTML include file:

```
_includes/organizers.html
```

This file is rendered when `organizers: true` is set in the front matter of
`_pages/about.md`.

### To add a new organizer

Open `_includes/organizers.html` and add a new `<tr>` block inside the
`<table>`:

```html
<tr>
  <td class="name"><a href="https://their-website.com">New Person Name</a></td>
  <td class="Introduction">Their interests (e.g. poetry, writing).</td>
  <td><a href="https://their-website.com">https://their-website.com</a></td>
</tr>
```

### To remove an organizer

Delete the corresponding `<tr>...</tr>` block.

### To update an organizer

Edit the relevant `<td>` fields (name, interests, or reference link) inside
their `<tr>` block.

### Current organizer table structure

| Column      | HTML class      | Content                          |
|-------------|-----------------|----------------------------------|
| Name        | `class="name"`  | Organizer name with link         |
| Interests   | `class="Introduction"` | Brief description of interests |
| Reference   | (none)          | URL to their page                |

---

## 7. Add a New Poster Picture (Keeping Alignment)

The front page (**https://workshop-academy.github.io/**) in `_pages/about.md`
uses a grid layout with rows of 3 images.  Keeping images aligned requires
consistency.

### Rules for alignment

1. **Always use 3 columns per row** -- each row is a `<div class="row">`
   containing exactly 3 `<div class="col-sm">` blocks.

2. **Use the same `width` for all poster images on the front page** -- the
   current standard is `width=120`.

3. **Use the same CSS classes** on every image:
   ```
   class="img-fluid rounded z-depth-1"
   ```

4. **Follow the naming convention** for image files:
   ```
   workshop_YYYYMM.png    -- for workshop posters
   writing_YYYYMM.png     -- for writing-specific posters
   ```

### Step-by-step

1. **Add your image** to `assets/img/` with the proper naming convention.

2. **Edit `_pages/about.md`** -- find the poster grid section.

3. **To add a single new image** to an existing row that has a free slot,
   replace the empty column:
   ```html
   <div class="col-sm mt-3 mt-md-0">
       {% include figure.html path="assets/img/YOUR_NEW_IMAGE.png" class="img-fluid rounded z-depth-1" width=120 zoomable=true %}
   </div>
   ```

4. **To add a full new row** of 3 images, insert the row block at the top of
   the poster section (newest first):
   ```html
   <div class="row mt-3 mb-3 justify-content-start">
       <div class="col-sm mt-3 mt-md-0">
           {% include figure.html path="assets/img/IMAGE_1.png" class="img-fluid rounded z-depth-1" width=120 zoomable=true %}
       </div>
       <div class="col-sm mt-3 mt-md-0">
           {% include figure.html path="assets/img/IMAGE_2.png" class="img-fluid rounded z-depth-1" width=120 zoomable=true %}
       </div>
       <div class="col-sm mt-3 mt-md-0">
           {% include figure.html path="assets/img/IMAGE_3.png" class="img-fluid rounded z-depth-1" width=120 zoomable=true %}
       </div>
   </div>
   ```

5. **If you have fewer than 3 new images**, you can either:
   - Leave extra `<div class="col-sm mt-3 mt-md-0">` blocks empty (the grid
     will still align), or
   - Shift older images down to fill the row.

### Alignment checklist

- [ ] All images in the row use `width=120`
- [ ] All images use `class="img-fluid rounded z-depth-1"`
- [ ] Each row has exactly 3 `col-sm` divs
- [ ] Row div uses `class="row mt-3 mb-3 justify-content-start"`
- [ ] Image file is placed in `assets/img/`

---

## 8. Publishing Changes

After making any changes:

1. Commit your changes to the `master` branch.
2. Push to GitHub.
3. GitHub Actions will automatically rebuild and deploy the site.

```bash
git add .
git commit -m "Description of your changes"
git push origin master
```

The site will be live at **https://workshop-academy.github.io/** within a few
minutes of pushing.

You can monitor the build at:
**https://github.com/workshop-academy/workshop-academy.github.io/actions**

---

## 9. Troubleshooting Build Errors

When a push fails to build, GitHub will show a red X next to the commit and
send an email notification. Here is how to diagnose and fix common problems.

### Step 1 -- Check the build log

1. Go to **https://github.com/workshop-academy/workshop-academy.github.io/actions**
2. Click on the failed workflow run (it will have a red X icon).
3. Click the **build** job, then expand the **Build with Jekyll** step.
4. Read the error message -- it tells you the file and line that caused the
   failure.

### Common errors and fixes

#### Error: "Could not locate the included file 'figure.html'"

```
Error: Could not locate the included file 'figure.html' in any of
["/github/workspace/_includes", ...]. Ensure it exists in one of those
directories and is not a symlink as those are not allowed in safe mode.
```

**Cause:** A Markdown file at the repo root (like `HOWTO.md` or `README.md`)
contains Liquid template tags (e.g. `{{ "{% include figure.html " }}%}`)
inside code blocks.  GitHub Pages' Jekyll build processes **all** `.md` files
unless they are excluded, and it tries to execute Liquid tags even inside
fenced code blocks.

**Fix:** Add the file to the `exclude` list in `_config.yml`:

```yaml
exclude:
  - bin
  - Gemfile
  - Gemfile.lock
  - vendor
  - HOWTO.md          # <-- add your file here
  - YOUR_NEW_FILE.md
```

#### Error: "Invalid date" or post not appearing

**Cause:** The filename or front matter `date` field has an invalid format.

**Fix:** Ensure:
- Filename follows `YYYY-MM-DD-title.md` exactly (e.g. `2026-08-23-workshop.md`)
- The `date` in front matter is a valid date-time (e.g. `2026-08-23 17:00:00`)
- Future-dated posts (date after today) will build but won't appear in
  listings unless Jekyll is configured with `future: true` in `_config.yml`.

#### Error: "Could not find gem" or bundle install failure

**Cause:** A plugin in `_config.yml` or `Gemfile` is misconfigured or
unavailable.

**Fix:**
- Ensure every plugin listed in `_config.yml` under `plugins:` also has a
  corresponding `gem` entry in `Gemfile`.
- Do not add new plugins without testing locally first.

#### Error: YAML parsing error in front matter

```
Error: (<file>): did not find expected key while parsing a block mapping
```

**Cause:** Malformed YAML in the front matter of a `.md` file (e.g. missing
colon, bad indentation, unescaped special characters).

**Fix:**
- Check the front matter between the `---` lines.
- Ensure colons are followed by a space: `title: My Title` (not `title:My Title`).
- If a value contains special characters (`:`, `#`, `[`, etc.), wrap it in
  quotes: `title: "My Title: A Story"`.

#### Error: Image not found / broken images

**Cause:** The image path in `figure.html` or `thumbnail` doesn't match
the actual filename in `assets/img/`.

**Fix:**
- Check the exact filename (case-sensitive, including extension).
- Common mistake: using `.jpg.png` or `.jpeg` when the file is `.jpg`.
- Run `ls assets/img/ | grep your_image` to verify the filename.

#### Error: Page layout not found

```
Build Warning: Layout 'xyz' requested in ... does not exist.
```

**Cause:** The `layout` field in front matter references a layout that
doesn't exist in `_layouts/`.

**Fix:** Use one of the available layouts:
- `about` -- for the front page (`_pages/about.md` only)
- `post` -- for blog posts and news items
- `page` -- for standalone pages
- `default` -- base layout (rarely used directly)
- `cv` -- for the CV page

### Step 2 -- Test locally (optional)

If you have Ruby and Jekyll installed locally, you can test before pushing:

```bash
bundle install         # install dependencies (first time only)
bundle exec jekyll serve   # build and serve at http://localhost:4000
```

This catches most errors before they reach GitHub.

### Step 3 -- Fix and re-push

1. Make the fix in the relevant file.
2. Commit and push again.
3. Check the Actions tab to confirm the build passes.

### General troubleshooting tips

- **Read the full error message carefully** -- Jekyll errors usually include
  the filename and line number.
- **Check recent changes** -- if the build was working before, compare your
  changes with `git diff HEAD~1` to find what broke it.
- **One change at a time** -- when debugging, push small commits so you can
  isolate which change caused the failure.
- **Don't edit `_config.yml` unless you know what you're changing** -- this
  file affects the entire site. A typo here can break everything.
- **File extensions matter** -- Jekyll and imagemagick process files based on
  extension. A file named `image.jpg.png` will cause confusion. Use clean
  extensions (`.jpg`, `.png`).

---

## Quick Reference: File Locations and Live URLs

| What                   | Source File                         | Live URL                                                       |
|------------------------|-------------------------------------|----------------------------------------------------------------|
| Front page             | `_pages/about.md`                   | https://workshop-academy.github.io/                            |
| Blog listing           | (auto-generated)                    | https://workshop-academy.github.io/blog/                       |
| Blog post              | `_posts/YYYY-MM-DD-title.md`        | `https://workshop-academy.github.io/blog/YYYY/title/`         |
| News listing           | `news.html`                         | https://workshop-academy.github.io/news/                       |
| News announcement      | `_news/announcement_NAME.md`        | `https://workshop-academy.github.io/news/announcement_NAME/`  |
| Organizers table       | `_includes/organizers.html`         | (rendered on front page)                                       |
| Poster images          | `assets/img/`                       | `https://workshop-academy.github.io/assets/img/FILENAME`      |
| History poster gallery | `_news/announcement_history.md`     | https://workshop-academy.github.io/news/announcement_history/  |
| Site configuration     | `_config.yml`                       | (not published directly)                                       |
| Build logs             | `.github/workflows/`                | https://github.com/workshop-academy/workshop-academy.github.io/actions |
