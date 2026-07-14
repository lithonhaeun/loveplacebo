import { ChevronRight, Search } from "lucide-react";
import NoticePanel from "@/app/pages/NoticePanel";
import type { NoticeRecord } from "@/app/pages/NoticeManagerPage";

export default function HomePage({
  goCourse,
  notices,
  goNotices,
}: {
  goCourse: () => void;
  notices: NoticeRecord[];
  goNotices: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl p-3 sm:p-4 lg:p-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-lg font-bold text-[#1a1e2e]">강좌 전체보기</h1>
            <div className="relative sm:w-56">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="검색"
                className="w-full rounded-md border border-black/[0.08] bg-white py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <button
            onClick={goCourse}
            className="flex w-full items-center gap-3 rounded-md border-l-4 border-blue-600 bg-white p-3.5 text-left shadow-sm transition hover:shadow-md sm:p-4"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-purple-500 text-sm font-bold text-white">
              사
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate font-semibold text-[#1a1e2e]">
                  사랑과 사람의 이해
                </span>
                <span className="rounded-md bg-green-100 px-1.5 py-0.5 text-[11px] font-semibold text-green-700">
                  수업중
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                224_1000045 · 이시우 교수 · 2026-1
              </p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-slate-400" />
          </button>
        </div>

        {/* Side column: stacks below main content on small screens */}
        <div className="space-y-4">
          <div className="rounded-md border border-black/[0.06] bg-white p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                김
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#1a1e2e]">
                  김영재 학생
                </p>
                <p className="truncate text-xs text-slate-500">수강중 강좌: 1개</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-md bg-blue-50 p-2.5 text-center">
                <p className="text-lg font-bold text-blue-700">1</p>
                <p className="text-[11px] text-slate-500">수강 강좌</p>
              </div>
              <div className="rounded-md bg-orange-50 p-2.5 text-center">
                <p className="text-lg font-bold text-orange-600">0</p>
                <p className="text-[11px] text-slate-500">미제출 과제</p>
              </div>
            </div>
          </div>

          <NoticePanel notices={notices} goNotices={goNotices} />
        </div>
      </div>
    </div>
  );
}