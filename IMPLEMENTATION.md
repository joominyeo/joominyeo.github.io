# 슬전생 - 슬기로운 전문연구요원 생활
## Complete Implementation Guide

**Transfer this entire `/website` directory to the target machine, then follow steps below.**

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| Site title | 슬전생 - 슬기로운 전문연구요원 생활 |
| Author | Cai (Joomin) Yeo |
| Purpose | Blog to help others navigate 전문연구요원 (alternative military service) |
| Framework | **Astro** (see framework decision below) |
| Target host | GitHub Pages |
| Font | Pretendard (replace all existing fonts) |
| Style reference | https://joominyeo.github.io/ |
| Structure reference | https://zerohertz.github.io/ |
| LinkedIn | https://www.linkedin.com/in/joominyeo |

---

## 2. Framework Decision: Astro (chosen over Hugo and Next.js)

### Why Astro beats Hugo and Next.js for this use case

| Criterion | Hugo | Next.js | **Astro ✅** |
|-----------|------|---------|------------|
| Runtime JS shipped | 0 KB | ~40 KB (React) | **0 KB default** |
| Prefetch on hover | Manual plugin | Manual | **Built-in** |
| Image optimization | Basic | Built-in | **Built-in (Sharp)** |
| Critical CSS per page | No | No | **Yes (scoped styles)** |
| MDX blog posts | Partial | Plugin | **First-class** |
| TypeScript + modern DX | No (Go templates) | Yes | **Yes (Vite)** |
| GitHub Pages deploy | Yes | Yes (SSG) | **Yes** |
| Korean/i18n | Basic | Good | **Good** |
| Zero-JS search | No | No | **Pagefind** |

### McMaster-Carr speed techniques applied via Astro

