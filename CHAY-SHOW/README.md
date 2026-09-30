# VẠN NGHỀ V3

Bản dựng lại theo hướng game-first: nhân vật hoạt hình vector, không gian nghề nghiệp trực quan, NPC procedural, 60 nghề (50 đại chúng + 10 cộng đồng), thao tác trực tiếp và giao diện ổn định không camera shake.

## Cloudflare
- Worker: `game`
- D1 binding: `DB` → database `game`
- D1 ID: `5d0864fc-4a20-447e-9b6a-4d27667e66e9`
- R2 binding: `ASSETS` → bucket `game`
- Root directory trên Cloudflare: `CHAY-SHOW`

## Build / deploy
- Build command: `npm run build`
- Deploy command: `npx --yes wrangler@4.144.0 deploy`
- Migration khi cần: `npx --yes wrangler@4.144.0 d1 migrations apply DB --remote`
