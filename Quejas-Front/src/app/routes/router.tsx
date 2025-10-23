import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import HomePage from "../../pages/HomePage";
import PuntosAtencionPage from "../../features/puntos/PuntoAtencionPage";
import { RequireAuth, RequirePermission } from "./guards";
import CrearQuejaPage from "../../features/quejas/CrearQuejaPage";
import AutoconsultaPage from "../../features/seguimiento/AutoconsultaPage";
import RegistroPage from "../../features/auth/RegistroPage";
import AsignacionPage from "../../features/asignacion/AsignacionPage";
import UsuarioPuntoAtencionPage from "../../features/usuarios-punto/UsuarioPuntoAtencionPage";
import SeguimientoPAPage from "../../features/seguimiento-pa/SeguimientoPage";
import UsuariosPage from "../../features/usuarios/UsuariosPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "puntos",
        element: (
          <RequirePermission permission="CatalogoPuntosAtencion">
            <PuntosAtencionPage />
          </RequirePermission>
        ),
      },
      {
        path: "quejas/nueva",
        element: (
          <RequireAuth>
            <CrearQuejaPage />
          </RequireAuth>
        ),
      },
      {
        path: "autoconsulta",
        element: (
          <RequireAuth>
            <AutoconsultaPage />
          </RequireAuth>
        ),
      },
      {
        path: "registro",
        element: <RegistroPage />,
      },
      {
        path: "asignacion",
        element: (
          <RequirePermission permission="AsignacionRechazo">
            <AsignacionPage />
          </RequirePermission>
        ),
      },
      {
        path: "usuarios-punto",
        element: (
          <RequirePermission permission="UsuarioPuntoAtencion">
            <UsuarioPuntoAtencionPage />
          </RequirePermission>
        ),
      },
      {
  path: "seguimiento/pa",
  element: (
    <RequirePermission permission="SeguimientoPuntoAtencion">
      <SeguimientoPAPage />
    </RequirePermission>
  ),
},{
  path: "usuarios",
  element: (
    <RequirePermission permission="Usuarios">
      <UsuariosPage />
    </RequirePermission>
  ),
},
    ],
  },
]);