McMaster-Carr (https://www.mcmaster.com/) is famous for exceptional speed through:
1. **SSG pre-rendered HTML** → Astro outputs static HTML by default
2. **CDN caching** → GitHub Pages is CDN-backed
3. **Critical CSS inline** → Astro `<style>` tags in `.astro` files are scoped and inlined per-page
4. **Prefetch on hover** → `prefetch: { defaultStrategy: 'hover' }` in astro.config.mjs
5. **Fixed-dimension images** → Astro `<Image />` enforces width/height (no layout shift)
6. **Minimal JS** → Islands only (hamburger menu, search — everything else is pure HTML)
7. **Font preload** → `<link rel="preload">` for Pretendard woff2 in Base layout
8. **Service worker** → Add `@vite-pwa/astro` in phase 2 if needed

---

## 3. Prerequisites (target machine)

```bash
node --version   # need >= 18.14
npm --version    # need >= 9
git --version
```

---

## 4. Project Setup

```bash
cd /path/to/website

# Create Astro project in current directory
npm create astro@latest . -- --template minimal --typescript strict --install --no-git

# Install integrations
npm install @astrojs/mdx @astrojs/sitemap

# Install sharp for image optimization
npm install sharp

# Install Pagefind for search
npm install pagefind
```

---

## 5. Download Pretendard Font

```bash
mkdir -p public/fonts

# Download Pretendard Variable (covers all weights in one file)
curl -L "https://github.com/orioncactus/pretendard/releases/latest/download/Pretendard-1.3.9.zip" -o /tmp/pretendard.zip
unzip /tmp/pretendard.zip "public/PretendardVariable.woff2" -d /tmp/pretendard_extracted || true

# Alternative: direct woff2 download
curl -L \
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/woff2/PretendardVariable.woff2" \
  -o public/fonts/PretendardVariable.woff2
```

---

## 6. File Structure to Create

```
website/
├── astro.config.mjs
├── package.json            (created by npm create astro)
├── tsconfig.json           (created by npm create astro)
├── public/
│   ├── fonts/
│   │   └── PretendardVariable.woff2
│   └── favicon.svg
└── src/
    ├── content/
    │   ├── config.ts
    │   └── blog/
    │       ├── 2024-01-01-welcome.md       (example post)
    │       └── 2019-12-01-archive-post.md  (example archive post)
    ├── layouts/
    │   ├── Base.astro
    │   └── BlogPost.astro
    ├── components/
    │   ├── Nav.astro
    │   ├── Footer.astro
    │   ├── PostCard.astro
    │   └── TagCloud.astro
    ├── pages/
    │   ├── index.astro
    │   ├── about.astro
    │   ├── blog/
    │   │   └── [...slug].astro
    │   ├── tags/
    │   │   └── [tag].astro
    │   ├── categories/
    │   │   └── [category].astro
    │   └── archive/
    │       └── index.astro
    └── styles/
        └── global.css
```

---

## 7. File Contents

### `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://YOUR_GITHUB_USERNAME.github.io',  // ← update this
  integrations: [mdx(), sitemap()],
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',  // McMaster-Carr hover prefetch
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
```

### `src/styles/global.css`
```css
/* Pretendard font — zero FOIT with font-display: swap */
@font-face {
  font-family: 'Pretendard';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url('/fonts/PretendardVariable.woff2') format('woff2-variations');
}

/* ── CSS Custom Properties (joominyeo.github.io palette) ────────────── */
:root {
  --bg-primary:    #0d1117;   /* dark background */
  --bg-secondary:  #161b22;   /* card / sidebar background */
  --bg-tertiary:   #21262d;   /* hover states */
  --text-primary:  #e6edf3;   /* main text */
  --text-secondary:#8b949e;   /* muted text */
  --accent:        #58a6ff;   /* links, active nav, tags */
  --accent-hover:  #79c0ff;
  --border:        #30363d;   /* dividers */
  --tag-bg:        #1f2937;
  --tag-text:      #58a6ff;
  --code-bg:       #161b22;

  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI',
               sans-serif;
  --font-mono: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;

  --sidebar-width: 240px;
  --content-max:   760px;
  --radius:        8px;
  --transition:    0.2s ease;
}

/* ── Reset ───────────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
  background: var(--bg-primary);
  scroll-behavior: smooth;
}

a { color: var(--accent); text-decoration: none; }
a:hover { color: var(--accent-hover); text-decoration: underline; }

img { max-width: 100%; height: auto; display: block; }

code, pre {
  font-family: var(--font-mono);
  font-size: 0.875em;
}

pre {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
  overflow-x: auto;
}

/* ── Layout ──────────────────────────────────────────────────────────── */
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: var(--sidebar-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  padding: 2rem;
  max-width: calc(var(--content-max) + var(--sidebar-width));
}

/* ── Sidebar nav ─────────────────────────────────────────────────────── */
.site-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.site-subtitle {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.nav-section { display: flex; flex-direction: column; gap: 0.25rem; }

.nav-section-title {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: background var(--transition), color var(--transition);
}

.nav-link:hover,
.nav-link.active {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  text-decoration: none;
}

/* ── Post card ───────────────────────────────────────────────────────── */
.post-card {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
  background: var(--bg-secondary);
  transition: border-color var(--transition);
  margin-bottom: 1rem;
}

.post-card:hover { border-color: var(--accent); }

.post-card-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.post-card-meta {
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.post-card-excerpt {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ── Tags ────────────────────────────────────────────────────────────── */
.tag {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: var(--tag-bg);
  color: var(--tag-text);
  border: 1px solid var(--border);
}

/* ── Archive badge ───────────────────────────────────────────────────── */
.archive-badge {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

/* ── Responsive (mobile) ─────────────────────────────────────────────── */
@media (max-width: 768px) {
  .sidebar {
    position: static;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
    flex-direction: row;
    flex-wrap: wrap;
    padding: 1rem;
    gap: 1rem;
  }

  .main-content {
    margin-left: 0;
  }

  .layout { flex-direction: column; }
}
```

### `src/content/config.ts`
```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    category: z.string().default('기타'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Posts with pubDate before 2020 are automatically archived
  }),
});

export const collections = { blog };
```

### `src/layouts/Base.astro`
```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description = '슬기로운 전문연구요원 생활을 위한 안내서' } = Astro.props;
const siteTitle = '슬전생';
---

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content={description} />
  <title>{title} | {siteTitle}</title>

  <!-- McMaster-Carr: preload critical font before render -->
  <link
    rel="preload"
    href="/fonts/PretendardVariable.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

  <!-- RSS -->
  <link rel="alternate" type="application/rss+xml" title={siteTitle} href="/rss.xml" />

  <!-- Global styles (inlined via Astro build) -->
  <style>
    @import '/src/styles/global.css';
  </style>
</head>
<body>
  <div class="layout">
    <slot />
  </div>
</body>
</html>
```

### `src/layouts/BlogPost.astro`
```astro
---
import Base from './Base.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
  pubDate: Date;
  category: string;
  tags: string[];
}

