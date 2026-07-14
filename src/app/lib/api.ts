export interface RemoteAssignment {
  id: string;
  title: string;
  dueDate: string;
}

export interface RemoteSubmissionFile {
  id: string;
  name: string;
  size: string;
  ext: "DOCX" | "PDF" | "FILE";
}

export interface RemoteSubmission {
  locked: boolean;
  attempt: number;
  files: RemoteSubmissionFile[];
  memo: string;
  lastModified: string | null;
}

export interface RemoteNotice {
  id: string;
  title: string;
  date: string;
  isNew: boolean;
}

export interface RemoteState {
  assignments: RemoteAssignment[];
  submission: RemoteSubmission;
  notices: RemoteNotice[];
}

export async function fetchState(userId: string): Promise<RemoteState> {
  const res = await fetch(`/api/state?user=${encodeURIComponent(userId)}`);
  if (!res.ok) {
    throw new Error(`상태를 불러오지 못했습니다. (${res.status})`);
  }
  return res.json();
}

export async function saveState(
  userId: string,
  data: RemoteState,
): Promise<RemoteState> {
  const res = await fetch("/api/state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: userId, data }),
  });
  if (!res.ok) {
    throw new Error(`상태를 저장하지 못했습니다. (${res.status})`);
  }
  return res.json();
}
