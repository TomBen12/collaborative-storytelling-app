import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StoriesPage from "./pages/StoriesPage";
import ContributorsPage from "./pages/ContributorsPage";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link> |{" "}
        <Link to="/stories">Stories</Link> |{" "}
        <Link to="/contributors">Contributors</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/contributors" element={<ContributorsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
