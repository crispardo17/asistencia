const ADMINISTRACION_API = {
  GET_USUARIOS_LIST: 'usuario/list',
  GET_ASIGNACION_RESP: 'area/list-asignacion',
  GET_DESPARTAMENTOS_LIST: 'departamento/list',
  POST_USUARIO_CREATE: `usuario/create`,
  POST_CHECK_CREATE: 'checkNomina/create',
  GET_ASIGNACION_RESP_ID: (despartamento) =>
    `area/list-asignacion?id_departamento=${despartamento}`,
  GET_LIST_NOVEDAD: (query) => `novedad/list/${query}`,
  GET_LIST_DEPARTAMENTOS_SUPERVISOR: (id_departamento) =>
    `personal/list-personal/${id_departamento}`,
  GET_PERSONAL_BY_DOCUMENTO: (documento) =>
    `personal/list/user-create?numDocumento=${documento}`,
  GET_PERSONALASISTENCIA_REPORTE: (params) => {
    const { areasId, personalIds, fechaInicio, fechaFin } = params;
    return `asistencia/list/reporte?areasId=${areasId}&personalIds=${personalIds}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
  },
  POST_ASIGNAR_RESPONSABLE: (idPersonal) =>
    `liderProceso/asignar-responable/${idPersonal}`,
  PUT_USUARIO_ADMINISTRACION: (idUsuario) => `usuario/update/${idUsuario}`,
  PUT_GESTIONAR_NOVEDAD_APROBACION: (idReporte) =>
    `novedad/gestionar-novedad/aprobacion?idReporteNovedad=${idReporte}`,
  PATCH_CAMBIOCONTRASENNA_USER: (idUsuario) =>
    `usuario/resend-password/${idUsuario}`,
};

export default ADMINISTRACION_API;
