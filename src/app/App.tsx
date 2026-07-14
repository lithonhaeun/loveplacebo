import { useCallback, useEffect, useState } from "react";
import Layout, { type View } from "@/app/pages/Layout";
import HomePage from "@/app/pages/HomePage";
import CoursePage from "@/app/pages/CoursePage";
import AssignmentPage, { type SubmissionState } from "@/app/pages/AssignmentPage";
import AssignmentManagerPage, {
  type AssignmentRecord,
} from "@/app/pages/AssignmentManagerPage";
import NoticeManagerPage, {
  type NoticeRecord,
} from "@/app/pages/NoticeManagerPage";
import { fetchState, saveState, type RemoteState } from "@/app/lib/api";

export type UserId = "kim" | "park";

export const USER_NAMES: Record<UserId, string> = {
  kim: "김영재",
  park: "박효민",
};

const BREADCRUMBS: Record<View, string> = {
  home: "사랑과 사람의 이해 (224_1000045) > 강좌 목록",
  course: "사랑과 사람의 이해 (224_1000045) > 강좌 홈",
  assignment: "사랑과 사람의 이해 (224_1000045) > 과제 > 데이트 보고서 제출",
  discussion: "사랑과 사람의 이해 (224_1000045) > 토론",
  notices: "사랑과 사람의 이해 (224_1000045) > 공지사항",
};

const DEFAULT_ASSIGNMENTS: AssignmentRecord[] = [
  { id: "date-report", title: "데이트 보고서 제출", dueDate: "2026-08-01T22:00" },
];

const DEFAULT_SUBMISSION: SubmissionState = {
  locked: false,
  attempt: 1,
  files: [],
  memo: "",
  lastModified: null,
};

const DEFAULT_NOTICES: NoticeRecord[] = [
  { id: "n1", title: "사랑과 사람의 이해 OT 안내", date: "2026-07-16", isNew: true },
  { id: "n2", title: "팀플 조편성 공지", date: "2026-04-01", isNew: true },
  { id: "n3", title: "강의계획서 업로드 안내", date: "2026-03-15", isNew: false },
  { id: "n4", title: "데이트 보고서 과제 제출 방법 안내", date: "2026-03-10", isNew: false },
  {
    id: "n5",
    title: "2026년도 1학기 학습 지원 프로그램 안내",
    date: "2026-07-08",
    isNew: false,
  },
  { id: "n6", title: "수강정정 기간 안내 (재공지)", date: "2026-07-05", isNew: false },
];

type Updater<T> = T | ((prev: T) => T);

function resolveUpdater<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [userId, setUserId] = useState<UserId>("kim");
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [assignments, setAssignmentsState] =
    useState<AssignmentRecord[]>(DEFAULT_ASSIGNMENTS);
  const [submission, setSubmissionState] =
    useState<SubmissionState>(DEFAULT_SUBMISSION);
  const [notices, setNoticesState] = useState<NoticeRecord[]>(DEFAULT_NOTICES);

  // 사용자가 바뀔 때마다 구글시트에서 그 사람의 데이터를 새로 불러옴
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSyncError(null);
    fetchState(userId)
      .then((data) => {
        if (cancelled) return;
        setAssignmentsState(
          data.assignments?.length ? data.assignments : DEFAULT_ASSIGNMENTS,
        );
        setSubmissionState({ ...DEFAULT_SUBMISSION, ...data.submission });
        setNoticesState(data.notices?.length ? data.notices : DEFAULT_NOTICES);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setSyncError(
          "구글시트에서 데이터를 불러오지 못했습니다. 환경변수 설정을 확인해주세요. (임시로 기본값을 사용합니다)",
        );
        setAssignmentsState(DEFAULT_ASSIGNMENTS);
        setSubmissionState(DEFAULT_SUBMISSION);
        setNoticesState(DEFAULT_NOTICES);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  // 현재 상태 스냅샷을 구글시트에 저장 (실패해도 화면 동작은 계속됨)
  const persist = useCallback(
    (patch: Partial<RemoteState>) => {
      const next: RemoteState = {
        assignments: patch.assignments ?? assignments,
        submission: patch.submission ?? submission,
        notices: patch.notices ?? notices,
      };
      saveState(userId, next).catch((err) => {
        console.error(err);
        setSyncError("변경사항을 구글시트에 저장하지 못했습니다.");
      });
    },
    [userId, assignments, submission, notices],
  );

  const setAssignments = (updater: Updater<AssignmentRecord[]>) => {
    setAssignmentsState((prev) => {
      const next = resolveUpdater(updater, prev);
      persist({ assignments: next });
      return next;
    });
  };

  const setSubmission = (updater: Updater<SubmissionState>) => {
    setSubmissionState((prev) => {
      const next = resolveUpdater(updater, prev);
      persist({ submission: next });
      return next;
    });
  };

  const setNotices = (updater: Updater<NoticeRecord[]>) => {
    setNoticesState((prev) => {
      const next = resolveUpdater(updater, prev);
      persist({ notices: next });
      return next;
    });
  };

  const goHome = () => setView("home");
  const goCourse = () => setView("course");
  const goAssignment = () => setView("assignment");
  const goDiscussion = () => setView("discussion");
  const goNotices = () => setView("notices");

  // "로그아웃" = 실제 로그아웃이 아니라 김영재 ↔ 박효민 계정 전환
  const switchUser = () => {
    setUserId((u) => (u === "kim" ? "park" : "kim"));
    setView("home");
  };

  const dateReportDueDate =
    assignments.find((a) => a.id === "date-report")?.dueDate ?? "";

  return (
    <Layout
      view={view}
      goHome={goHome}
      goCourse={goCourse}
      goAssignment={goAssignment}
      goDiscussion={goDiscussion}
      goNotices={goNotices}
      noticeCount={notices.filter((n) => n.isNew).length}
      breadcrumb={BREADCRUMBS[view]}
      userName={USER_NAMES[userId]}
      onLogout={switchUser}
    >
      {syncError && (
        <div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-700">
          {syncError}
        </div>
      )}

      {loading ? (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">
          {USER_NAMES[userId]}님의 데이터를 불러오는 중...
        </div>
      ) : (
        <>
          {view === "home" && (
            <HomePage goCourse={goCourse} notices={notices} goNotices={goNotices} />
          )}
          {view === "course" && (
            <CoursePage
              goAssignment={goAssignment}
              notices={notices}
              goNotices={goNotices}
            />
          )}
          {view === "assignment" && (
            <AssignmentPage
              key={userId}
              goCourse={goCourse}
              dueDate={dateReportDueDate}
              submission={submission}
              setSubmission={setSubmission}
            />
          )}
          {view === "discussion" && (
            <AssignmentManagerPage
              key={userId}
              assignments={assignments}
              setAssignments={setAssignments}
            />
          )}
          {view === "notices" && (
            <NoticeManagerPage
              key={userId}
              notices={notices}
              setNotices={setNotices}
            />
          )}
        </>
      )}
    </Layout>
  );
}