import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  RotateCcw,
} from "lucide-react";
import {
  EnterpriseHeader,
  EnterpriseFooter,
} from "@/components/enterprise/EnterpriseShell";
import { useLegalLanguage } from "@/seo/legalLanguage";
import "@/styles/enterprise.css";

export default function EnterpriseContact() {
  const zh = useLegalLanguage() === "zh";
  const L = (cn: string, en: string) => (zh ? cn : en);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [reference, setReference] = useState("");
  const requestId = useRef("");
  const snapshot = useRef("");
  const status = useRef<HTMLDivElement>(null);
  const email = "richard" + "@" + "memova.ai";
  const contact = zh ? "/contact?lang=zh" : "/contact";
  const home = zh ? "/?lang=zh" : "/";
  useEffect(() => {
    document.documentElement.lang = zh ? "zh-CN" : "en";
    document.title = L(
      "联系企业团队 | Memova",
      "Contact our team | Memova for Business"
    );
  }, [zh]);
  useEffect(() => {
    if (state === "success" || state === "error") status.current?.focus();
  }, [state]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const fields = Object.fromEntries(data.entries());
    const current = JSON.stringify({ ...fields, language: zh ? "zh" : "en" });
    if (!requestId.current || current !== snapshot.current) {
      requestId.current = crypto.randomUUID();
      snapshot.current = current;
    }
    setState("sending");
    setError("");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          language: zh ? "zh" : "en",
          requestId: requestId.current,
        }),
        signal: controller.signal,
      });
      const body = await response.json();
      if (!response.ok || body.ok !== true || body.status !== "received") {
        if (response.status === 429) throw new Error("rate_limit");
        throw new Error("failed");
      }
      setReference(body.reference);
      setState("success");
    } catch (reason) {
      setError(
        reason instanceof Error && reason.message === "rate_limit"
          ? "rate_limit"
          : "failed"
      );
      setState("error");
    } finally {
      window.clearTimeout(timer);
    }
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  }
  return (
    <div
      className="enterprise-page ent-contact-page"
      id="top"
      data-no-translate
    >
      <EnterpriseHeader zh={zh} contact={contact} home={false} />
      <main className="ent-shell ent-contact-layout">
        <section className="ent-contact-intro">
          <a className="ent-contact-back" href={home}>
            <ArrowLeft size={16} />
            {L("返回企业站", "Back to Memova for Business")}
          </a>
          <p className="ent-eyebrow">LET'S BUILD YOUR CONTEXT LAYER</p>
          <h1>{L("聊聊你的企业需求。", "Let's talk about your project.")}</h1>
          <p className="ent-contact-description">
            {L(
              "从知识库、授权数据到本地 AI，告诉我们你想解决的问题，我们会通过邮件与你联系。",
              "From company knowledge and authorized data to local AI, tell us what you need. Our team will follow up by email."
            )}
          </p>
          <ul className="ent-contact-topics">
            {[
              L("企业知识库与数据治理", "Knowledge bases & data governance"),
              L("模型训练与私有部署", "Model training & private deployment"),
              L("工业与工程 AI 应用", "Industrial & engineering AI"),
            ].map(item => (
              <li key={item}>
                <Check size={16} />
                {item}
              </li>
            ))}
          </ul>
          <div className="ent-contact-backup">
            <p>{L("也可以直接联系", "Prefer email?")}</p>
            <div>
              <span className="ent-contact-address" translate="no">
                {email}
              </span>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={L("复制邮箱", "Copy email")}
                title={L("复制邮箱", "Copy email")}
              >
                {copied ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
            <small role="status">
              {copyFailed
                ? L(
                    "请长按邮箱地址进行复制。",
                    "Press and hold the address to copy it."
                  )
                : copied
                  ? L("邮箱已复制", "Email copied")
                  : ""}
            </small>
          </div>
        </section>
        <section
          className="ent-contact-form-section"
          aria-label={L("企业咨询", "Project inquiry")}
        >
          {state === "success" ? (
            <div
              className="ent-contact-success"
              ref={status}
              tabIndex={-1}
              role="status"
            >
              <CheckCircle2 size={38} />
              <h2>{L("咨询已收到。", "Your request is in.")}</h2>
              <p>
                {L(
                  "信息已安全提交，我们会通过你填写的邮箱联系你。",
                  "Your request has been saved. Our team will contact you at the email you provided."
                )}
              </p>
              <small>
                {L("咨询编号", "Reference")}: {reference}
              </small>
              <a className="ent-button" href={home}>
                {L("返回企业站", "Back to the enterprise site")}
                <ArrowUpRight size={16} />
              </a>
            </div>
          ) : (
            <form
              method="post"
              action="/api/contact"
              onSubmit={submit}
              onChange={() => {
                if (state === "error") setState("idle");
              }}
              aria-busy={state === "sending"}
            >
              <h2>{L("咨询企业方案", "Discuss your project")}</h2>
              <div className="ent-contact-field">
                <label htmlFor="contact-name">
                  {L("姓名", "Name")} <span>*</span>
                </label>
                <input
                  id="contact-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </div>
              <div className="ent-contact-field">
                <label htmlFor="contact-email">
                  {L("邮箱", "Email")} <span>*</span>
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  maxLength={254}
                />
              </div>
              <div className="ent-contact-field">
                <label htmlFor="contact-company">
                  {L("公司／机构", "Company / institution")}{" "}
                  <small>{L("选填", "Optional")}</small>
                </label>
                <input
                  id="contact-company"
                  name="company"
                  autoComplete="organization"
                  maxLength={160}
                />
              </div>
              <div className="ent-contact-field">
                <label htmlFor="contact-category">
                  {L("感兴趣的方向", "Area of interest")}{" "}
                  <small>{L("选填", "Optional")}</small>
                </label>
                <select id="contact-category" name="category" defaultValue="">
                  <option value="">{L("请选择", "Select an area")}</option>
                  <option value="knowledge">
                    {L("企业知识库", "Enterprise knowledge base")}
                  </option>
                  <option value="data">
                    {L("数据治理与授权", "Data governance & authorization")}
                  </option>
                  <option value="models">
                    {L(
                      "模型训练与私有部署",
                      "Model training & private deployment"
                    )}
                  </option>
                  <option value="industrial">
                    {L("工业与工程 AI", "Industrial & engineering AI")}
                  </option>
                  <option value="other">
                    {L("其他合作", "Other collaboration")}
                  </option>
                </select>
              </div>
              <div className="ent-contact-field">
                <label htmlFor="contact-message">
                  {L("你想解决什么问题？", "What would you like to solve?")}{" "}
                  <span>*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  minLength={10}
                  maxLength={3000}
                  rows={4}
                />
              </div>
              <div className="ent-contact-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <p className="ent-contact-privacy">
                {L(
                  "我们仅将以上信息用于处理本次咨询与必要的防刷，不会自动订阅营销邮件。请勿填写敏感业务数据。",
                  "We use these details to handle your inquiry and prevent abuse. You will not be subscribed to marketing emails. Please do not include sensitive business data."
                )}
              </p>
              {state === "error" && (
                <div
                  className="ent-contact-error"
                  role="alert"
                  ref={status}
                  tabIndex={-1}
                >
                  {error === "rate_limit"
                    ? L(
                        "提交次数过多，请稍后重试，或使用备用邮箱联系。",
                        "Too many requests. Please try later or use the email address provided."
                      )
                    : L(
                        "暂时无法确认提交结果，内容已保留。请重试，不会重复登记同一请求。",
                        "We could not confirm your submission. Your details are still here. Retry safely without duplicating the same request."
                      )}
                </div>
              )}
              <button
                type="submit"
                className="ent-button ent-contact-submit"
                disabled={state === "sending"}
              >
                {state === "sending" ? (
                  <Loader2 size={17} className="ent-contact-spinner" />
                ) : state === "error" ? (
                  <RotateCcw size={17} />
                ) : (
                  <ArrowUpRight size={17} />
                )}
                {state === "sending"
                  ? L("正在提交…", "Sending…")
                  : state === "error"
                    ? L("重新提交", "Try again")
                    : L("提交咨询", "Send inquiry")}
              </button>
            </form>
          )}
        </section>
      </main>
      <EnterpriseFooter zh={zh} contact={contact} home={false} />
    </div>
  );
}
