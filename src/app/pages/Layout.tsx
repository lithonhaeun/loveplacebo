import { useState, type ReactNode } from "react";
import {
  Home,
  BookOpen,
  Calendar,
  Video,
  ClipboardList,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Users,
  Bell,
  LogOut,
  Menu,
  GraduationCap,
  ChevronRight,
  X,
  FileText,
} from "lucide-react";

export type View = "home" | "course" | "assignment" | "discussion" | "notices";

interface LayoutProps {
  view: View;
  goHome: () => void;
  goCourse: () => void;
  goAssignment: () => void;
  goDiscussion: () => void;
  goNotices: () => void;
  noticeCount: number;
  breadcrumb: string;
  userName: string;
  onLogout: () => void;
  children: ReactNode;
}

function NavItem({
  icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-white/10 text-white font-medium"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="shrink-0 [&>svg]:size-4">{icon}</span>
      <span className="flex-1 text-left truncate">{label}</span>
      {badge ? (
        <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function NavGroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </p>
  );
}

function SidebarContent({
  view,
  goHome,
  goCourse,
  goAssignment,
  goDiscussion,
  goNotices,
  noticeCount,
  onLogout,
  onNavigate,
}: {
  view: View;
  goHome: () => void;
  goCourse: () => void;
  goAssignment: () => void;
  goDiscussion: () => void;
  goNotices: () => void;
  noticeCount: number;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  const wrap = (fn: () => void) => () => {
    fn();
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col bg-[#1d2b4f]">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-600">
          <GraduationCap className="size-4.5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">러플대학교</p>
          <p className="truncate text-xs text-slate-400">Cyber Campus</p>
        </div>
      </div>

      <button
        onClick={wrap(goCourse)}
        className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3.5 text-left hover:bg-white/5"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
          사
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            사랑과 사람의 이해 (224_1000045)
          </p>
          <p className="truncate text-xs text-slate-400">강좌 관리 메뉴</p>
        </div>
      </button>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <NavItem
          icon={<Home />}
          label="My Page"
          active={view === "home"}
          onClick={wrap(goHome)}
        />

        <NavGroupLabel>강좌</NavGroupLabel>
        <NavItem
          icon={<BookOpen />}
          label="강좌 홈"
          active={view === "course"}
          onClick={wrap(goCourse)}
        />
        <NavItem icon={<FileText />} label="강의계획서" />
        <NavItem icon={<Video />} label="강의영상" />

        <NavGroupLabel>학습관리</NavGroupLabel>
        <NavItem
          icon={<ClipboardList />}
          label="과제"
          badge={1}
          active={view === "assignment"}
          onClick={wrap(goAssignment)}
        />
        <NavItem icon={<BarChart3 />} label="성적/출석관리" />
        <NavItem icon={<HelpCircle />} label="퀴즈/시험" />
        <NavItem
          icon={<MessageSquare />}
          label="토론"
          active={view === "discussion"}
          onClick={wrap(goDiscussion)}
        />

        <NavGroupLabel>커뮤니티</NavGroupLabel>
        <NavItem
          icon={<Bell />}
          label="공지사항"
          badge={noticeCount || undefined}
          active={view === "notices"}
          onClick={wrap(goNotices)}
        />
        <NavItem icon={<Users />} label="수강생 알림" />
        <NavItem icon={<FileText />} label="강의노트" />
      </nav>

      <div className="border-t border-white/10 p-2">
        <NavItem icon={<LogOut />} label="로그아웃" onClick={wrap(onLogout)} />
      </div>
    </div>
  );
}

export default function Layout({
  view,
  goHome,
  goCourse,
  goAssignment,
  goDiscussion,
  goNotices,
  noticeCount,
  breadcrumb,
  userName,
  onLogout,
  children,
}: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f0f2f5]">
      {/* Desktop sidebar */}
      <aside className="hidden w-[240px] shrink-0 md:block">
        <SidebarContent
          view={view}
          goHome={goHome}
          goCourse={goCourse}
          goAssignment={goAssignment}
          goDiscussion={goDiscussion}
          goNotices={goNotices}
          noticeCount={noticeCount}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[260px] shadow-xl">
            <div className="flex justify-end bg-[#1d2b4f] px-2 pt-2">
              <button
                onClick={() => setDrawerOpen(false)}
                className="rounded-md p-1.5 text-slate-300 hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="h-[calc(100%-40px)]">
              <SidebarContent
                view={view}
                goHome={goHome}
                goCourse={goCourse}
                goAssignment={goAssignment}
                goDiscussion={goDiscussion}
                goNotices={goNotices}
                noticeCount={noticeCount}
                onLogout={onLogout}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/[0.06] bg-white px-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <Menu className="size-5" />
            </button>
            <span className="hidden shrink-0 items-center gap-1.5 font-semibold text-[#1a1e2e] sm:flex">
              <GraduationCap className="size-4.5 text-blue-600" />
              러플대학교 사이버캠퍼스
            </span>
            <div className="hidden min-w-0 items-center gap-1 text-xs text-slate-500 md:flex">
              <ChevronRight className="size-3.5 shrink-0" />
              <span className="truncate">{breadcrumb}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={goNotices}
              className="relative rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <Bell className="size-5" />
              {noticeCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {noticeCount}
                </span>
              )}
            </button>
            <div className="hidden items-center gap-1.5 sm:flex">
              <div className="flex size-7 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                {userName.slice(0, 1)}
              </div>
              <span className="text-sm font-medium text-[#1a1e2e]">{userName}</span>
            </div>
            <button
              onClick={onLogout}
              className="rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 sm:px-3 sm:text-sm"
            >
              로그아웃
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}