import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Diagnostico from "./pages/Diagnostico";
import Groups from "./pages/Groups";
import Biblioteca from "./pages/Biblioteca";
import MaterialView from "./pages/MaterialView";
import Radar from "./pages/Radar";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/estudiantes" element={<Students />} />
        <Route path="/estudiantes/:id" element={<StudentDetail />} />
        <Route path="/diagnostico" element={<Diagnostico />} />
        <Route path="/grupos" element={<Groups />} />
        <Route path="/biblioteca" element={<Biblioteca />} />
        <Route path="/biblioteca/material/:id" element={<MaterialView type="material" />} />
        <Route path="/biblioteca/sesion/:id" element={<MaterialView type="lesson" />} />
        <Route path="/radar" element={<Radar />} />
        <Route path="/configuracion" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
