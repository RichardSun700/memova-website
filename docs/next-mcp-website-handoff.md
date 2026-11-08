# Memova Next MCP 官网接入

本轮在现有官网项目中完成 Next MCP 接入，本地分支为 `feature/next-mcp-local-20261108`。正式网页 origin 采用现有的 `https://memova.ai`。

## 页面与配置

| 页面 | 用途 |
| --- | --- |
| `/mcp` | 六类云端内容与只读接入介绍 |
| `/mcp/setup` | 服务器地址、客户端安装、可复制提示词、加载和读取验证 |
| `/login`、`/mcp/login` | Python 邮箱验证码登录，保留原站内返回目标 |
| `/mcp/oauth/consent?request_id=…` | 账号、客户端、资源、权限、期限、批准或拒绝 |
| `/connected-clients` | 查看本人连接及撤销指定连接 |

账号 API 与授权 API 均为 `https://api.memova.ai`，安装 endpoint 为 `https://api.memova.ai/v2/mcp`，权限为 `next.read`。公开配置在 `.env.production` 与 `.env.development`，构建会校验环境与三个地址。隔离测试须显式选择 `isolated-test`，同时配置交接文档指定的测试 API 与 endpoint。

旧版 `/mcp` resource 的有效权限继续在授权页单独展示。网页不兑换或保存 Agent 的 MCP token。批准与拒绝均校验后台返回值，并原样跳到后台登记的 callback。

网站会话改为按 API 和环境绑定的标签页存储。已有网站用户需重新登录一次。退出清理当前标签页会话，Agent 授权通过连接管理单独撤销。登录及授权页面关闭统计采集、使用本地字体，并配置 CSP、禁止缓存和 referrer 保护。

## 本地检查

- `npm run check` 通过。
- 98 项相关测试通过，覆盖配置、登录返回、验证码状态、会话、授权与撤销、私有页面和 SEO 生成。
- `npm run build` 通过，`npm run check:seo` 通过。
- 浏览器检查了手机宽度下安装说明、登录深链接、语言切换，以及明确标注本地预览的批准和过期状态。
- 公开发现文档确认了 `/v2/mcp`、`next.read`、root issuer 和 S256。主域名的认证 API CORS 预检通过。
- 真实邮件验证码、本人账号授权、当前 Codex 聊天的工具加载和读取、指定连接的实际撤销仍待联调。

本地完整构建预览为 `http://127.0.0.1:4200/mcp/setup?lang=zh`。启动命令为 `npm run build` 后执行 `PORT=4200 npm start`。开发界面预览可执行 `npm run dev -- --host 127.0.0.1 --port 4201`，合成授权界面位于 `/mcp/oauth/consent?request_id=design-preview&lang=zh`。

## 给后端维护者的配置申请

网站发布并核对深链接后，请只将目标正式环境的 `MCP_NEXT_OAUTH_CONSENT_URL` 从 `https://stnextmcpauth261107.z11.web.core.windows.net/mcp/oauth/consent` 切到 `https://memova.ai/mcp/oauth/consent`，按后端既有发布流程执行并提供脱敏版本与回滚回执。核对新 origin 的认证与授权 CORS。旧 `MCP_OAUTH_CONSENT_URL`、root issuer、resource 和已有凭据沿用其当前契约。

官网代码包含认证及 MCP 页面从 `www.memova.ai` 到主域名的重定向，保留完整 query。需在获准发布后核验 Cloudflare Pages middleware 的实际响应。

接管验收由用户在网页完成邮件验证码登录及授权，再回到同一个 Codex 聊天调用 `get_next_account` 和一次无关键词、日期、时区、状态过滤的 `search_next_data(limit=3)`。五个工具加载、实际读取、详情和下载分别记录。空搜索可以证明连接可读，详情或下载缺少样本时单列未验证。邀请码要求按当时已发布的 Python 接口返回处理，当前精确错误契约仍待后端确认。

网页回滚到上一生产版本 `71e75d8` 的既有部署。Next consent 回滚到上述临时正式站地址，保留该站作为接管回退入口。
