import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {

  const token = localStorage.getItem("token");

  if (!token) {
    return <AppRoutes />;
  }

  return (
    <div>

      <Navbar />

      <AppRoutes />

    </div>
  );
}

export default App;