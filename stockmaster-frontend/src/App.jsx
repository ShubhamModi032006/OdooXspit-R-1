import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages (we will create soon)
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard will add later */}
        <Route path="/" element={<div>Dashboard Placeholder</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
