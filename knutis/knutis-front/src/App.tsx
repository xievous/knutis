import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import CreatePotluck from "./pages/CreatePotluck";
import PotluckDetails from "./pages/PotluckDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreatePotluck />} />
      <Route path="/potluck/:id" element={<PotluckDetails />} />
    </Routes>
  );
}

export default App;
