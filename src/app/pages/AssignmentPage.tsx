import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Download,
  MessageSquare,
  Paperclip,
  X,
  Eye,
} from "lucide-react";

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-black/[0.06] px-4 py-2.5 last:border-b-0 sm:flex-row sm:items-start sm:gap-0">
      <div className="shrink-0 text-xs font-semibold text-slate-500 sm:w-32 sm:pt-0.5">
        · {label}
      </div>
      <div className="min-w-0 flex-1 text-sm text-[#1a1e2e]">{children}</div>
    </div>
  );
}

export interface SubmissionFile {
  id: string;
  name: string;
  size: string;
  ext: "DOCX" | "PDF" | "FILE";
}

// App.tsx <-> /api/state 를 오가는 이 과제의 제출 상태 (구글시트에 저장됨)
export interface SubmissionState {
  locked: boolean;
  attempt: number;
  files: SubmissionFile[];
  memo: string;
  lastModified: string | null;
}

function extFromName(name: string): SubmissionFile["ext"] {
  const lower = name.toLowerCase();
  if (lower.endsWith(".docx") || lower.endsWith(".doc")) return "DOCX";
  if (lower.endsWith(".pdf")) return "PDF";
  return "FILE";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)}KB`;
  return `${(kb / 1024).toFixed(1)}MB`;
}

function extBadgeClass(ext: SubmissionFile["ext"]) {
  if (ext === "DOCX") return "bg-blue-100 text-blue-700";
  if (ext === "PDF") return "bg-red-100 text-red-700";
  return "bg-slate-200 text-slate-600";
}

function formatNow() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDueDate(dueDate: string) {
  if (!dueDate) return "마감일이 설정되지 않았습니다.";
  return dueDate.replace("T", " ");
}

function formatRemaining(dueDate: string) {
  if (!dueDate) return { text: "마감일이 설정되지 않았습니다.", overdue: false };
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime())) {
    return { text: "마감일이 설정되지 않았습니다.", overdue: false };
  }
  const diffMs = due.getTime() - Date.now();
  const overdue = diffMs < 0;
  const abs = Math.abs(diffMs);

  const totalMinutes = Math.floor(abs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}일`);
  parts.push(`${hours}시간`);
  parts.push(`${minutes}분`);
  const text = parts.join(" ");

  return {
    text: overdue ? `마감이 ${text} 지났습니다.` : `과제 제출까지 ${text} 남았습니다.`,
    overdue,
  };
}

type SetSubmission = (
  updater: SubmissionState | ((prev: SubmissionState) => SubmissionState),
) => void;

