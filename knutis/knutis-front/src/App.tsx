import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import CreatePotluck from "./pages/CreatePotluck";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreatePotluck />} />
    </Routes>
  );
}

export default App;
