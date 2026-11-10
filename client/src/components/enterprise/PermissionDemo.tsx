import { useState } from "react";
import {
  ArrowDown,
  BookOpen,
  Check,
  FileText,
  LockKeyhole,
  Server,
  ShieldCheck,
} from "lucide-react";

export const demoSources = [
  {
    id: "brief",
    cn: "项目交付简报",
    en: "Project delivery brief",
    scope: ["sales", "engineering", "lead"],
    version: "v.04",
  },
  {
    id: "commercial",
    cn: "客户商务条款",
    en: "Customer commercial terms",
    scope: ["sales", "lead"],
    version: "v.02",
  },
  {
    id: "technical",
    cn: "技术架构记录",
    en: "Technical architecture",
    scope: ["engineering", "lead"],
    version: "v.06",
  },
];
export function permittedSources(role: string) {
  return demoSources.filter(source => source.scope.includes(role));
}

export function PermissionDemo({ zh }: { zh: boolean }) {
  const [role, setRole] = useState("sales");
  const [model, setModel] = useState("private");
  const L = (cn: string, en: string) => (zh ? cn : en);
  const sources = permittedSources(role);
  return (
    <div className="ent-permission-demo">
      <div className="ent-demo-toolbar">
        <span>
          <ShieldCheck size={16} />
          {L(
            "同一个知识库，不同的访问边界",
            "One knowledge base. Scoped access."
          )}
        </span>
        <span className="ent-demo-label">
          {L("合成演示", "SYNTHETIC DEMO")}
        </span>
      </div>
      <div
        className="ent-segmented"
        role="group"
        aria-label={L("访问角色", "Access role")}
      >
        {[
          ["sales", "销售", "Sales"],
          ["engineering", "研发", "Engineering"],
          ["lead", "项目负责人", "Project lead"],
        ].map(([id, cn, en]) => (
          <button
            type="button"
            key={id}
            aria-pressed={role === id}
            onClick={() => setRole(id)}
          >
            {L(cn, en)}
          </button>
        ))}
      </div>
      <div className="ent-source-list">
        {demoSources.map(source => {
          const allowed = source.scope.includes(role);
          return (
            <div key={source.id} data-allowed={allowed}>
              <FileText size={17} />
              <strong>{zh ? source.cn : source.en}</strong>
              <span>{source.version}</span>
              <small>
                {allowed ? <Check size={15} /> : <LockKeyhole size={14} />}
                {allowed ? L("已授权", "Allowed") : L("不进入检索", "Excluded")}
              </small>
            </div>
          );
        })}
      </div>
      <div className="ent-context-gate">
        <ArrowDown size={18} />
        <span>
          {L(
            "只提供本次任务所需的授权证据",
            "Only authorized, task-relevant evidence"
          )}
        </span>
      </div>
      <div className="ent-demo-answer" aria-live="polite" aria-atomic="true">
        <div>
          <BookOpen size={17} />
          <strong>
            {L("项目下一步是什么？", "What happens next on this project?")}
          </strong>
        </div>
        <p>
          {role === "sales"
            ? L(
                "交付范围已确认。核对客户商务条款，准备下一次沟通简报。",
                "Delivery scope is confirmed. Review the commercial terms and prepare the next customer brief."
              )
            : role === "engineering"
              ? L(
                  "交付范围已确认。按技术架构记录，准备实施与验证清单。",
                  "Delivery scope is confirmed. Use the architecture record to prepare the implementation and validation checklist."
                )
              : L(
                  "交付范围已确认。协调客户条款与技术方案，复核交付清单。",
                  "Delivery scope is confirmed. Align commercial terms with the technical plan and review the delivery checklist."
                )}
        </p>
        <div className="ent-citations">
          {sources.map(source => (
            <span key={source.id}>
              <BookOpen size={11} />
              {zh ? source.cn : source.en}
            </span>
          ))}
        </div>
      </div>
      <div className="ent-model-control">
        <span>
          <Server size={15} />
          {L("推理环境", "Inference")}
        </span>
        <select
          aria-label={L("模型部署环境", "Model deployment environment")}
          value={model}
          onChange={event => setModel(event.target.value)}
        >
          <option value="private">
            {L("企业私有模型", "Private enterprise model")}
          </option>
          <option value="approved">
            {L("获批云端模型", "Approved cloud model")}
          </option>
        </select>
      </div>
      <p className="ent-model-boundary">
        {model === "private"
          ? L(
              "示例路由：证据与推理均在企业环境内。",
              "Example route: evidence and inference stay within the enterprise environment."
            )
          : L(
              "示例路由：仅发送上方授权证据，出站范围单独审批。",
              "Example route: send only the authorized evidence above, with separately approved egress."
            )}
      </p>
    </div>
  );
}
