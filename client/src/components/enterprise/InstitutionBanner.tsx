import { useRef } from "react";
import { useInView } from "framer-motion";
import { useReducedMotionPreference } from "./useReducedMotionPreference";

export const institutions = [
  {
    id: "stanford",
    name: "Stanford University",
    src: "/enterprise/institutions/stanford-seal-wordmark.png",
    width: 802,
    height: 294,
    category: "users",
  },
  {
    id: "berkeley",
    name: "UC Berkeley",
    src: "/enterprise/institutions/uc-berkeley-blue.png",
    width: 4100,
    height: 2625,
    category: "users",
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    src: "/enterprise/institutions/10018-icon-service-Azure-A.svg",
    width: 18,
    height: 18,
    category: "cloud",
  },
  {
    id: "aws",
    name: "Amazon Web Services (AWS)",
    src: "/enterprise/institutions/aws-logo.png",
    width: 1254,
    height: 750,
    category: "cloud",
  },
  {
    id: "openai",
    name: "OpenAI",
    src: "/enterprise/institutions/openai-blossom.svg",
    width: 411,
    height: 411,
    category: "ai",
  },
  {
    id: "alibaba",
    name: "Alibaba Cloud",
    src: "/enterprise/institutions/alibaba-cloud.svg",
    width: 295.93,
    height: 37.28,
    category: "cloud",
  },
];

export function InstitutionBanner({ zh }: { zh: boolean }) {
  const band = useRef<HTMLElement>(null);
  const inView = useInView(band, { margin: "150px" });
  const reducedMotion = useReducedMotionPreference();
  const L = (cn: string, en: string) => (zh ? cn : en);
  return (
    <section
      className="ent-institution-band"
      ref={band}
      aria-label={L("机构与技术品牌标识", "Institution and technology logos")}
      data-paused={!inView || !!reducedMotion}
    >
      <div className="ent-logo-window">
        <div className="ent-logo-track">
          {[0, 1].map(copy => (
            <div
              className="ent-logo-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {institutions.map(institution => (
                <div
                  key={institution.id}
                  className={`ent-institution-logo ent-logo-${institution.id}`}
                  data-category={institution.category}
                >
                  <div className="ent-logo-art">
                    <img
                      src={institution.src}
                      alt={copy === 0 ? institution.name : ""}
                      width={institution.width}
                      height={institution.height}
                      loading="eager"
                      decoding="async"
                    />
                    {(institution.id === "azure" ||
                      institution.id === "openai") && (
                      <span className="ent-provider-name" aria-hidden="true">
                        {institution.id === "azure"
                          ? "Microsoft Azure"
                          : "OpenAI"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
