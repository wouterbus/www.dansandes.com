# Sandes — Sanity Studio

Project: `89ztrc1x` · dataset: `production`

## Local studio

```bash
npm install
npm run dev
```

Opens at [http://localhost:3333](http://localhost:3333).

## Deploy hosted studio

From this folder (repo root, not `web/`):

```bash
npx sanity login
npm run deploy
```

Choose a hostname when prompted (e.g. `sandes`). The studio will be at `https://<hostname>.sanity.studio`.

## Hero video upload stuck?

Large files (e.g. 80+ MB `.mov`) often look frozen while uploading. Prefer a compressed **MP4** (about **5–15 MB**) for the hero loop. If an upload fails:

1. Refresh the studio tab.
2. Remove any failed/partial file on the hero field.
3. Upload the smaller MP4 (or a GIF).
4. Click **Publish**.

## Links

- [Sanity getting started](https://www.sanity.io/docs/introduction/getting-started)
- [Manage project](https://www.sanity.io/manage/project/89ztrc1x)
