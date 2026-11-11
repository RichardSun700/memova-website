import { useRef } from "react";
import {
  AudioLines,
  BookOpen,
  FileText,
  FileCheck2,
  Layers3,
  LibraryBig,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useInView } from "framer-motion";
import { AnimatedBeam } from "./AnimatedBeam";
import { useReducedMotionPreference } from "./useReducedMotionPreference";

export function KnowledgeFlow({ zh }: { zh: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const files = useRef<HTMLDivElement>(null);
  const meetings = useRef<HTMLDivElement>(null);
  const systems = useRef<HTMLDivElement>(null);
  const knowledge = useRef<HTMLDivElement>(null);
  const answers = useRef<HTMLDivElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { margin: "150px" });
  const reducedMotion = useReducedMotionPreference();
  const L = (cn: string, en: string) => (zh ? cn : en);
  return (
    <div className="ent-flow-wrap">
      <div
        className="ent-flow"
        data-running={inView && !reducedMotion}
        ref={box}
        role="img"
        aria-label={L(
          "文档、会议和业务系统经授权、清洗进入企业自己的知识库，生成带来源的回答与可使用的工作成果",
          "Authorized documents, meetings and business systems become company knowledge, producing source-linked answers and ready-to-use work"
        )}
      >
        <div className="ent-flow-sources">
          <div className="ent-flow-node ent-source-file" ref={files}>
            <FileText />
            <div>
              <strong>{L("文档与资料", "Documents")}</strong>
              <span>
                {L("制度 · 方案 · 业务资料", "Policies · plans · resources")}
              </span>
            </div>
          </div>
          <div className="ent-flow-node ent-source-audio" ref={meetings}>
            <AudioLines />
            <div>
              <strong>{L("会议与沟通", "Conversations")}</strong>
              <span>{L("决策 · 承诺 · 反馈", "Decisions · commitments")}</span>
            </div>
          </div>
          <div className="ent-flow-node ent-source-system" ref={systems}>
            <Layers3 />
            <div>
              <strong>{L("业务系统", "Business systems")}</strong>
              <span>
                {L("项目 · 客户 · 记录", "Projects · customers · records")}
              </span>
            </div>
          </div>
        </div>
        <div className="ent-flow-center">
          <div className="ent-flow-policy">
            <ShieldCheck size={14} />
            {L("授权检查 · 隐私处理 · 清洗", "Authorize · protect · prepare")}
          </div>
          <div className="ent-knowledge-node" ref={knowledge}>
            <div className="ent-knowledge-icon" aria-hidden="true">
              <LibraryBig size={30} strokeWidth={1.5} />
            </div>
            <strong>{L("你的企业知识库", "Your company knowledge")}</strong>
            <span>COMPANY KNOWLEDGE LAYER</span>
            <div className="ent-entity-row">
              <span>
                <Network size={12} />
                {L("关系", "Relations")}
              </span>
              <span>
                <BookOpen size={12} />
                {L("来源", "Sources")}
              </span>
            </div>
          </div>
          <span className="ent-flow-persist">
            {L(
              "知识留在企业，模型按需接入",
              "Company-owned context. Model-agnostic."
            )}
          </span>
        </div>
        <div className="ent-flow-results">
          <div className="ent-flow-node ent-result-answer" ref={answers}>
            <Sparkles />
            <div>
              <strong>{L("有依据的回答", "Answers with evidence")}</strong>
              <span>
                {L("问答 · 检索 · 业务洞察", "Search · answers · insights")}
              </span>
              <small>
                <BookOpen size={12} />
                {L("附来源与版本", "Source-linked & versioned")}
              </small>
            </div>
          </div>
          <div className="ent-flow-node ent-result-action" ref={actions}>
            <FileCheck2 />
            <div>
              <strong>{L("可使用的工作成果", "Ready-to-use work")}</strong>
              <span>
                {L("报告 · 方案 · 项目交接", "Reports · plans · handovers")}
              </span>
              <small>
                <BookOpen size={12} />
                {L("基于授权知识生成", "Built from authorized knowledge")}
              </small>
            </div>
          </div>
        </div>
        {[
          [files, knowledge],
          [meetings, knowledge],
          [systems, knowledge],
          [knowledge, answers],
          [knowledge, actions],
        ].map(([fromRef, toRef], i) => (
          <AnimatedBeam
            key={i}
            containerRef={box}
            fromRef={fromRef}
            toRef={toRef}
            delay={i * 0.45}
            paused={!inView}
          />
        ))}
      </div>
      <div className="ent-flow-caption">
        <span>
          {L(
            "概念演示 · 合成资料 · 非实时企业系统",
            "Concept illustration · synthetic data · not a live enterprise system"
          )}
        </span>
      </div>
    </div>
  );
}
