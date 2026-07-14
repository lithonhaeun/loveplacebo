import {
  GraduationCap,
  Video,
  ClipboardList,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Users,
  Link as LinkIcon,
  BarChart3,
  Award,
  Calendar,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import NoticePanel from "@/app/pages/NoticePanel";
import type { NoticeRecord } from "@/app/pages/NoticeManagerPage";

const OVERVIEW = [
  { icon: Video, label: "강의영상", color: "bg-red-500" },
  { icon: ClipboardList, label: "과제", color: "bg-orange-500" },
  { icon: BookOpen, label: "강의자료", color: "bg-yellow-500" },
  { icon: HelpCircle, label: "퀴즈/시험", color: "bg-green-500" },
  { icon: MessageSquare, label: "토론", color: "bg-teal-500" },
  { icon: Users, label: "팀플", color: "bg-cyan-500" },
  { icon: LinkIcon, label: "외부링크", color: "bg-blue-500" },
  { icon: BarChart3, label: "성적조회", color: "bg-indigo-500" },
  { icon: Award, label: "출석현황", color: "bg-purple-500" },
  { icon: Calendar, label: "강의계획서", color: "bg-pink-500" },
];

type ItemStatus = "done" | "todo" | "warn";

interface WeekItem {
  label: string;
  status: ItemStatus;
  goesToAssignment?: boolean;
}

interface Week {
  no: number;
  title: string;
  done: number;
  total: number;
  items: WeekItem[];
}

const WEEKS: Week[] = [
  {
    no: 1,
    title: "경영전략의 개요 및 기초 개념",
    done: 3,
    total: 3,
    items: [
      { label: "경영전략 개론 강의 영상 (45분)", status: "done" },
      { label: "1주차 강의자료.pdf", status: "done" },
      { label: "기업사명조사 (마감: 2026-03-19)", status: "done", goesToAssignment: true },
    ],
  },
  {
    no: 2,
    title: "외부 환경 분석: PEST & 산업 구조 분석",
    done: 3,
    total: 3,
    items: [
      { label: "PEST 분석 방법론 강의 영상 (50분)", status: "done" },
      { label: "2주차 강의자료.pdf", status: "done" },
      { label: "확인 퀴즈 (10문항)", status: "done" },
    ],
  },
  {
    no: 3,
    title: "내부 역량 분석: SWOT 및 자원기반관점",
    done: 0,
    total: 3,
    items: [
      { label: "SWOT 분석 심화 강의 (48분)", status: "todo" },
      { label: "3주차 강의자료.pdf", status: "todo" },
      { label: "SWOT 분석 보고서 (마감: 2026-04-02)", status: "warn", goesToAssignment: true },
    ],
  },
  {
    no: 4,
    title: "경쟁 우위 전략: 원가 우위와 차별화",
    done: 0,
    total: 2,
    items: [
      { label: "경쟁우위전략 강의 영상 (40분)", status: "todo" },
      { label: "데이트 보고서 제출 (마감: 2026-08-01)", status: "todo", goesToAssignment: true },
    ],
  },
];

function StatusIcon({ status }: { status: ItemStatus }) {
  if (status === "done") return <CheckCircle2 className="size-4 text-green-500" />;
  if (status === "warn") return <AlertCircle className="size-4 text-orange-500" />;
  return <XCircle className="size-4 text-slate-300" />;
}

export default function CoursePage({
  goAssignment,
  notices,
  goNotices,
}: {
  goAssignment: () => void;
  notices: NoticeRecord[];
  goNotices: () => void;
}) {
  const [openWeeks, setOpenWeeks] = useState<number[]>([1, 2, 3]);
  const toggle = (n: number) =>
    setOpenWeeks((prev) =>
      prev.includes(n) ? prev.filter((w) => w !== n) : [...prev, n],
    );

  return (
    <div className="mx-auto max-w-6xl p-3 sm:p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-4">
          {/* Welcome banner */}
          <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-blue-800 to-blue-600 p-4 text-white sm:p-5">
            <GraduationCap className="absolute -right-2 -top-2 size-24 text-white/10 sm:size-28" />
            <h1 className="text-base font-bold sm:text-lg">
              사랑과 사람의 이해 (224_1000045)에 오신것을 환영합니다.
            </h1>
            <p className="mt-1 text-sm text-blue-100">담당교수: 이시우 · 학점: 3.0</p>
          </div>

          {/* Overview icon grid */}
          <div className="rounded-md border border-black/[0.06] bg-white p-4">
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#1a1e2e]">
              <BookOpen className="size-3.5 text-blue-600" />
              강좌 개요
            </h2>
            <div className="grid grid-cols-3 gap-3 xs:grid-cols-4 sm:grid-cols-5">
              {OVERVIEW.map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  onClick={label === "과제" ? goAssignment : undefined}
                  className="flex flex-col items-center gap-1.5 rounded-md p-2 hover:bg-slate-50"
                >
                  <div
                    className={`flex size-9 items-center justify-center rounded-lg ${color} text-white sm:size-10`}
                  >
                    <Icon className="size-4.5" />
                  </div>
                  <span className="text-[11px] text-slate-600 sm:text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly activity */}
          <div className="rounded-md border border-black/[0.06] bg-white">
            <div className="flex flex-col gap-1 border-b border-black/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-[#1a1e2e]">
                <Calendar className="size-3.5 text-blue-600" />
                회차 별 학습 활동
              </h2>
              <span className="text-xs text-slate-400">
                사랑과 사람의 이해 (224_1000045) · (2026-07-27 ~ 2026-08-01)
              </span>
            </div>

            <div className="divide-y divide-black/[0.06]">
              {WEEKS.map((w) => {
                const open = openWeeks.includes(w.no);
                return (
                  <div key={w.no}>
                    <button
                      onClick={() => toggle(w.no)}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-slate-50"
                    >
                      <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-[11px] font-bold text-blue-700">
                        {w.no}주차
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#1a1e2e]">
                        {w.title}
                      </span>
                      <span className="hidden shrink-0 items-center gap-2 sm:flex">
                        <span className="text-xs text-slate-400">
                          {w.done}/{w.total}
                        </span>
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <span
                            className="block h-full bg-green-500"
                            style={{ width: `${(w.done / w.total) * 100}%` }}
                          />
                        </span>
                      </span>
                      <ChevronUp
                        className={`size-4 shrink-0 text-slate-400 transition-transform ${
                          open ? "" : "rotate-180"
                        }`}
                      />
                    </button>
                    {open && (
                      <ul className="space-y-1.5 px-4 pb-3 pl-9">
                        {w.items.map((it) => (
                          <li key={it.label}>
                            <button
                              onClick={it.goesToAssignment ? goAssignment : undefined}
                              className={`flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm ${
                                it.goesToAssignment
                                  ? "text-[#1a1e2e] hover:bg-slate-50"
                                  : "text-slate-600"
                              }`}
                            >
                              <span className="min-w-0 flex-1 truncate">{it.label}</span>
                              <StatusIcon status={it.status} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          <NoticePanel notices={notices} goNotices={goNotices} />

          <div className="rounded-md border border-black/[0.06] bg-white p-3.5">
            <h2 className="mb-2 text-sm font-semibold text-[#1a1e2e]">마감 예정</h2>
            <button
              onClick={goAssignment}
              className="mb-2 block w-full rounded-md bg-slate-50 p-2 text-left hover:bg-slate-100"
            >
              <p className="text-sm text-[#1a1e2e]">데이트 보고서 마감</p>
              <p className="text-[11px] text-orange-600">마감: 2026-04-02 23:59</p>
            </button>
            <div className="rounded-md bg-slate-50 p-2">
              <p className="text-sm text-[#1a1e2e]">4주차 퀴즈</p>
              <p className="text-[11px] text-orange-600">마감: 2026-04-05 23:59</p>
            </div>
          </div>

          <div className="rounded-md border border-black/[0.06] bg-white p-3.5">
            <h2 className="mb-2 text-sm font-semibold text-[#1a1e2e]">학습 진도</h2>
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>전체 진도율</span>
                <span className="font-semibold text-blue-600">40%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[40%] bg-blue-500" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>출석률</span>
                <span className="font-semibold text-green-600">100%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-full bg-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}