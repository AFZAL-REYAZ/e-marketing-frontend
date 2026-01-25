import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-lg font-semibold tracking-tight text-gray-900">
              Nexus<span className="text-blue-600">Mail</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Secure Messaging Platform
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-8 text-xs font-medium uppercase tracking-wide text-gray-600">
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className="hover:text-blue-600 transition-colors"
            >
              Logs
            </Link>
            <a
              href="#"
              className="hover:text-blue-600 transition-colors"
            >
              Status
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-500">
            © {new Date().getFullYear()} NexusMail. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
