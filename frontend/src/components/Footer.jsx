import { FaInstagram, FaGithub, FaLinkedin, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full mt-auto  py-6 px-4 bg-base-200  text-base-content flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-base-300">
      <p className="text-sm flex items-center gap-1">
        Made with <FaHeart className="text-red-500" /> by Aniket
      </p>
      <div className="flex gap-4 text-xl">
        <a
          href="https://github.com/aniket-username"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          <FaGithub />
        </a>
        <a
          href="https://linkedin.com/in/aniket-linkedin"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://instagram.com/aniket.ig"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition-colors"
        >
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