const { title, description, pubDate, category, tags } = Astro.props;
const isArchived = pubDate.getFullYear() < 2020;
const dateStr = pubDate.toLocaleDateString('ko-KR', {
  year: 'numeric', month: 'long', day: 'numeric'
});
---

<Base title={title} description={description}>
  <Nav />
  <main class="main-content">
    <article>
      <header style="margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
        {isArchived && <span class="archive-badge">보관됨</span>}
        <h1 style="font-size: 1.75rem; margin-top: 0.5rem;">{title}</h1>
        <div class="post-card-meta" style="margin-top: 0.75rem;">
          <time datetime={pubDate.toISOString()}>{dateStr}</time>
          <a href={`/categories/${category}`} class="tag">{category}</a>
          {tags.map(tag => (
            <a href={`/tags/${tag}`} class="tag">#{tag}</a>
          ))}
        </div>
      </header>

      <div class="prose">
        <slot />
      </div>
    </article>
  </main>
  <Footer />
</Base>

<style>
  .prose { line-height: 1.8; }
  .prose h2 { font-size: 1.3rem; margin: 2rem 0 0.75rem; }
  .prose h3 { font-size: 1.1rem; margin: 1.5rem 0 0.5rem; }
  .prose p  { margin-bottom: 1rem; }
  .prose ul, .prose ol { margin: 0.5rem 0 1rem 1.5rem; }
  .prose li { margin-bottom: 0.3rem; }
  .prose blockquote {
    border-left: 3px solid var(--accent);
    padding-left: 1rem;
    color: var(--text-secondary);
    margin: 1rem 0;
  }
  .prose table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.875rem;
  }
  .prose th, .prose td {
    border: 1px solid var(--border);
    padding: 0.5rem 0.75rem;
    text-align: left;
  }
  .prose th { background: var(--bg-secondary); font-weight: 600; }
</style>
```

### `src/components/Nav.astro`
```astro
---
const currentPath = Astro.url.pathname;
const isActive = (path: string) =>
  currentPath === path || currentPath.startsWith(path + '/');
---

<aside class="sidebar">
  <div>
    <a href="/" class="site-title" style="text-decoration: none;">
      슬전생
    </a>
    <p class="site-subtitle">슬기로운 전문연구요원 생활</p>
  </div>

  <nav>
    <div class="nav-section">
      <div class="nav-section-title">탐색</div>
      <a href="/" class:list={['nav-link', { active: currentPath === '/' }]}>
        🏠 홈
      </a>
      <a href="/blog" class:list={['nav-link', { active: isActive('/blog') }]}>
        📝 블로그
      </a>
      <a href="/about" class:list={['nav-link', { active: isActive('/about') }]}>
        👤 소개
      </a>
      <a href="/archive" class:list={['nav-link', { active: isActive('/archive') }]}>
        📦 아카이브
      </a>
    </div>

    <div class="nav-section" style="margin-top: 1rem;">
      <div class="nav-section-title">카테고리</div>
      <a href="/categories/입영-편입" class:list={['nav-link', { active: isActive('/categories/입영-편입') }]}>
        입영 / 편입
      </a>
      <a href="/categories/복무-관리" class:list={['nav-link', { active: isActive('/categories/복무-관리') }]}>
        복무 관리
      </a>
      <a href="/categories/병역법-규정" class:list={['nav-link', { active: isActive('/categories/병역법-규정') }]}>
        병역법 / 규정
      </a>
      <a href="/categories/경력-개발" class:list={['nav-link', { active: isActive('/categories/경력-개발') }]}>
        경력 개발
      </a>
      <a href="/categories/후기-QnA" class:list={['nav-link', { active: isActive('/categories/후기-QnA') }]}>
        후기 / Q&A
      </a>
    </div>

    <div class="nav-section" style="margin-top: 1rem;">
      <div class="nav-section-title">링크</div>
      <a href="https://github.com/cyeo" class="nav-link" target="_blank" rel="noopener">
        GitHub ↗
      </a>
      <a href="https://www.linkedin.com/in/joominyeo" class="nav-link" target="_blank" rel="noopener">
        LinkedIn ↗
      </a>
    </div>
  </nav>
