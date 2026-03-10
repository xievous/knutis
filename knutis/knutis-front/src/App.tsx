import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import CreatePotluck from "./pages/CreatePotluck";
import PotluckDetails from "./pages/PotluckDetails";
import EditPotluck from "./pages/EditPotluck";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreatePotluck />} />
      <Route path="/potluck/:id" element={<PotluckDetails />} />
      <Route path="/edit/:id" element={<EditPotluck />} />
    </Routes>
  );
}

export default App;
