export function Header() {
  return (
    <header className="bg-profile relative flex h-[220px] items-center justify-center overflow-hidden md:h-[296px]">
      <div
        aria-hidden
        className="absolute -left-20 top-[-80px] h-[200px] w-[200px] rounded-full bg-[#14589C] blur-[106px]"
      />
      <div
        aria-hidden
        className="absolute -right-20 top-[-60px] h-[200px] w-[200px] rounded-full bg-[#14589C] blur-[106px]"
      />
      <div
        aria-hidden
        className="absolute left-0 top-16 h-[3px] w-[40%] bg-[rgba(21,98,175,0.34)]"
      />
      <div
        aria-hidden
        className="absolute right-0 top-24 h-[3px] w-[35%] bg-[rgba(21,98,175,0.14)]"
      />

      <div className="relative flex items-center gap-5 text-brand">
        <svg
          aria-hidden
          width="45"
          height="40"
          viewBox="0 0 45 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-brand"
        >
          <path
            d="M16 10L6 20L16 30"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29 10L39 20L29 30"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-logo text-[24px] leading-none tracking-wide text-brand">
          GITHUB BLOG
        </span>
      </div>
    </header>
  )
}