</aside>
```

### `src/components/PostCard.astro`
```astro
---
interface Props {
  title: string;
  slug: string;
  pubDate: Date;
  category: string;
  tags: string[];
  description?: string;
}

const { title, slug, pubDate, category, tags, description } = Astro.props;
const isArchived = pubDate.getFullYear() < 2020;
const dateStr = pubDate.toLocaleDateString('ko-KR', {
  year: 'numeric', month: 'long', day: 'numeric'
});
---

<article class="post-card">
  <a href={`/blog/${slug}`} style="text-decoration: none;">
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
      {isArchived && <span class="archive-badge">보관됨</span>}
      <span class="tag">{category}</span>
    </div>
    <h2 class="post-card-title">{title}</h2>
    <div class="post-card-meta">
      <time datetime={pubDate.toISOString()}>{dateStr}</time>
      {tags.slice(0, 3).map(tag => <span>#{tag}</span>)}
    </div>
    {description && <p class="post-card-excerpt">{description}</p>}
  </a>
</article>
```

### `src/components/Footer.astro`
```astro
---
const year = new Date().getFullYear();
---

<footer style="
  margin-left: var(--sidebar-width);
  padding: 2rem;
  border-top: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
">
  <span>© {year} Cai (Joomin) Yeo</span>
  <span>슬전생 · Built with Astro</span>
</footer>

<style>
  @media (max-width: 768px) {
    footer { margin-left: 0; }
  }
</style>
```

### `src/pages/index.astro`
```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import PostCard from '../components/PostCard.astro';
import Footer from '../components/Footer.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) =>
  !data.draft && data.pubDate.getFullYear() >= 2020
))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 8);
---

<Base title="홈">
  <Nav />
  <main class="main-content">
    <section style="margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border);">
      <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem;">
        슬전생 👋
      </h1>
      <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; max-width: 560px;">
        <strong style="color: var(--text-primary);">슬기로운 전문연구요원 생활</strong> — 전문연구요원 제도를 처음 접하는 분들을 위한
        실용적인 안내서입니다. 편입 절차부터 복무 관리, 경력 개발까지 함께 정리합니다.
      </p>
      <div style="margin-top: 1rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="/blog" class="tag" style="font-size: 0.85rem; padding: 0.3rem 0.9rem;">글 목록 보기</a>
        <a href="/about" class="tag" style="font-size: 0.85rem; padding: 0.3rem 0.9rem;">블로그 소개</a>
      </div>
    </section>

    <section>
      <h2 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 1.25rem; color: var(--text-secondary);">
        최근 글
      </h2>
      {posts.map(post => (
        <PostCard
          title={post.data.title}
          slug={post.slug}
          pubDate={post.data.pubDate}
          category={post.data.category}
          tags={post.data.tags}
          description={post.data.description}
        />
      ))}
    </section>
  </main>
  <Footer />
</Base>
```

### `src/pages/blog/[...slug].astro`
```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogPost
  title={post.data.title}
  description={post.data.description}
  pubDate={post.data.pubDate}
  category={post.data.category}
  tags={post.data.tags}
>
  <Content />
</BlogPost>
```

### `src/pages/about.astro`
```astro
---
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
---

