import { useLocation } from "react-router-dom";
import Navbar from "../components/home/navbar";
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ["/tasks"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);
  return (
    <>
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {showNavbar && <Navbar />}
        <main>{children}</main>
      </div>{" "}
    </>
  );
};
export default Layout;
