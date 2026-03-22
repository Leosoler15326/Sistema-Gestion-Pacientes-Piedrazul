import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import NotFoundPage from '../../pages/NotFoundPage';
import LoginPage from '../../modules/auth/pages/LoginPage';
import CitasListPage from '../../modules/citas/pages/CitasListPage';
import CitaCreatePage from '../../modules/citas/pages/CitaCreatePage';
import CitaDetailPage from '../../modules/citas/pages/CitaDetailPage';
import ReagendarCitaPage from '../../modules/citas/pages/ReagendarCitaPage';
import HistoriaClinicaListPage from '../../modules/historia-clinica/pages/HistoriaClinicaListPage';
import HistoriaClinicaDetailPage from '../../modules/historia-clinica/pages/HistoriaClinicaDetailPage';
import HistoriaClinicaFormPage from '../../modules/historia-clinica/pages/HistoriaClinicaFormPage';
import LayoutWrapper from '../../components/layout/LayoutWrapper';
import RoleRoute from './RoleRoute';
import ProfesionalesListPage from '../../modules/profesionales/pages/ProfesionalesListPage';
import ProfesionalFormPage from '../../modules/profesionales/pages/ProfesionalFormPage';
import ProfesionalDetailPage from '../../modules/profesionales/pages/ProfesionalDetailPage';
import UsuariosListPage from '../../modules/usuarios/pages/UsuariosListPage';
import UsuarioFormPage from '../../modules/usuarios/pages/UsuarioFormPage';
import UsuarioDetailPage from '../../modules/usuarios/pages/UsuarioDetailPage';
import PacientesListPage from '../../modules/pacientes/pages/PacienteListPage';
import PacienteFormPage from '../../modules/pacientes/pages/PacienteFormPage';
import PacienteDetailPage from '../../modules/pacientes/pages/PacienteDetailPage';
import PacienteEditPage from '../../modules/pacientes/pages/PacienteEditPage';
import UsuarioEditPage from '../../modules/usuarios/pages/UsuarioEditPage';
import HistoriaClinicaEditPage from '../../modules/historia-clinica/pages/HistoriClinicaEditPage';
import { APP_ROUTES } from './routes';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />

        <Route element={<LayoutWrapper />}>
            <Route path={APP_ROUTES.HOME} element={<HomePage />} />

            <Route path={APP_ROUTES.CITAS} element={<CitasListPage />} />
            <Route path={APP_ROUTES.CITAS_NUEVA} element={<CitaCreatePage />} />
            <Route path={APP_ROUTES.CITAS_DETALLE} element={<CitaDetailPage />} />
            <Route path={APP_ROUTES.CITAS_REAGENDAR} element={<ReagendarCitaPage />} />
            //mirar
            <Route element={<RoleRoute allowedRoles={['ADMIN', 'ADMINISTRADOR']} />}>
              <Route path={APP_ROUTES.PROFESIONALES} element={<ProfesionalesListPage />} />
              <Route path={APP_ROUTES.PROFESIONALES_NUEVO} element={<ProfesionalFormPage />} />
              <Route path={APP_ROUTES.PROFESIONALES_DETALLE} element={<ProfesionalDetailPage />} />
            </Route>
            <Route
            element={<RoleRoute allowedRoles={['ADMIN', 'MEDICO', 'TERAPISTA']} />}
            >
            <Route
                path={APP_ROUTES.HISTORIA_CLINICA}
                element={<HistoriaClinicaListPage />}
            />
              <Route
                path={APP_ROUTES.HISTORIA_CLINICA_NUEVA}
                element={<HistoriaClinicaFormPage />}
              />
            <Route
                path={APP_ROUTES.HISTORIA_CLINICA_DETALLE}
                element={<HistoriaClinicaDetailPage />}
            />
            <Route path={APP_ROUTES.PACIENTES_EDITAR} element={<PacienteEditPage />} />
            <Route path={APP_ROUTES.HISTORIA_CLINICA_EDITAR} element={<HistoriaClinicaEditPage />} />

            <Route element={<RoleRoute allowedRoles={['ADMIN', 'ADMINISTRADOR']} />}>
              <Route path={APP_ROUTES.USUARIOS_EDITAR} element={<UsuarioEditPage />} />
            </Route>
            </Route>
            <Route path={APP_ROUTES.PACIENTES} element={<PacientesListPage />} />
            <Route path={APP_ROUTES.PACIENTES_NUEVO} element={<PacienteFormPage />} />
            <Route path={APP_ROUTES.PACIENTES_DETALLE} element={<PacienteDetailPage />} />
            <Route element={<RoleRoute allowedRoles={['ADMIN', 'ADMINISTRADOR']} />}>
              <Route path={APP_ROUTES.USUARIOS} element={<UsuariosListPage />} />
              <Route path={APP_ROUTES.USUARIOS_NUEVO} element={<UsuarioFormPage />} />
              <Route path={APP_ROUTES.USUARIOS_DETALLE} element={<UsuarioDetailPage />} />
            </Route>
        </Route>


        <Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="" element={<Navigate to={APP_ROUTES.HOME} replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}