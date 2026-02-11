export default function SiteFooter() {
  return (
    <footer
      className="border-t border-divider bg-[var(--color-header-bg)]
                 transition-colors duration-[var(--duration-slow)] ease-atl"
    >
      <div className="px-4 py-5 sm:px-6 sm:py-4 md:px-8">
        <p className="flex items-center gap-1.5 text-xs text-text-secondary sm:text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 sm:h-4 sm:w-4"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="9" cy="16" r="1" />
            <circle cx="15" cy="16" r="1" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            <path d="M12 2v1" />
            <path d="M2 16h2" />
            <path d="M20 16h2" />
          </svg>
          2026 Creative Context | James McKay
        </p>
      </div>
    </footer>
  );
}
