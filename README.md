# Benevolent

A no-build static personal site for **benevolent.arlonbharat.com**. It is intentionally pseudonymous on-page and includes a home page, notes index, starter post, post template, animated light/dark theme toggle, responsive layout, metadata, sitemap, and basic security headers.

## Local preview

A local server is preferable because the notes list is loaded from `content/posts.json`.

```bash
python -m http.server 3000
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Commit this directory to a GitHub repository.
2. In Vercel, import the repository as a new project. No framework or build command is required; the output directory is the repository root.
3. In **Project → Settings → Domains**, add `benevolent.arlonbharat.com`.
4. At the DNS provider for `arlonbharat.com`, create the CNAME record Vercel shows. The record name will usually be `benevolent`; copy the project-specific target exactly from Vercel rather than assuming a generic value.
5. Return to Vercel and verify the domain/SSL status.

CLI equivalent after `vercel link`:

```bash
vercel domains add benevolent.arlonbharat.com YOUR_PROJECT_NAME
vercel domains inspect benevolent.arlonbharat.com
```

## Publish a new note

1. Copy `blog/_post-template.html` to `blog/your-slug.html`.
2. Replace the title, description, metadata, heading, and article body.
3. Add an entry at the top of `content/posts.json`:

```json
{
  "slug": "your-slug",
  "title": "Your title",
  "date": "2026-07-20",
  "dateLabel": "20 Jul 2026",
  "readingTime": "5 min read",
  "description": "One-sentence summary.",
  "tags": ["security"]
}
```

Available homepage/blog filters are `security`, `systems`, `meta`, and `rant`. You can add more filter buttons in `blog/index.html`.

## Change the bio or links

- Homepage copy and links: `index.html`
- GitHub: currently `https://github.com/benevolentcyka`
- Email: currently `benevolent@arlonbharat.com`
- Profile image: `assets/avatar.webp`
- Social preview card: `assets/og-card.png`
- Theme/design: `assets/styles.css`
- Theme motion and note rendering: `assets/app.js`

## Responsible-disclosure publishing checklist

Before publishing a vulnerability write-up, remove credentials, session identifiers, personal data, internal-only URLs, and exploit details that create unnecessary risk. Record the original report date, acknowledgement date, remediation date, affected versions, and disclosure timeline. State clearly what was tested and what was not.

## Identity boundary

The public pages use only **Benevolent**. The uploaded CV's legal name, personal phone number, personal email, and direct employer title were deliberately not copied into the site.
