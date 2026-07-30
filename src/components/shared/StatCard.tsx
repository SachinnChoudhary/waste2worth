import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  color?: "emerald" | "blue" | "amber" | "purple" | "rose" | "cyan";
}

const colorMap = {
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-500",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    gradient: "from-blue-500 to-indigo-500",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    gradient: "from-amber-500 to-orange-500",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    gradient: "from-purple-500 to-pink-500",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "text-rose-600",
    gradient: "from-rose-500 to-red-500",
  },
  cyan: {
    bg: "bg-cyan-50",
    icon: "text-cyan-600",
    gradient: "from-cyan-500 to-blue-500",
  },
};

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = "emerald",
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {change > 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : change < 0 ? (
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              ) : (
                <Minus className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  change > 0 ? "text-emerald-600" : change < 0 ? "text-red-600" : "text-slate-400"
                )}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-xs text-slate-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            colors.bg
          )}
        >
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
      </div>
    </div>
  );
}
