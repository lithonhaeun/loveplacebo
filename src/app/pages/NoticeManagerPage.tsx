import { Plus, Trash2 } from "lucide-react";

export interface NoticeRecord {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  isNew: boolean;
}

export default function NoticeManagerPage({
  notices,
  setNotices,
}: {
  notices: NoticeRecord[];
  setNotices: (
    updater: NoticeRecord[] | ((prev: NoticeRecord[]) => NoticeRecord[]),
  ) => void;
}) {
  const updateField = (
    id: string,
    field: "title" | "date",
    value: string,
  ) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [field]: value } : n)),
    );
  };

  const toggleNew = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isNew: !n.isNew } : n)),
    );
  };

  const removeNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotice = () => {
    setNotices((prev) => [
      { id: `notice-${Date.now()}`, title: "새 공지사항", date: "", isNew: true },
      ...prev,
    ]);
  };

  return (
    <div className="mx-auto max-w-3xl p-3 sm:p-4 lg:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1a1e2e]">공지사항 관리</h1>
          <p className="mt-1 text-xs text-slate-500">
            촬영용 도구입니다. My Page와 강좌 홈에 똑같이 표시되는 공지사항을
            여기서 추가·삭제하고, NEW 표시를 켜고 끌 수 있어요.
          </p>
        </div>
        <button
          onClick={addNotice}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="size-4" /> 공지 추가
        </button>
      </div>

      <div className="space-y-3">
        {notices.length === 0 && (
          <div className="rounded-md border border-dashed border-black/[0.12] bg-white p-8 text-center text-sm text-slate-400">
            등록된 공지사항이 없습니다. 위 "공지 추가" 버튼으로 새로 만들어보세요.
          </div>
        )}

        {notices.map((n) => (
          <div
            key={n.id}
            className="flex flex-col gap-2 rounded-md border border-black/[0.06] bg-white p-3.5 sm:flex-row sm:items-center"
          >
            <button
              onClick={() => toggleNew(n.id)}
              className={`shrink-0 rounded px-2 py-1 text-[10px] font-bold transition-colors ${
                n.isNew
                  ? "bg-red-500 text-white"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
              }`}
              title="NEW 표시 켜기/끄기"
            >
              NEW
            </button>
            <input
              value={n.title}
              onChange={(e) => updateField(n.id, "title", e.target.value)}
              placeholder="공지 제목"
              className="min-w-0 flex-1 rounded-md border border-black/[0.08] px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
            />
            <input
              type="date"
              value={n.date}
              onChange={(e) => updateField(n.id, "date", e.target.value)}
              className="shrink-0 rounded-md border border-black/[0.08] px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
            />
            <button
              onClick={() => removeNotice(n.id)}
              className="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
              aria-label="공지 삭제"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
