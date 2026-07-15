# Memova 生产源归一化与隐藏页面重部署设计

日期：2026-07-15

## 目标

把 GitHub `main` 设为 Memova 官网唯一生产源，确保后续生产部署不会再把其他工作区中的未跟踪旧文件上传到 Cloudflare Pages。完成后重新发布并验证：

- `/odmpartnership/`
- `/team/weilijiang/`
- 最新 Privacy Policy
- SEO/GEO 静态页面、重定向、404 与 `noindex` 响应头

## 已确认根因

2026-07-14 的 Privacy Policy 部署从本地 `main` 工作区构建。该工作区中的 `client/public/odmpartnership/` 是未被 Git 跟踪的旧版本，但仍被 Vite 复制到 `dist/public`，随后随整站直接上传覆盖了已确认的新版本。

## 方案

### 1. 统一生产分支

在隔离且干净的 `codex/seo-geo-foundation` 工作区中合并最新 `origin/main`，保留：

- Google OAuth Privacy Policy 更新；
- 最新 ODM 合作页面；
- 江维力博士团队页面；
- SEO/GEO 静态生成、真实 404、`_headers` 与 `_redirects`；
- 对两个隐藏页面的自动化回归测试。

验证后把这一完整提交历史推送到 GitHub `main`。不从存在未跟踪生产文件的旧 `main` 工作区部署。

### 2. 部署源门禁

新增一个可测试的部署源检查脚本，至少检查：

- 当前工作树必须干净；
- `client/public`、SEO 生成脚本、路由配置和页面源码不得存在未跟踪或未提交文件；
- ODM 与江维力页面必须存在于 Git 索引中；
- 当前提交必须与预期推送的生产提交一致。

门禁只报告并阻止部署，不自动 `git add` 或提交未知文件，避免误上传临时、私人或无关素材。

### 3. 固定发布顺序

生产发布固定为：

1. 部署源门禁；
2. 完整测试与 TypeScript 检查；
3. 生产构建与 SEO 检查；
4. 推送当前已验证提交到 GitHub `main`；
5. 从同一提交的 `dist/public` 上传 Cloudflare Pages `main`；
6. 验证 GitHub、Pages 部署源提交和线上页面一致。

任何一步失败都停止，不继续上传。

## 测试与验收

### 自动化

- 先添加会失败的门禁测试，证明未跟踪的 `client/public` 文件会被拒绝；
- 实现最小检查脚本后让测试通过；
- 运行全部 Vitest、TypeScript、生产构建和 SEO 验证；
- 比较源文件与构建产物哈希。

### 线上验收

- `/odmpartnership` 与 `/odmpartnership/` 均正常；
- `/team/weilijiang` 与 `/team/weilijiang/` 均正常；
- 两页均返回 `X-Robots-Tag: noindex, nofollow`；
- ODM 页面包含三款首轮产品和五档产品等级，不包含旧的具体美元售价；
- Privacy Policy 保留 Google Sign-In、Gmail、Calendar 与 Limited Use 条款；
- 桌面端与手机端无 404、无横向溢出、无框架错误覆盖层；
- GitHub `main` 的页面文件与线上生产版本来自同一提交。

## 边界

- 不启用 Cloudflare Git 自动构建，本次继续使用现有直接上传方式；
- 不自动提交所有脏文件；
- 不删除旧工作区中的用户文件；
- 不改动页面文案与视觉设计，只恢复已经确认的两个页面并修复发布流程。

