export const TIPO_ATENCION_OPTIONS = [
  'PRIMERA_VEZ',
  'CONTROL',
  'URGENCIA',
] as const;

export const TIPO_ATENCION_LABEL: Record<string, string> = {
  PRIMERA_VEZ: 'Cita general',
  CONTROL: 'Control (revisita)',
  URGENCIA: 'Urgencia',
};

export const GENERO_PACIENTE_OPTIONS = ['HOMBRE', 'MUJER', 'OTRO'] as const;

export const GENERO_LABEL: Record<string, string> = {
  HOMBRE: 'Hombre',
  MUJER: 'Mujer',
  OTRO: 'Prefiero no indicar',
};

export const ROL_USUARIO_OPTIONS = [
  'ADMINISTRADOR',
  'MEDICO_TERAPISTA',
  'AGENDADOR',
  'PACIENTE',
] as const;

export const TIPO_PROFESIONAL_OPTIONS = [
  'MEDICO',
  'TERAPISTA',
] as const;

export const ESPECIALIDAD_OPTIONS = [
  'TERAPIA_NEURAL',
  'QUIROPRAXIA',
  'FISIOTERAPIA',
] as const;

export const ESPECIALIDAD_LABEL: Record<string, string> = {
  TERAPIA_NEURAL: 'Terapia Neural',
  QUIROPRAXIA: 'Quiropraxia',
  FISIOTERAPIA: 'Fisioterapia',
};

export const ESTADO_PROFESIONAL_OPTIONS = [
  'ACTIVO',
  'INACTIVO',
] as const;

export const ESTADO_CITA_OPTIONS = [
  'PROGRAMADA',
  'ATENDIDA',
  'CANCELADA',
  'REAGENDADA',
  'NO_ASISTIO',
] as const;