export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRO_PACIENTE: '/registro-paciente',
  RECUPERAR_CONTRASENA: '/recuperar-contrasena',
  CAMBIAR_CONTRASENA: '/cambiar-contrasena',

  CITAS: '/citas',
  CITAS_NUEVA: '/citas/nueva',
  CITAS_AGENDAR_CONTACTO: '/citas/agendar-contacto',
  CITAS_DETALLE: '/citas/:id',
  CITAS_REAGENDAR: '/citas/:id/reagendar',

  PACIENTE_COMPLETAR_PERFIL: '/paciente/mi-ficha',
  PACIENTE_AGENDAR: '/paciente/agendar-cita',
  PACIENTE_MIS_CITAS: '/paciente/mis-citas',

  CONFIG_AGENDAMIENTO: '/configuracion/agendamiento',

  HISTORIA_CLINICA: '/historia-clinica',
  HISTORIA_CLINICA_NUEVA: '/historia-clinica/nueva',
  HISTORIA_CLINICA_DETALLE: '/historia-clinica/:id',

  PROFESIONALES: '/profesionales',
  PROFESIONALES_NUEVO: '/profesionales/nuevo',
  PROFESIONALES_DETALLE: '/profesionales/:id',
  PROFESIONALES_EDITAR: '/profesionales/:id/editar',

  USUARIOS: '/usuarios',
  USUARIOS_NUEVO: '/usuarios/nuevo',
  USUARIOS_DETALLE: '/usuarios/:id',

  PACIENTES: '/pacientes',
  PACIENTES_NUEVO: '/pacientes/nuevo',
  PACIENTES_DETALLE: '/pacientes/:id',

  PACIENTES_EDITAR: '/pacientes/:id/editar',
  USUARIOS_EDITAR: '/usuarios/:id/editar',
  HISTORIA_CLINICA_EDITAR: '/historia-clinica/:id/editar',

  NOT_FOUND: '*',
} as const;