<Base title="소개" description="Cai (Joomin) Yeo 소개">
  <Nav />
  <main class="main-content">
    <h1 style="font-size: 1.75rem; margin-bottom: 2rem;">소개</h1>

    <section style="margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1rem;">About Me</h2>
      <p style="line-height: 1.8; max-width: 620px;">
        안녕하세요, <strong>Cai (Joomin) Yeo</strong>입니다. 현재 서울 로보틱스(Seoul Robotics)에서
        인프라 기반 자율주행 시스템 개발을 담당하며 <strong>전문연구요원</strong>으로 복무 중입니다.
        코넬 대학교(Cornell University) 졸업 후 한국으로 돌아와 국방의 의무를 이행하면서 느낀 것들,
        그리고 전문연구요원 제도를 처음 접하는 분들이 겪는 어려움을 해소하고자 이 블로그를 시작했습니다.
      </p>
    </section>

    <section style="margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1rem;">경력</h2>
      <div style="border-left: 2px solid var(--border); padding-left: 1.25rem;">
        <div style="margin-bottom: 1.25rem;">
          <strong>Seoul Robotics</strong>
          <p style="color: var(--text-secondary); font-size: 0.875rem;">
            Infrastructure-based Autonomous Vehicles · 전문연구요원<br/>
            Seoul, South Korea
          </p>
        </div>
        <div>
          <strong>Cornell University</strong>
          <p style="color: var(--text-secondary); font-size: 0.875rem;">학사 졸업</p>
        </div>
      </div>
      <!-- TODO: Add full resume content here when resume PDF is provided -->
    </section>

    <section style="margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1rem;">특허</h2>
      <div class="post-card" style="font-size: 0.875rem;">
        <strong>US 2026/0031740 A1</strong>
        <p style="color: var(--text-secondary); margin-top: 0.25rem;">
          RECONFIGURATION OF DIRECT CURRENT FAST CHARGING POWER ELECTRONIC MODULE
          TO PERFORM VEHICLE-TO-VEHICLE APPLICATIONS<br/>
          <em>Issued: Jan 29, 2026</em>
        </p>
      </div>
    </section>

    <section style="margin-bottom: 2.5rem;">
      <h2 style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1rem;">언어</h2>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <span class="tag">English — Native/Bilingual</span>
        <span class="tag">Korean — Native/Bilingual</span>
      </div>
    </section>

    <section>
      <h2 style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 1rem;">연락처</h2>
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <a href="https://www.linkedin.com/in/joominyeo" class="tag" target="_blank" rel="noopener">
          LinkedIn ↗
        </a>
        <a href="https://github.com/cyeo" class="tag" target="_blank" rel="noopener">
          GitHub ↗
        </a>
      </div>
    </section>
  </main>
  <Footer />
</Base>
```

### `src/pages/archive/index.astro`
```astro
---
import Base from '../../layouts/Base.astro';
import Nav from '../../components/Nav.astro';
import PostCard from '../../components/PostCard.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) =>
  !data.draft && data.pubDate.getFullYear() < 2020
))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<Base title="아카이브" description="2020년 이전 글 목록">
  <Nav />
  <main class="main-content">
    <h1 style="font-size: 1.75rem; margin-bottom: 0.5rem;">아카이브</h1>
    <p style="color: var(--text-secondary); margin-bottom: 2rem;">
      2020년 이전에 작성된 글들입니다. ({posts.length}개)
    </p>
    {posts.length === 0
      ? <p style="color: var(--text-secondary);">보관된 글이 없습니다.</p>
      : posts.map(post => (
          <PostCard
            title={post.data.title}
            slug={post.slug}
            pubDate={post.data.pubDate}
            category={post.data.category}
            tags={post.data.tags}
            description={post.data.description}
          />
        ))
    }
  </main>
  <Footer />
</Base>
```

### `src/pages/blog/index.astro`
```astro
---
import Base from '../../layouts/Base.astro';
import Nav from '../../components/Nav.astro';
import PostCard from '../../components/PostCard.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) =>
  !data.draft && data.pubDate.getFullYear() >= 2020
))
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<Base title="블로그">
  <Nav />
  <main class="main-content">
    <h1 style="font-size: 1.75rem; margin-bottom: 2rem;">블로그</h1>
    {posts.map(post => (
      <PostCard
        title={post.data.title}
        slug={post.slug}
        pubDate={post.data.pubDate}
        category={post.data.category}
        tags={post.data.tags}
        description={post.data.description}
      />
    ))}
  </main>
  <Footer />
</Base>
```

### `src/pages/tags/[tag].astro`
```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Nav from '../../components/Nav.astro';
import PostCard from '../../components/PostCard.astro';
import Footer from '../../components/Footer.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const tagSet = new Set(posts.flatMap(p => p.data.tags));
  return [...tagSet].map(tag => ({
    params: { tag },
    props: { tag, posts: posts.filter(p => p.data.tags.includes(tag)) },
  }));
}

const { tag, posts } = Astro.props;
const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<Base title={`#${tag}`}>
  <Nav />
  <main class="main-content">
    <h1 style="font-size: 1.75rem; margin-bottom: 2rem;">#{tag}</h1>
    {sorted.map(post => (
      <PostCard
        title={post.data.title}
        slug={post.slug}
        pubDate={post.data.pubDate}
        category={post.data.category}
        tags={post.data.tags}
        description={post.data.description}
      />
    ))}
  </main>
  <Footer />
