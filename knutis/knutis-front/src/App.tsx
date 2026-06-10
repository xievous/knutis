import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreatePotluck from "./pages/CreatePotluck";
import PotluckDetails from "./pages/PotluckDetails";
import EditPotluck from "./pages/EditPotluck";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePotluck />} />
        <Route path="/potluck/:id" element={<PotluckDetails />} />
        <Route path="/edit/:id" element={<EditPotluck />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
