import Link from 'next/link';
// import Github from './GitHub';

export const Header = () => {
  return (
    <header className="flex items-center justify-between w-full px-2 mt-5 border-b-2 pb-7 sm:px-4">
      <Link href="/" className="flex space-x-3">
        <img
          alt="header text"
          src="/logo-1.png"
          className="w-8 h-8 sm:w-9 sm:h-9"
        />
        <h1 className="ml-2 text-2xl font-bold tracking-tight sm:text-3xl">
          honesthire.io
        </h1>
      </Link>
      <a
        className="flex items-center justify-center px-4 py-2 space-x-2 text-sm text-gray-600 transition-colors bg-white border border-gray-300 rounded-full shadow-md max-w-fit hover:bg-gray-100"
        href="https://twitter.com/hangandaniel"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* <Github /> */}
          <svg
            aria-hidden="true"
            className="w-6 h-6 fill-slate-500 group-hover:fill-slate-700"
          >
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92a8.19 8.19 0 0 1-2.357.646 4.118 4.118 0 0 0 1.804-2.27 8.224 8.224 0 0 1-2.605.996 4.107 4.107 0 0 0-6.993 3.743 11.65 11.65 0 0 1-8.457-4.287 4.106 4.106 0 0 0 1.27 5.477A4.073 4.073 0 0 1 2.8 9.713v.052a4.105 4.105 0 0 0 3.292 4.022 4.093 4.093 0 0 1-1.853.07 4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 2 18.407a11.615 11.615 0 0 0 6.29 1.84" />
          </svg>
        <p>Follow us</p>
      </a>
    </header>
  );
}
