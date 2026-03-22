export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',

  CITAS: '/citas',
  CITAS_NUEVA: '/citas/nueva',
  CITAS_DETALLE: '/citas/:id',
  CITAS_REAGENDAR: '/citas/:id/reagendar',

  HISTORIA_CLINICA: '/historia-clinica',
  HISTORIA_CLINICA_NUEVA: '/historia-clinica/nueva',
  HISTORIA_CLINICA_DETALLE: '/historia-clinica/:id',

  PROFESIONALES: '/profesionales',
  PROFESIONALES_NUEVO: '/profesionales/nuevo',
  PROFESIONALES_DETALLE: '/profesionales/:id',

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