import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import NotFoundPage from '../../pages/NotFoundPage';
import LoginPage from '../../modules/auth/pages/LoginPage';
import CitasListPage from '../../modules/citas/pages/CitasListPage';
import CitaCreatePage from '../../modules/citas/pages/CitaCreatePage';
import CitaDetailPage from '../../modules/citas/pages/CitaDetailPage';
import ReagendarCitaPage from '../../modules/citas/pages/ReagendarCitaPage';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import { APP_ROUTES } from './routes';

function HistoriaClinicaPage() {
  return <h1>Módulo de Historia Clínica</h1>;
}

function NuevaHistoriaClinicaPage() {
  return <h1>Nueva Historia Clínica</h1>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route path={APP_ROUTES.HOME} element={<HomePage />} />

          <Route path={APP_ROUTES.CITAS} element={<CitasListPage />} />
          <Route path={APP_ROUTES.CITAS_NUEVA} element={<CitaCreatePage />} />
          <Route path={APP_ROUTES.CITAS_DETALLE} element={<CitaDetailPage />} />
          <Route path={APP_ROUTES.CITAS_REAGENDAR} element={<ReagendarCitaPage />} />

          <Route
            element={<RoleRoute allowedRoles={['ADMIN', 'MEDICO', 'TERAPISTA']} />}
          >
            <Route
              path={APP_ROUTES.HISTORIA_CLINICA}
              element={<HistoriaClinicaPage />}
            />
            <Route
              path={APP_ROUTES.HISTORIA_CLINICA_NUEVA}
              element={<NuevaHistoriaClinicaPage />}
            />
          </Route>
        </Route>

        <Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="" element={<Navigate to={APP_ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}