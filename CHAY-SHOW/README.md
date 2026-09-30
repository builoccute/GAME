# CHẠY SHOW — V1.0

Game mô phỏng tổ chức sự kiện chạy trên React/Vite + Cloudflare Workers.

## Cloudflare bindings
- D1: `DB` → database `game` (`5d0864fc-4a20-447e-9b6a-4d27667e66e9`)
- R2: `ASSETS` → bucket `game`
- Static assets: `STATIC` → `./dist`

## Deploy lần đầu
```bash
npm install
npm run build
npx wrangler d1 migrations apply DB --remote
npx wrangler deploy
```

Các lần deploy sau:
```bash
npm run deploy
```

## V1 có sẵn
- 5 loại sự kiện
- 100 sự cố ngẫu nhiên
- 25 nhân sự
- 20 nhà cung cấp
- quản lý ngân sách / khách / uy tín / truyền thông / team / đối tác / stress
- Inbox giả lập
- nhật ký quyết định
- autosave LocalStorage
- D1 leaderboard + cloud-save API
- R2 media endpoint `/media/*`
- responsive desktop/mobile

Không cần secret để chạy V1.
