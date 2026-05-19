## Client Social Media Content Studio

A small React + TypeScript website that helps you turn client briefs into a structured weekly social media content plan. It generates post types, angles, and detailed caption/script prompts you can paste into your AI tool of choice.

### Running the project

1. Install dependencies (inside the `social-media-content-site` folder):

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the URL printed in your terminal (usually `http://localhost:5173`).

### How to use this with clients

- Fill in:
  - **Client / brand name**
  - **Industry / niche**
  - **Ideal audience**
  - **Brand voice / tone**
  - **Primary campaign goal**
  - **Platforms** + **posts per week**
- Click **“Create weekly content plan”**.
- You’ll get:
  - A short **summary** of the content strategy.
  - A per‑platform list of **post ideas**.
  - Well‑structured **caption / script prompts** that already encode the brand, audience, goal, and platform best practices.

You can:

- Paste the prompts into tools like ChatGPT, Claude, etc., to generate full captions or scripts.
- Edit the prompts directly to match each client’s preferences.
- Export or copy the content into your own workflow (Notion, Google Docs, etc.).

### Swapping in a real AI backend (optional)

Right now, the `contentEngine.ts` file is pure logic that runs in the browser. If you want the site itself to generate final copy:

- Add a backend (Next.js API route, small Node/Express server, or serverless functions).
- Replace the `generateContentPlan` implementation with a call to your AI API.
- Keep the same input shape so the UI can stay as-is.

