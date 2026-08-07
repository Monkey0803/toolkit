# 工具箱 · Toolkit

一个零依赖思维的轻量工具集合网站，收录 20 个日常小工具，全部在浏览器本地运行，无需账号、无需后端。

## 功能

- **27 个可用工具**：文本（字数统计、大小写转换、Markdown 预览、文本对比、文本行工具）、转换（编码转换、图片转 Base64、时间戳、单位）、开发（JSON、UUID、正则、JWT 解码、哈希、进制转换）、图片与颜色（颜色转换、对比度、渐变、图片缩放、二维码）、生成器（密码、占位文本）、生活（百分比、小费、日期差值、房贷、BMI）
- **编码转换**：Base64 / Base32 / Base58 / Base16、URL、Unicode、UTF-8 双向编解码，支持中文
- **目录体验**：搜索（`/` 聚焦、`Esc` 清空）、分类筛选、已收藏筛选
- **中英双语**：默认中文，头部按钮一键切换，选择持久化
- **深色模式**：默认跟随系统，头部一键切换，选择持久化
- **收藏**：通过 `localStorage` 持久化
- **可直接打开的构建产物**：`npm run build` 会把 JS/CSS 内联进 `dist/index.html`，双击即可离线使用

## 技术栈

- Vite + React + TypeScript
- Vitest（纯函数测试 + Testing Library 组件测试）
- Hash 路由（`#/tools/<route>`，无需服务器重写规则）
- 唯一第三方运行依赖：`qrcode-generator`（二维码生成）

## 快速开始

```bash
npm install
npm run dev      # 本地开发 http://localhost:5173
npm test         # 运行测试
npm run build    # 生产构建，产物在 dist/
npm run test:dist # 构建并校验 dist/index.html 可自包含打开
```

构建后可直接双击打开 `dist/index.html`，无需启动服务器。

## 部署

项目使用 Hash 路由，静态托管即可，无需 SPA fallback 规则。

### GitHub Pages

当前站点地址：`https://<用户名>.github.io/<仓库名>/`

仓库内置 `.github/workflows/deploy-pages.yml`，推送到 `main` 后自动构建并把 `dist/` 发布到 `gh-pages` 分支。首次使用需在仓库 **Settings → Pages** 将 Source 设为 **Deploy from a branch**，分支选 `gh-pages`、目录 `/ (root)`。

#### 部署排错记录（踩过的坑）

1. **GH007 邮箱隐私拦截推送**：本地 `git config user.email` 若用了私密邮箱，GitHub 会拒绝 `git push`（`GH007: push would publish a private email address`）。解决：
   - 在 `github.com/settings/emails` 关闭「Block command line pushes that expose my email」，或
   - 改用 GitHub 提供的 noreply 邮箱（`<ID>+<用户名>@users.noreply.github.com`，ID 可用 `gh api user --jq .id` 查询），并用 `git filter-branch --env-filter` 重写已有提交的作者/提交者邮箱后重新推送。

2. **`actions/deploy-pages@v4` 部署被反复取消**：新仓库首次用 GitHub Actions 方式（`build_type: workflow`）部署时，Pages 后端可能留下卡住的部署记录，之后每次 `deploy-pages` 都报 `Deployment cancelled` 且复用同一个 `pages_build_version`。重建设站（删除再 `POST /repos/<owner>/<repo>/pages`）也无法清空。解决：改用 `peaceiris/actions-gh-pages` 把 `dist/` 直接推到 `gh-pages` 分支，并让 Pages 从分支托管（`build_type: legacy`）。该方式稳定可靠，本仓库当前采用此方案。

3. **首次部署需要几分钟**：Pages 从 `gh-pages` 分支构建到对外可访问通常需要 1~3 分钟，`curl` 返回 404 属正常，稍等后即变为 200。

### Vercel

创建新项目并导入本仓库即可。Vercel 会自动识别 Vite，构建命令 `npm run build`，输出目录 `dist`。

### Netlify

仓库已内置 `netlify.toml`，构建命令 `npm run build`，发布目录 `dist`。拖入仓库或连接 GitHub 即可。

## 项目结构

```
public/                  # favicon、robots、.nojekyll 等静态资源
src/
  components/tools/      # 20 个工具页
  components/ToolPageShell.tsx  # 工具页共享外壳
  context/LanguageContext.tsx   # 双语状态
  data/tools.ts          # 工具目录数据
  lib/i18n.ts            # 中英文字典
  lib/toolkit.ts         # 搜索与收藏辅助
  lib/toolkit-tools.ts   # 工具纯函数逻辑
  App.tsx                # Hash 路由与目录页
scripts/
  inline-dist.mjs        # 构建后内联 JS/CSS 到 index.html
  verify-dist.mjs        # 校验自包含产物
```

## 设计说明

- 工具名称保留英文技术词（JSON、Base64、UUID 等），界面文案全量双语
- 构建产物自包含：通过 `base: './'` 加内联脚本实现 `file://` 直接打开
- 明确不包含：登录、云端同步、后端 API、评论评分、内容管理
