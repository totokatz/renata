import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full py-12 md:py-20 px-6 md:px-12 mt-24 md:mt-40 bg-[#fcf8f9] flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 border-t border-slate-200/10">
      <div className="text-base md:text-lg font-bold tracking-widest text-[#1c1b1c] font-label uppercase">
        Renata Nanni
      </div>
      <div className="flex flex-wrap justify-center gap-8 md:gap-10">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[0.75rem] tracking-[0.15em] font-light text-[#1c1b1c] opacity-60 hover:opacity-100 transition-opacity duration-1000 ease-in-out"
        >
          Instagram
        </a>
        <Link
          to="/privacy"
          className="font-body text-[0.75rem] tracking-[0.15em] font-light text-[#1c1b1c] opacity-60 hover:opacity-100 transition-opacity duration-1000 ease-in-out underline underline-offset-8"
        >
          Privacy
        </Link>
        <Link
          to="/inquire"
          className="font-body text-[0.75rem] tracking-[0.15em] font-light text-[#1c1b1c] opacity-60 hover:opacity-100 transition-opacity duration-1000 ease-in-out"
        >
          Contact
        </Link>
      </div>
      <div className="font-body text-[0.75rem] tracking-[0.15em] font-light text-[#1c1b1c] opacity-40">
        © 2024 Renata Nanni. All Rights Reserved.
      </div>
    </footer>
  )
}
