# Creght Blocks Agent Notes

## 资源规则

### 图片：全部上传到 Creght CDN

- 组件、封面、文档用到的图片（png / jpg / webp / avif / svg / gif / mp4 等）一律上传到 Creght CDN，组件代码和 registry 里只引用 `https://fsu.creght.com/...` 地址，不引用本地路径或第三方图床。
- 上传命令：

  ```bash
  creght upload --site_id=p35l7ulie6he/p35l7ulpwviq --file=<file> --json
  ```

  文件名用 `creght_blocks_<block>_<用途>.<ext>` 的形式，便于在 CDN 上辨认。
- 上传后把 `本地路径 -> CDN 地址` 写入 `scripts/creght-cdn-assets.json`，再运行 `npm run registry:build`，让 `registry.json`、`registry.catalog.json`、`public/r/*` 同步更新。
- 替换已有资源时，上传新文件并更新映射，不要复用旧 URL（CDN 会缓存）。

### 封面图

- 封面用组件的真实渲染截图，不用生成图或示意图。
- 打开 `npm run dev` 后的 `/preview/<block>`，截图规格为 1536×1024（3:2），并且组件要填满画面、不留空白。可以先调整视口宽度，让组件高度刚好是 3:2，再按 2 倍分辨率截图后缩放。
- 输出 webp（`cwebp -q 90 -resize 1536 1024`），覆盖 `public/covers/<block>.webp`，然后按上面的流程上传到 CDN 并更新映射。

### 字体：优先使用 Google Fonts

- 新组件的字体优先从 Google Fonts 选择，并通过 Google Fonts 加载（`fonts.googleapis.com` 的 CSS `@import` 或 `<link>`）。
- 设计稿中的字体如果不在 Google Fonts 上，先找视觉接近的 Google Fonts 替代字体。确实需要原字体时，再把 woff2 上传到 Creght CDN，用 `@font-face` 引用 CDN 地址。不要把字体文件放在仓库里直接引用。

## 检查

```bash
npm run registry:build   # 生成 registry 并运行一致性检查
```
