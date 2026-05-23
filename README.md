# Markdownit Online

Markdownit Online is a multilingual Markdown creation studio for editing, previewing, and exporting Markdown documents to Word and PDF in the browser.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm test
npm run build
```

## Deployment

Deploy the private GitHub repository to Vercel and attach `markdownit.online` as the production domain.

## Analytics

Set these environment variables locally and in Vercel when analytics is ready:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

If either value is omitted, that script is not injected.

## Google Docs Export

Direct Google Docs export uses Google Identity Services and the Google Drive API. Create an OAuth 2.0 Web Client in Google Cloud, add the deployed domain and local development origin to Authorized JavaScript origins, enable the Google Drive API, and set:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

The app requests the `drive.file` scope and creates a converted Google Docs document in the signed-in user's Drive.
