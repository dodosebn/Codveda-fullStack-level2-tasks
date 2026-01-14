import { useNavigate } from "react-router-dom";
import { FaUserAstronaut } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  const handleChange = (item: string) => {
    navigate(item);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handleChange("/")}
        >
          <h1 className="text-2xl font-bold">Taskiana</h1>
          <span>|</span>
          <p className="text-xl text-indigo-700 font-bold">home</p>
        </div>

        {/* <div className="flex items-center gap-4">
          {menuItems.map((item) => (
            <button key={item} className="px-4 py-2">
              {item}
            </button>
          ))}
        </div> */}

        <button
          onClick={() => handleChange("/authForm")}
          className="flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2"
        >
          <FaUserAstronaut className="text-lg" />
          <span className="font-medium">Account</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
