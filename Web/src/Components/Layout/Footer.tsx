import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-1 py-6 drop-shadow-[0_-5px_3px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="font-bold text-lg">TripSummarizer</h2>
          <p className="text-sm">Summarizing your world, one trip at a time.</p>
        </div>

        <div className="flex gap-4 text-xl">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </div>

        <div className="text-sm">
          © {currentYear} TripSummarizer. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
