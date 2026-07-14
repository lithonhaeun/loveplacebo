import { Plus, Trash2 } from "lucide-react";

export interface AssignmentRecord {
  id: string;
  title: string;
  dueDate: string; // datetime-local 형식: "YYYY-MM-DDTHH:mm"
}

export default function AssignmentManagerPage({
  assignments,
  setAssignments,
}: {
  assignments: AssignmentRecord[];
  setAssignments: (
    updater: AssignmentRecord[] | ((prev: AssignmentRecord[]) => AssignmentRecord[]),
  ) => void;
}) {
  const updateField = (
    id: string,
    field: "title" | "dueDate",
    value: string,
  ) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  };

  const removeAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const addAssignment = () => {
    setAssignments((prev) => [
      ...prev,
      { id: `assignment-${Date.now()}`, title: "새 과제", dueDate: "" },
    ]);
  };

  return (
    <div className="mx-auto max-w-3xl p-3 sm:p-4 lg:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1a1e2e]">과제 마감 관리</h1>
          <p className="mt-1 text-xs text-slate-500">
            촬영용 도구입니다. 과제 제목과 마감 일시를 자유롭게 추가·수정·삭제할 수
            있어요. "데이트 보고서 제출" 과제의 마감 일시는 과제 상세 화면의
            종료 일시 / 마지막 남은 기간에 실시간으로 반영됩니다.
          </p>
        </div>
        <button
          onClick={addAssignment}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="size-4" /> 과제 추가
        </button>
      </div>

      <div className="space-y-3">
        {assignments.length === 0 && (
          <div className="rounded-md border border-dashed border-black/[0.12] bg-white p-8 text-center text-sm text-slate-400">
            등록된 과제가 없습니다. 위 "과제 추가" 버튼으로 새로 만들어보세요.
          </div>
        )}

        {assignments.map((a) => (
          <div
            key={a.id}
            className="flex flex-col gap-2 rounded-md border border-black/[0.06] bg-white p-3.5 sm:flex-row sm:items-center"
          >
            <input
              value={a.title}
              onChange={(e) => updateField(a.id, "title", e.target.value)}
              placeholder="과제 제목"
              className="min-w-0 flex-1 rounded-md border border-black/[0.08] px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
            />
            <input
              type="datetime-local"
              value={a.dueDate}
              onChange={(e) => updateField(a.id, "dueDate", e.target.value)}
              className="shrink-0 rounded-md border border-black/[0.08] px-2.5 py-1.5 text-sm outline-none focus:border-blue-400"
            />
            <button
              onClick={() => removeAssignment(a.id)}
              className="inline-flex shrink-0 items-center justify-center rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
              aria-label="과제 삭제"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
