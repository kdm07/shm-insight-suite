import { Check } from "lucide-react";
import { workflowSteps } from "@/data/mock";

export function WorkflowStepper({ current }: { current: number }) {
  return (
    <div className="erp-stepper">
      {workflowSteps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className={`erp-step ${done ? "done" : ""} ${active ? "active" : ""}`}>
            <div className="erp-step-dot">
              {done ? <Check size={14} /> : <span>{i + 1}</span>}
            </div>
            <div className="erp-step-label">{s}</div>
            {i < workflowSteps.length - 1 && <div className="erp-step-line" />}
          </div>
        );
      })}
    </div>
  );
}
