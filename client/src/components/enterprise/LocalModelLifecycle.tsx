import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Cpu,
  Database,
  Layers3,
  Pause,
  Play,
  RotateCcw,
  Server,
} from "lucide-react";
import { useReducedMotionPreference } from "./useReducedMotionPreference";

export function localModelStages(zh: boolean) {
  const L = (cn: string, en: string) => (zh ? cn : en);
  return [
    {
      id: "collect",
      icon: Database,
      label: L("现场数据", "Collect"),
      title: L(
        "从现场问题开始，接入必要数据",
        "Start with the operation, not a model."
      ),
      text: L(
        "围绕质量、设备状态或运行效率，连接经授权的传感器、影像、运行日志与工程记录，明确读取范围、数据责任与训练用途。",
        "Connect authorized sensor readings, images, operating logs and engineering records around a quality, equipment or efficiency question. Define access, ownership and training rights."
      ),
      output: L(
        "数据目录 · 接口范围 · 用途授权",
        "Source inventory · interfaces · purpose permissions"
      ),
    },
    {
      id: "prepare",
      icon: Layers3,
      label: L("治理标注", "Prepare"),
      title: L(
        "把运行记录变成可验证的数据集",
        "Build datasets you can inspect."
      ),
      text: L(
        "对齐时间、单位和设备标识，处理缺失与异常，结合工程经验标注事件。按时间、设备和场景划分评测数据，保留来源与处理版本。",
        "Align timestamps, units and equipment identifiers. Review missing values and anomalies, label events with engineering input, and split evaluation data by time, equipment and scenario. Keep sources and processing versions."
      ),
      output: L(
        "清洗规则 · 标注规范 · 版本化数据集",
        "Preparation rules · annotation guide · versioned datasets"
      ),
    },
    {
      id: "train",
      icon: Cpu,
      label: L("训练评测", "Train & evaluate"),
      title: L(
        "选合适的算法，用业务目标验证",
        "Train for the task. Evaluate for the operation."
      ),
      text: L(
        "从简单基线比较预测、识别或异常检测模型，在约定的本地或企业私有算力上开展训练或微调。用独立数据验证效果，并在目标硬件上检查延迟与资源占用。",
        "Compare prediction, recognition or anomaly-detection models against a simple baseline. Train or fine-tune on agreed local or private compute, evaluate on held-out data, and measure latency and resource use on target hardware."
      ),
      output: L(
        "基线对照 · 评测报告 · 模型与数据版本",
        "Baseline comparison · evaluation report · model and data versions"
      ),
    },
    {
      id: "deploy",
      icon: Server,
      label: L("本地部署", "Deploy locally"),
      title: L(
        "把通过验证的模型带到现场",
        "Bring validated models to the site."
      ),
      text: L(
        "按现场条件在厂内服务器或边缘设备部署推理服务，连接现有业务界面。先历史回放与旁路验证，再分阶段上线，准备版本回退与运维交接。",
        "Deploy inference on site servers or edge devices and integrate with existing workflows. Begin with replay and shadow validation, then stage releases with version rollback and an operations handover."
      ),
      output: L(
        "部署包 · 接口联调 · 监控与回退方案",
        "Deployment package · integration checks · monitoring and rollback plan"
      ),
    },
    {
      id: "improve",
      icon: Activity,
      label: L("反馈迭代", "Monitor & improve"),
      title: L(
        "关联建议、实际执行与业务结果",
        "Learn from what actually happens."
      ),
      text: L(
        "持续核对数据质量、误报漏报、延迟与实际结果。把工程师复核和新工况反馈回数据集；模型更新重新评测、审核后发布，不静默替换现场版本。",
        "Review data quality, false alarms, missed events, latency and operational outcomes. Feed engineering reviews and new conditions into the dataset. Evaluate and approve model updates before release, rather than silently replacing the site version."
      ),
      output: L(
        "运行记录 · 复核样本 · 经审核的新版本",
        "Operating records · reviewed samples · approved releases"
      ),
    },
  ];
}

export function LocalModelLifecycle({ zh }: { zh: boolean }) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { margin: "100px" });
  const reducedMotion = useReducedMotionPreference();
  const L = (cn: string, en: string) => (zh ? cn : en);
  const stages = localModelStages(zh);
  const active = stages[selected];
  return (
    <div
      className="ent-model-lifecycle"
      ref={root}
      data-moving={!paused && !reducedMotion && inView}
    >
      <div
        className="ent-model-rail"
        role="group"
        aria-label={L("工业模型生命周期", "Industrial model lifecycle")}
      >
        {stages.map((stage, index) => (
          <button
            type="button"
            key={stage.id}
            id={`industrial-${stage.id}`}
            aria-pressed={selected === index}
            aria-controls="industrial-stage-detail"
            onClick={() => setSelected(index)}
          >
            <span className="ent-model-stage-icon">
              <stage.icon size={23} />
            </span>
            <small>0{index + 1}</small>
            <strong>{stage.label}</strong>
            {index < stages.length - 1 && (
              <ArrowRight
                className="ent-model-arrow"
                size={17}
                aria-hidden="true"
              />
            )}
          </button>
        ))}
      </div>
      <div className="ent-model-feedback">
        <RotateCcw size={14} aria-hidden="true" />
        <span>
          {L(
            "现场反馈回到数据与模型",
            "Operational feedback returns to the data and model"
          )}
        </span>
        <span className="ent-model-feedback-line" aria-hidden="true" />
        <button
          type="button"
          onClick={() => setPaused(value => !value)}
          aria-pressed={paused}
          aria-label={
            paused
              ? L("播放流程动效", "Play process animation")
              : L("暂停流程动效", "Pause process animation")
          }
          title={
            paused
              ? L("播放流程动效", "Play process animation")
              : L("暂停流程动效", "Pause process animation")
          }
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
      <div className="ent-model-inspector">
        <div
          id="industrial-stage-detail"
          role="region"
          aria-labelledby={`industrial-${active.id}`}
          aria-live="polite"
        >
          <h3>{active.title}</h3>
          <p>{active.text}</p>
          <span className="ent-model-deliverable">{active.output}</span>
        </div>
        <aside>
          <h4>{L("以生产价值验收", "Measure operational value")}</h4>
          <ul>
            <li>
              {L(
                "质量一致性与误报漏报",
                "Quality consistency and false / missed alerts"
              )}
            </li>
            <li>
              {L(
                "工程响应与重复作业耗时",
                "Engineering response and repetitive work time"
              )}
            </li>
            <li>
              {L(
                "运行延迟、稳定性与维护成本",
                "Latency, reliability and maintenance cost"
              )}
            </li>
          </ul>
        </aside>
      </div>
      <p className="ent-model-safety">
        {L(
          "先试点，再扩展。效果以现场验证为准；涉及控制写回需另行评估并取得授权，不替代现有安全联锁与人工处置。",
          "Pilot before scaling. Outcomes require site validation; control-system write-back needs separate assessment and authorization, without replacing safety interlocks or human fallback."
        )}
      </p>
    </div>
  );
}
