import Button from './button';
import { FaClipboardList } from 'react-icons/fa6';
import { useAuth } from '../context/authContext';

const TaskIntro = () => {
    const { email, logout } = useAuth();

  return (
    <div className="flex flex-row justify-between items-start sm:items-center mb-8 gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <FaClipboardList className="text-blue-600" />
        Taskiana 
      </h1>
      {email && (
        <p className="text-gray-600 mt-1">
          Welcome back, <span className="font-medium">{email}</span>
        </p>
      )}
    </div>
    <Button 
      onClick={logout} 
      variant="secondary"
      className="px-4 py-2"
    >
      Logout
    </Button>
  </div>  )
}

export default TaskIntro;