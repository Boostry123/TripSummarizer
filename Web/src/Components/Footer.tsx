import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">TripSummarizer</h2>
          <p className="text-slate-500 text-sm italic">Summarizing your world, one trip at a time.</p>
        </div>

        <div className="flex gap-6 text-2xl text-slate-400 dark:text-slate-500">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <FaLinkedin />
          </a>
        </div>

        <div className="text-slate-400 text-sm">
          © {currentYear} TripSummarizer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
