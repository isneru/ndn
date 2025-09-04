# neru's Vault

neru's Vault is a minimal file sharing and CDN service built with Nuxt 4, AWS S3 (Backblaze B2), and Vue 3. It allows users to upload, share, and serve files with direct links and Open Graph image previews for social sharing.

## Features

- Drag-and-drop file upload
- Direct file sharing links
- Raw file serving (browser default behavior)
- Open Graph image previews for social media
- Authentication via GitHub (admin only)
- Modern UI with Tailwind CSS

## Getting Started

### Setup

Install dependencies:

```bash
# bun
bun install
# npm
npm install
# pnpm
pnpm install
# yarn
yarn install
```

### Development

Start the development server:

```bash
bun run dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production

Build and preview the production app:

```bash
bun run build
bun run preview
# or
npm run build
npm run preview
```

## Configuration

Copy `.env.example` to `.env` and fill in your AWS/Backblaze credentials, GitHub OAuth keys, and secrets.

## Deployment

See [Nuxt deployment docs](https://nuxt.com/docs/getting-started/deployment) for details.

## License

MIT
