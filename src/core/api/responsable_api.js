const RESPONSABLE_API = {
  GET_PERSONAL_ASISTENCIA: 'asistencia/list/personal',
  GET_NOVEDAD_LIST: 'novedad/list',
  GET_ASISTENCIA: (idAsistencia) => `asistencia/show/${idAsistencia}`,
  POST_ASISTENCIA_CREAR: 'asistencia/create',
  GET_EMPRESAS_LIST_BYUSUARIO: (idUsuario) => `lider-proceso/list/${idUsuario}`,
};

export default RESPONSABLE_API;
