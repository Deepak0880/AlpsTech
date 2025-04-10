
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-800 dark:bg-slate-900 text-white py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="animate-in fade-in slide-in-from-left duration-500">
            <h3 className="text-xl font-bold mb-4">AlpsTech</h3>
            <p className="text-gray-400">
              Empowering students with quality education in computer science and technology.
            </p>
          </div>
          
          <div className="animate-in fade-in slide-in-from-left duration-500 delay-100">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-400 hover:text-white transition-colors duration-300">Courses</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-300">Login</Link>
              </li>
            </ul>
          </div>
          
          <div className="animate-in fade-in slide-in-from-left duration-500 delay-200">
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Support</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">FAQ</a>
              </li>
            </ul>
          </div>
          
          <div className="animate-in fade-in slide-in-from-left duration-500 delay-300">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <address className="text-gray-400 not-italic">
              <p>12 Bharangi</p>
              <p>Rewari, Haryana 123412</p>
              <p className="mt-2">contact@alpstech.com</p>
              <p>+91 985478963</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AlpsTech. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
