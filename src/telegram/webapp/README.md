## Cloud Storage WebApp (Local Test)

### 1) Expose local server with Cloudflare
- `cloudflared tunnel --url http://localhost:3000`
- Copy the **https://...trycloudflare.com** URL

### 2) Start the app with the WebApp URL
- `TELEGRAM_WEBAPP_URL=https://your-trycloudflare-url pnpm start:dev`

### 3) Open the WebApp in Telegram
- In chat: `/cloud_storage_webapp`
- Tap **Open**

### 4) Use the page
- The WebApp UI is served at: `/webapp/cloud-storage`
- Use **Set / Get / Remove / List Keys**