export default function AssignmentPage({
  goCourse,
  dueDate,
  submission,
  setSubmission,
}: {
  goCourse: () => void;
  dueDate: string;
  submission: SubmissionState;
  setSubmission: SetSubmission;
}) {
  const { locked, attempt, files, memo, lastModified } = submission;

  // 마지막 남은 기간을 실시간으로 갱신하기 위한 tick (30초마다)
  const [, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(t);
  }, []);
  const remaining = formatRemaining(dueDate);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleBottomButton = () => {
    if (locked) {
      // 제출한 과제 편집 → 과제 제출로 전환: 다시 수정 가능, 시도 수 +1
      setSubmission((prev) => ({ ...prev, locked: false, attempt: prev.attempt + 1 }));
    } else {
      // 과제 제출 클릭 시 확인 모달을 먼저 띄움
      setShowConfirm(true);
    }
  };

  const confirmSubmit = () => {
    setSubmission((prev) => ({ ...prev, locked: true, lastModified: formatNow() }));
    setShowConfirm(false);
  };

  // ── 첨부파일 ───────────────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const next: SubmissionFile[] = Array.from(fileList).map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: formatSize(f.size),
      ext: extFromName(f.name),
    }));
    setSubmission((prev) => ({ ...prev, files: [...prev.files, ...next] }));
  };

  const removeFile = (id: string) =>
    setSubmission((prev) => ({ ...prev, files: prev.files.filter((f) => f.id !== id) }));

  // ── 과제 작성칸(메모) ─────────────────────────────────────────────────
  // 서버로는 "완료"를 눌렀을 때만 저장(스팸 방지). 그 전까지는 로컬 임시글로만 관리.
  const [memoDraft, setMemoDraft] = useState(memo);
  const [memoDone, setMemoDone] = useState(memo.trim().length > 0);
  const [memoExpanded, setMemoExpanded] = useState(false);

  const commitMemo = () => {
    setSubmission((prev) => ({ ...prev, memo: memoDraft }));
    setMemoDone(true);
    setMemoExpanded(false);
  };

  const editMemoAgain = () => {
    setMemoDraft(memo);
    setMemoDone(false);
  };

  return (
    <div className="mx-auto max-w-3xl p-3 sm:p-4 lg:p-6">
      <h1 className="mb-4 text-lg font-bold text-[#1a1e2e]">데이트 보고서 제출</h1>

      {/* 제출 상황 */}
      <div className="mb-4 rounded-md border border-black/[0.06] bg-white">
        <div className="border-b border-black/[0.06] bg-slate-50/70 px-4 py-2.5 text-sm font-semibold text-[#1a1e2e]">
          제출 상황
        </div>

        <Row label="시도 수">시도 {attempt} (20 시도가 허용됩니다.)</Row>

        <Row label="제출 여부">
          {locked ? (
            <span className="inline-flex items-center gap-1 font-semibold text-green-600">
              <CheckCircle2 className="size-3.5" /> 제출 완료
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-red-600">
              <AlertCircle className="size-3.5" /> 제출 안 함
            </span>
          )}
        </Row>

        <Row label="제출 상황">
          <span className="inline-flex items-center gap-1 font-semibold text-red-600">
            <AlertCircle className="size-3.5" /> 채점되지 않음
          </span>
        </Row>

        <Row label="종료 일시">{formatDueDate(dueDate)}</Row>

        <Row label="마지막 남은 기간">
          <span
            className={`font-semibold ${remaining.overdue ? "text-red-600" : "text-blue-600"}`}
          >
            {remaining.text}
          </span>
        </Row>

        <Row label="최종 수정 일시">{lastModified ?? "-"}</Row>

        {/* 첨부파일: 잠금 상태가 아닐 때만 첨부/삭제 가능 */}
        <Row label="첨부파일">
          <div className="space-y-1.5">
            {files.length === 0 && (
              <p className="text-slate-400">제출한 파일이 없습니다.</p>
            )}
            {files.map((f) => (
              <div key={f.id} className="flex flex-wrap items-center gap-2 py-0.5">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${extBadgeClass(f.ext)}`}
                >
                  {f.ext}
                </span>
                <span className="min-w-0 flex-1 truncate text-blue-600">{f.name}</span>
                <span className="shrink-0 text-xs text-slate-400">{f.size}</span>
                <Download className="size-3.5 shrink-0 text-blue-600" />
                {!locked && (
                  <button
                    onClick={() => removeFile(f.id)}
                    className="shrink-0 text-slate-400 hover:text-red-500"
                    aria-label="파일 삭제"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            ))}

            {!locked && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-dashed border-blue-300 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  <Paperclip className="size-3.5" /> 파일 첨부
                </button>
              </>
            )}
          </div>
        </Row>

        {/* 과제 작성칸: 잠금 상태에서는 조회만 가능 */}
        <Row label="과제 작성칸">
          {locked ? (
            memo.trim().length > 0 ? (
              memoExpanded ? (
                <div className="space-y-2">
                  <p className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 leading-relaxed text-[#1a1e2e]">
                    {memo}
                  </p>
                  <button
                    onClick={() => setMemoExpanded(false)}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    접기
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setMemoExpanded(true)}
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Eye className="size-3.5" /> 메모 ({memo.length}자).. 더보기
                </button>
              )
            ) : (
              <span className="text-slate-400">작성한 내용이 없습니다.</span>
            )
          ) : memoDone && !memoExpanded ? (
            <button
              onClick={() => setMemoExpanded(true)}
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              <Eye className="size-3.5" /> 메모 ({memo.length}자).. 더보기
            </button>
          ) : memoDone && memoExpanded ? (
            <div className="space-y-2">
              <p className="whitespace-pre-wrap rounded-md bg-slate-50 p-3 leading-relaxed text-[#1a1e2e]">
                {memo}
              </p>
              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => setMemoExpanded(false)}
                  className="text-slate-500 hover:underline"
                >
                  접기
                </button>
                <button onClick={editMemoAgain} className="text-blue-600 hover:underline">
                  수정하기
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={memoDraft}
                onChange={(e) => setMemoDraft(e.target.value)}
                rows={4}
                placeholder="과제 내용을 입력하세요."
                className="w-full resize-none rounded-md border border-black/[0.1] p-2.5 text-sm outline-none focus:border-blue-400"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{memoDraft.length}자 작성됨</span>
                <button
                  onClick={commitMemo}
                  disabled={memoDraft.trim().length === 0}
                  className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  완료
                </button>
              </div>
            </div>
          )}
        </Row>
      </div>

      {/* 채점 현황 */}
      <div className="mb-4 rounded-md border border-black/[0.06] bg-white">
        <div className="border-b border-black/[0.06] bg-slate-50/70 px-4 py-2.5 text-sm font-semibold text-[#1a1e2e]">
          채점 현황
        </div>
        <div className="flex items-center gap-3.5 p-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full border-4 border-slate-100">
            <span className="text-xl font-bold text-slate-400">—</span>
          </div>
          <div>
            <p className="text-sm text-slate-500">아직 채점되지 않았습니다.</p>
            <p className="text-sm text-slate-500">채점 완료 후 성적이 반영됩니다.</p>
          </div>
        </div>
      </div>

      {/* 피드백 댓글 */}
      <div className="mb-6 rounded-md border border-black/[0.06] bg-white">
        <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-slate-50/70 px-4 py-2.5 text-sm font-semibold text-[#1a1e2e]">
          <MessageSquare className="size-3.5 text-blue-600" />
          피드백 댓글
        </div>
        <div className="p-6 text-center text-sm text-slate-500">
          아직 피드백이 없습니다.
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <button
          onClick={handleBottomButton}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:order-1"
        >
          {locked ? "제출한 과제 편집" : "과제 제출"}
        </button>
        <button
          onClick={goCourse}
          className="rounded-md border border-black/[0.08] bg-white px-6 py-2 text-sm font-semibold text-[#1a1e2e] hover:bg-slate-50 sm:order-2"
        >
          목록으로
        </button>
      </div>

      {/* 제출 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
            <p className="text-center text-sm font-medium text-[#1a1e2e]">
              과제를 제출하시겠습니까?
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-md border border-black/[0.08] bg-white py-2 text-sm font-semibold text-[#1a1e2e] hover:bg-slate-50"
              >
                아니요
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                예
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}