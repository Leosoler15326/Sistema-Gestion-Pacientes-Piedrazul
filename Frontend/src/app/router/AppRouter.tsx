import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import NotFoundPage from '../../pages/NotFoundPage';
import LoginPage from '../../modules/auth/pages/LoginPage';
import RegistroPacientePage from '../../modules/auth/pages/RegistroPacientePage';

import CitasListPage from '../../modules/citas/pages/CitasListPage';
import CitaCreatePage from '../../modules/citas/pages/CitaCreatePage';
import CitaDetailPage from '../../modules/citas/pages/CitaDetailPage';
import ReagendarCitaPage from '../../modules/citas/pages/ReagendarCitaPage';
import AgendarContactoPage from '../../modules/citas/pages/AgendarContactoPage';

import HistoriaClinicaListPage from '../../modules/historia-clinica/pages/HistoriaClinicaListPage';
import HistoriaClinicaDetailPage from '../../modules/historia-clinica/pages/HistoriaClinicaDetailPage';
import HistoriaClinicaFormPage from '../../modules/historia-clinica/pages/HistoriaClinicaFormPage';
import HistoriaClinicaEditPage from '../../modules/historia-clinica/pages/HistoriClinicaEditPage';

import ProfesionalesListPage from '../../modules/profesionales/pages/ProfesionalesListPage';
import ProfesionalFormPage from '../../modules/profesionales/pages/ProfesionalFormPage';
import ProfesionalDetailPage from '../../modules/profesionales/pages/ProfesionalDetailPage';
import ProfesionalEditPage from '../../modules/profesionales/pages/ProfesionalEditPage';

import UsuariosListPage from '../../modules/usuarios/pages/UsuariosListPage';
import UsuarioFormPage from '../../modules/usuarios/pages/UsuarioFormPage';
import UsuarioDetailPage from '../../modules/usuarios/pages/UsuarioDetailPage';
import UsuarioEditPage from '../../modules/usuarios/pages/UsuarioEditPage';

import PacientesListPage from '../../modules/pacientes/pages/PacienteListPage';
import PacienteFormPage from '../../modules/pacientes/pages/PacienteFormPage';
import PacienteDetailPage from '../../modules/pacientes/pages/PacienteDetailPage';
import PacienteEditPage from '../../modules/pacientes/pages/PacienteEditPage';
import PacienteCompletarPerfilPage from '../../modules/pacientes/pages/PacienteCompletarPerfilPage';
import PacienteAgendarCitaPage from '../../modules/pacientes/pages/PacienteAgendarCitaPage';
import PacienteMisCitasPage from '../../modules/pacientes/pages/PacienteMisCitasPage';

import ConfigAgendamientoPage from '../../modules/configuracion/pages/ConfigAgendamientoPage';

import LayoutWrapper from '../../components/layout/LayoutWrapper';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import { APP_ROUTES } from './routes';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={APP_ROUTES.REGISTRO_PACIENTE} element={<RegistroPacientePage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<LayoutWrapper />}>
            <Route path={APP_ROUTES.HOME} element={<HomePage />} />

            <Route path={APP_ROUTES.CITAS} element={<CitasListPage />} />
            <Route path={APP_ROUTES.CITAS_DETALLE} element={<CitaDetailPage />} />

            <Route
              element={
                <RoleRoute allowedRoles={['ADMINISTRADOR', 'AGENDADOR', 'MEDICO_TERAPISTA']} />
              }
            >
              <Route path={APP_ROUTES.CITAS_NUEVA} element={<CitaCreatePage />} />
              <Route path={APP_ROUTES.CITAS_REAGENDAR} element={<ReagendarCitaPage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['ADMINISTRADOR', 'AGENDADOR']} />}>
              <Route
                path={APP_ROUTES.CITAS_AGENDAR_CONTACTO}
                element={<AgendarContactoPage />}
              />
            </Route>

            <Route element={<RoleRoute allowedRoles={['PACIENTE']} />}>
              <Route
                path={APP_ROUTES.PACIENTE_COMPLETAR_PERFIL}
                element={<PacienteCompletarPerfilPage />}
              />
              <Route path={APP_ROUTES.PACIENTE_AGENDAR} element={<PacienteAgendarCitaPage />} />
              <Route path={APP_ROUTES.PACIENTE_MIS_CITAS} element={<PacienteMisCitasPage />} />
            </Route>

            <Route
              element={
                <RoleRoute allowedRoles={['ADMINISTRADOR', 'AGENDADOR', 'MEDICO_TERAPISTA']} />
              }
            >
              <Route path={APP_ROUTES.PACIENTES} element={<PacientesListPage />} />
              <Route path={APP_ROUTES.PACIENTES_NUEVO} element={<PacienteFormPage />} />
              <Route path={APP_ROUTES.PACIENTES_DETALLE} element={<PacienteDetailPage />} />
              <Route path={APP_ROUTES.PACIENTES_EDITAR} element={<PacienteEditPage />} />
            </Route>

            <Route
              element={
                <RoleRoute allowedRoles={['ADMINISTRADOR', 'MEDICO_TERAPISTA']} />
              }
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
              <Route
                path={APP_ROUTES.HISTORIA_CLINICA_EDITAR}
                element={<HistoriaClinicaEditPage />}
              />
            </Route>

            <Route element={<RoleRoute allowedRoles={['ADMINISTRADOR', 'AGENDADOR']} />}>
              <Route
                path={APP_ROUTES.PROFESIONALES}
                element={<ProfesionalesListPage />}
              />
              <Route
                path={APP_ROUTES.PROFESIONALES_DETALLE}
                element={<ProfesionalDetailPage />}
              />
            </Route>

            <Route element={<RoleRoute allowedRoles={['ADMINISTRADOR']} />}>
              <Route
                path={APP_ROUTES.PROFESIONALES_NUEVO}
                element={<ProfesionalFormPage />}
              />
              <Route
                path={APP_ROUTES.PROFESIONALES_EDITAR}
                element={<ProfesionalEditPage />}
              />
              <Route path={APP_ROUTES.USUARIOS} element={<UsuariosListPage />} />
              <Route path={APP_ROUTES.USUARIOS_NUEVO} element={<UsuarioFormPage />} />
              <Route path={APP_ROUTES.USUARIOS_DETALLE} element={<UsuarioDetailPage />} />
              <Route path={APP_ROUTES.USUARIOS_EDITAR} element={<UsuarioEditPage />} />
              <Route
                path={APP_ROUTES.CONFIG_AGENDAMIENTO}
                element={<ConfigAgendamientoPage />}
              />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
