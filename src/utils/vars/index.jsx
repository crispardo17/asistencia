export const MODULOS_ADMIN = {
  DASHBOARD: '/admin/dashboard',
  APROBACION: '/admin/aprobacion',
  ASIGNACION: '/admin/asignacion',
  REPORTES: '/admin/reportes',
  ASISTENCIA: '/admin/asistencia',
  CONFIGURACION_USUARIOS: '/admin/configuracion/usuarios',
  CONFIGURACION_HABILITACION: '/admin/configuracion/habilitacion',
};

export const MODULOS_RESPONSABLE = {
  DASHBOARD: '/responsable/dashboard',
  ASISTENCIA: '/responsable/asistencia',
  NOVEDADES_PENDIENTES: '/responsable/novedades',
};

export const MODULOS_RRHH = {
  DASHBOARD: '/rrhh/dashboard',
  CONTROL_ASISTENCIA: '/rrhh/control-asistencia',
  CHECK_NOMINA: '/rrhh/check-nomina',
  NOVEDADES_LISTA: '/rrhh/novedades/lista',
  NOVEDADES_AVAL: '/rrhh/novedades/aval-novedad',
  NOVEDADES_HISTORICO: '/rrhh/novedades/historico',
  NOVEDADES_CREAR: '/rrhh/novedades/crear',
  NOVEDADES_REINTEGRAR: '/rrhh/novedades/reintegrar',
};
export const LOCALSTORAGE_KEYS = {
  token: 'tkn',
  usuario: 'user',
};

export const ROUTE_IDS = {
  LOGIN: 'login',
  USER: 'userData',
  ADMIN: 'admin',
  ADMIN_USUARIOS: 'admin-usuarios',
  RRHH: 'rrhh',
  RESPONSABLE: 'responsable',
  RH_NOVEDADES: 'rh-novedades',
};

export const TIPOS_NOVEDAD = {
  AVAL: 'aval',
  HISTORICO: 'historico',
  REINTEGRAR: 'reIntegrar',
  CREAR: 'crear',
  LISTA: 'lista',
  PENDIENTES: 'pendientes',
  APROBACION: 'aprobacion',
};
export const TIPOS_GESTION_NOVEDAD = {
  CIERRE: 'cierre',
  REVERSAR: 'reversar',
  REINTEGRO: 'reintegro',
};

export const STR_CODE_PERFIL = {
  RESPONSABLE_PROCESO: 'RESPONSABLE_PROCESO',
  RRHH: 'RRHH',
  ADMIN: 'ADMIN',
};

export const MESES_STR = {
  ENERO: 'ENERO',
  FEBRERO: 'FEBRERO',
  MARZO: 'MARZO',
  ABRIL: 'ABRIL',
  MAYO: 'MAYO',
  JUNIO: 'JUNIO',
  JULIO: 'JULIO',
  AGOSTO: 'AGOSTO',
  SEPTIEMBRE: 'SEPTIEMBRE',
  OCTUBRE: 'OCTUBRE',
  NOVIEMBRE: 'NOVIEMBRE',
  DICIEMBRE: 'DICIEMBRE',
};
export const MESES_NUM = {
  ENERO: '01',
  FEBRERO: '02',
  MARZO: '03',
  ABRIL: '04',
  MAYO: '05',
  JUNIO: '06',
  JULIO: '07',
  AGOSTO: '08',
  SEPTIEMBRE: '09',
  OCTUBRE: '10',
  NOVIEMBRE: '11',
  DICIEMBRE: '12',
};

export const fifteenMinsMiliSec = 15 * 60 * 1000;
