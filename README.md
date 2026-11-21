# Vastu Vihar Nepal

Marketing website for **Vastu Vihar Nepal**, a developer of planned residential townships across Nepal. It is a single landing page built with Next.js (App Router), React and TypeScript, styled with CSS Modules.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19
- TypeScript 5
- CSS Modules
- Local fonts loaded with `next/font/local`: Involve (headings) and Switzer (body)
- ESLint 9 with `eslint-config-next`

## Getting started

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | What it does                       |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the development server       |
| `npm run build` | Create a production build          |
| `npm run start` | Serve the production build         |
| `npm run lint`  | Run ESLint                         |

## Project structure

```
public/                  Static assets (images, icons, model and property photos)
src/
  app/
    layout.tsx           Root layout: fonts, metadata, header and footer
    page.tsx             Landing page, built from the section components
    globals.css          Global styles and CSS variables
  components/
    header/              Sticky header with desktop dropdowns and mobile menu
    home/                Hero, stat counters, about section
    homes/               "Explore homes" project showcase
    amenities/           Amenities marquee
    awards/              Awards section
    career/              Careers section
    quality/             Quality section
    journey/             Company journey timeline
    testimonials/        Customer testimonials
    footer/              Site footer
    buttons/             Shared ActionButton, IconButton and FlipButtons
  data/                  Content for each section as typed TypeScript objects
  fonts/                 Involve and Switzer .woff2 files
```

## Editing content

All copy, links and image paths are in `src/data/`, one file per section (`hero.ts`, `about.ts`, `projects.ts`, `testimonials.ts`, `navigation.ts`, `footer.ts` and so on). To change text or swap images, edit these files and leave the components alone. Image paths point to files under `public/`.

Site metadata (page title, description, favicon) also comes from `src/data/about.ts`.

## Component pattern

Most sections come in two parts:

- `Section.tsx`: a server component that reads data from `src/data/`
- `SectionClient.tsx`: a client component that handles interactivity and animation

Every component has a matching `.module.css` file next to it.

## Note for AI coding agents

This project runs a Next.js version with breaking changes. Read `AGENTS.md` and the docs in `node_modules/next/dist/docs/` before changing any code.

## Deployment

The site can be deployed to any host that supports Next.js, such as [Vercel](https://vercel.com/new). Run `npm run build` to make sure the production build works before you deploy.
