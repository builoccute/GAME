# VẠN NGHỀ — Web Simulation Game V2

Một thành phố mô phỏng với 60 nghề/game: 50 nghề đại chúng + 10 lĩnh vực hoạt động cộng đồng.
NPC dùng procedural generation theo ID/seed, không hard-code tổng số NPC. Chỉ giới hạn số NPC được render cùng lúc để giữ FPS.

## Cloudflare
- Root directory: `CHAY-SHOW`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- D1 binding: `DB` -> database `game`
- D1 ID: `5d0864fc-4a20-447e-9b6a-4d27667e66e9`
- R2 binding: `ASSETS` -> bucket `game`
- Worker: `game`

## Lần đầu
```bash
npm install
npm run build
npx wrangler d1 migrations apply DB --remote
npx wrangler deploy
```

Sau khi đã migrate D1, các lần sau chỉ cần build/deploy.

## Thiết kế
- Không dashboard/form làm gameplay chính.
- City map toàn màn hình, kéo/zoom, 60 tòa nhà nghề nghiệp.
- NPC di chuyển trực tiếp trên map; danh tính sinh procedural không giới hạn.
- 10 engine minigame dùng chung hạ tầng nhưng từng nghề có tên nhiệm vụ, vật phẩm, nhịp và thưởng riêng.
- LocalStorage autosave; API D1 cloud-save/leaderboard có sẵn.
