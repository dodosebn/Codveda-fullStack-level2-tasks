import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import AuthForm from "./pages/authForm";
import Home from "./pages/home";
import Tasks from "./pages/tasks";
import ProtectedRoute from "./components/protectedRoute";
import Layout from "./components/layout";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/authForm" element={<AuthForm />} />
            <Route
              path="/tasks"
              element={<ProtectedRoute element={<Tasks />} />}
            />{" "}
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
