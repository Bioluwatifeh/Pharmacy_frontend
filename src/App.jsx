import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", syncToken);   // other tabs
    window.addEventListener("auth-change", syncToken); // same tab, custom event
    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("auth-change", syncToken);
    };
  }, []);

  if (!token) return <AppRoutes />;

  return (
    <div>
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;