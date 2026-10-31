import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { LoadingState } from "./components/Common";

// Code-splitting por ruta: el docente casi siempre entra al Dashboard primero;
// no tiene sentido descargar Recharts (Radar) o el formulario de Biblioteca
// antes de que los pida. Reduce el bundle inicial de un solo archivo ~600kB.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Students = lazy(() => import("./pages/Students"));
const StudentDetail = lazy(() => import("./pages/StudentDetail"));
const Diagnostico = lazy(() => import("./pages/Diagnostico"));
const Groups = lazy(() => import("./pages/Groups"));
const Biblioteca = lazy(() => import("./pages/Biblioteca"));
const MaterialView = lazy(() => import("./pages/MaterialView"));
const Radar = lazy(() => import("./pages/Radar"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<LoadingState label="Cargando..." />}>
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
    </Suspense>
  );
}
