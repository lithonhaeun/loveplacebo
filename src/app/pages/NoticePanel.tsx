import { Megaphone } from "lucide-react";
import type { NoticeRecord } from "@/app/pages/NoticeManagerPage";

export default function NoticePanel({
  notices,
  goNotices,
}: {
  notices: NoticeRecord[];
  goNotices: () => void;
}) {
  return (
    <div className="rounded-md border border-black/[0.06] bg-white">
      <div className="flex items-center justify-between border-b border-black/[0.06] px-3.5 py-2.5">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-[#1a1e2e]">
          <Megaphone className="size-3.5 text-blue-600" />
          공지사항
        </span>
        <button onClick={goNotices} className="text-xs text-blue-600 hover:underline">
          더보기
        </button>
      </div>
      {notices.length === 0 ? (
        <p className="px-3.5 py-6 text-center text-sm text-slate-400">
          등록된 공지사항이 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-black/[0.06]">
          {notices.map((n) => (
            <li key={n.id} className="px-3.5 py-2.5">
              <p className="text-sm leading-snug text-[#1a1e2e]">
                {n.isNew && (
                  <span className="mr-1 rounded bg-red-500 px-1 py-0.5 text-[9px] font-bold text-white align-middle">
                    NEW
                  </span>
                )}
                {n.title}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">{n.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
