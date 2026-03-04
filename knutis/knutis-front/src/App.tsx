import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import CreatePotluck from "./pages/CreatePotluck";
import { PotluckDeatils } from "./pages/PotluckDeatils";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreatePotluck />} />
      <Route path="/potluck:id" element={<PotluckDeatils />} />
    </Routes>
  );
}

export default App;
