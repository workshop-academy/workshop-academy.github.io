# HOWTO: Managing the Workshop Academy Website

This guide covers the most common operations for updating the site at
**https://workshop-academy.github.io/**.

The site is built with **Jekyll** using the **al-folio** theme and hosted on
**GitHub Pages**.  All content is written in Markdown.

---

## Table of Contents

1. [Add a New Poster to the Front Page](#1-add-a-new-poster-to-the-front-page)
2. [Add a New Workshop / Topic Post](#2-add-a-new-workshop--topic-post)
3. [Add a News Announcement](#3-add-a-news-announcement)
4. [Change / Update Organizers](#4-change--update-organizers)
5. [Add a New Poster Picture (Keeping Alignment)](#5-add-a-new-poster-picture-keeping-alignment)

---

## 1. Add a New Poster to the Front Page

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

## 2. Add a New Workshop / Topic Post

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

## 3. Add a News Announcement

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

## 4. Change / Update Organizers

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

## 5. Add a New Poster Picture (Keeping Alignment)

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

---

## Publishing Changes

After making any changes:

1. Commit your changes to the `main` branch.
2. Push to GitHub.
3. GitHub Pages will automatically rebuild and deploy the site.

```bash
git add .
git commit -m "Description of your changes"
git push origin main
```

The site will be live at **https://workshop-academy.github.io/** within a few
minutes of pushing.