</Base>
```

### `src/pages/categories/[category].astro`
```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Nav from '../../components/Nav.astro';
import PostCard from '../../components/PostCard.astro';
import Footer from '../../components/Footer.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const catSet = new Set(posts.map(p => p.data.category));
  return [...catSet].map(category => ({
    params: { category },
    props: { category, posts: posts.filter(p => p.data.category === category) },
  }));
}

const { category, posts } = Astro.props;
const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<Base title={category}>
  <Nav />
  <main class="main-content">
    <h1 style="font-size: 1.75rem; margin-bottom: 2rem;">{category}</h1>
    {sorted.map(post => (
      <PostCard
        title={post.data.title}
        slug={post.slug}
        pubDate={post.data.pubDate}
        category={post.data.category}
        tags={post.data.tags}
        description={post.data.description}
      />
    ))}
  </main>
  <Footer />
</Base>
```

---

## 8. Sample Blog Posts

### `src/content/blog/2024-01-15-welcome.md`
```markdown
---
title: "슬전생을 시작하며"
description: "전문연구요원 제도에 대해 처음 알게 된 분들을 위한 입문 안내"
pubDate: 2024-01-15
category: 후기-QnA
tags: [소개, 전문연구요원, 입문]
---

# 슬전생을 시작하며

전문연구요원 제도는 이공계 석·박사 연구자가 군 복무를 대체하여
병역지정업체에서 연구 업무를 수행하는 대한민국 병역 특례 제도입니다.

이 블로그에서는 제가 직접 경험하며 얻은 정보를 바탕으로,
처음 접하는 분들이 혼란 없이 제도를 이해하고 준비할 수 있도록 돕겠습니다.

## 이 블로그에서 다루는 내용

- 편입 절차 및 준비 서류
- 병역지정업체 선택 기준
- 복무 중 지켜야 할 규정
- 경력 개발과 병역의 균형
- Q&A 및 후기
```

### `src/content/blog/2019-06-01-archive-example.md`
```markdown
---
title: "2019년 아카이브 예시 글"
description: "아카이브 기능 테스트용 예시"
pubDate: 2019-06-01
category: 기타
tags: [아카이브, 테스트]
---

이 글은 2020년 이전에 작성된 글로, 아카이브 섹션에 자동으로 분류됩니다.
```

---

## 9. GitHub Actions Deploy (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

---

## 10. Favicon (`public/favicon.svg`)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0d1117"/>
  <text x="16" y="22" font-size="18" text-anchor="middle"
        font-family="Pretendard,sans-serif" fill="#58a6ff">슬</text>
</svg>
```

---

## 11. Final `package.json` scripts to verify

After `npm create astro@latest`, ensure `package.json` has:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

---

## 12. Checklist Before First Push

- [ ] Update `site:` in `astro.config.mjs` with your actual GitHub Pages URL
- [ ] Download Pretendard font to `public/fonts/`
- [ ] Confirm GitHub Pages is enabled on the repo (Settings → Pages → Source: GitHub Actions)
- [ ] Add resume content to `src/pages/about.astro` (no resume file was found at time of planning)
- [ ] Run `npm run dev` — verify site loads at `http://localhost:4321`
- [ ] Run `npm run build` — verify no TypeScript errors
- [ ] Check Network tab on hover over nav links — prefetch requests should fire before click
- [ ] Run Lighthouse — target Performance ≥ 95

---

## 13. Color Palette Notes

The palette above (`--bg-primary: #0d1117` etc.) is derived from GitHub Dark theme which closely matches what joominyeo.github.io appears to use. If you want the exact colors:
1. Open https://joominyeo.github.io/ in Chrome DevTools
2. Go to Elements → select `<html>` or `<body>`
3. Copy any CSS custom properties and replace the `:root` block in `src/styles/global.css`

---

## 14. Adding New Blog Posts

Create a new file in `src/content/blog/`:

```
src/content/blog/YYYY-MM-DD-slug.md
```

```markdown
---
title: "글 제목"
description: "한 줄 요약"
pubDate: 2024-06-01   ← YYYY-MM-DD format
category: 복무-관리   ← matches nav categories
tags: [태그1, 태그2]
draft: false
---

본문 내용...
```

Posts with `pubDate` before 2020-01-01 automatically appear in `/archive` instead of `/blog`.
