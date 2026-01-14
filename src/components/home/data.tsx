import { FaShieldAlt } from "react-icons/fa";
import { FaCalendarCheck, FaChartBar } from "react-icons/fa6";

export const features = [
  {
    icon: <FaCalendarCheck className="text-3xl" />,
    title: "Auto Scheduling",
    description:
      "Automatically schedule tasks based on your availability and priorities",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: <FaShieldAlt className="text-3xl" />,
    title: "Data Security",
    description:
      "Enterprise-grade security to keep your tasks and data protected",
    color: "from-gray-500 to-gray-700",
  },
  {
    icon: <FaChartBar className="text-3xl" />,
    title: "Smart Analytics",
    description:
      "Get insights into your productivity patterns and time usage with detailed reports",
    color: "from-purple-500 to-pink-500",
  },
];
