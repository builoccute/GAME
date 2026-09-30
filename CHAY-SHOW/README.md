# CHẠY SHOW V1.0.1

Bản sửa lỗi màn hình trắng cho Cloudflare Workers Static Assets.

## Cloudflare build
- Root directory: `CHAY-SHOW`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

## Bindings
- D1: `DB` -> database `game` -> `5d0864fc-4a20-447e-9b6a-4d27667e66e9`
- R2: `ASSETS` -> bucket `game`

## D1 lần đầu
`npx wrangler d1 migrations apply DB --remote`

Bản này không dùng React/Vite ở runtime và build không cần dependency frontend. `npm run build` chỉ tạo `dist/` từ source tĩnh, giảm rủi ro trang trắng do bundle/runtime.
