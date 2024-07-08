const SHARED_API = {
  GET_USUARIO: (idUsuario) => `usuario/show/${idUsuario}`,
  GET_NOVEDAD_LIST: (tipo) => `novedad/list${tipo ? '/' + tipo : ''}`,
  GET_SUPERVISORLIST: (idArea) =>
    idArea
      ? `usuario/list-responsables?idArea=${idArea}`
      : 'usuario/list-responsables',
  GET_CONTROL_ASISTENCIA: (params) =>
    params
      ? `asistencia/list/control?areasId=${params.areasId}&mesAnno=${params.mesAnno}`
      : 'asistencia/list/control',
  PUT_NOVEDAD: (idNovedad) => `novedad/update/${idNovedad}`,
  GET_NOVEDAD_ADJUNTO: (idAjuntoNovedad) =>
    `adjunto-novedad/show/${idAjuntoNovedad}`,
  GET_NOTIFICACIONES: (layoutPage) =>
    `reporte-notificacion/list${layoutPage ? '/' + layoutPage : ''}`,
  PATCH_LEER_NOTIFICACION: (idNotificacion) =>
    `reporte-notificacion/leer/${idNotificacion}`,
  GET_TIPOSNOVEDADES: 'tipoNovedad/list',
  GET_TIPOSDOCUMENTOS: 'tipoDocumento/list',
  POST_NOVEDAD_CREATE: 'novedad/create',
  POST_NOVEDAD_ARCHIVO: 'adjunto-novedad/create',
};

export default SHARED_API;
