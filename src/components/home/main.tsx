// Main.jsx
import { IoMdPaperPlane } from "react-icons/io";
import MockBrowser from "./mockBrowser";
import Stats from "./stats";
import { features } from "./data";
import { useNavigate } from "react-router-dom";
const Main = () => {
  const Navigate = useNavigate();
  const handleAccount = () => {
    Navigate("/authForm");
  };
  return (
    <div className="min-h-screen ">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 md:space-y-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse"></span>
              AI-Powered Task Management
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Smarter Task Management
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
                With Curated Tools
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Taskiana intelligently organizes your tasks, priorities, and
              workflows so you can focus on what truly matters.
            </p>

            <div className="flex flex-row gap-4 justify-center pt-8">
              <button
                onClick={() => handleAccount()}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span>Get Started</span>
                <IoMdPaperPlane className="text-lg opacity-90" />
              </button>
            </div>

            <Stats />
          </div>

          <div className="mt-20 md:mt-32 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-10 blur-3xl rounded-full"></div>

            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <MockBrowser />
            </div>

            <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-white border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 md:mt-32 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Taskiana. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Main;
