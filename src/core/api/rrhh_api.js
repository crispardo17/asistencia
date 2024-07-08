const RRHH_API = {
  POST_REINTEGRO_CREATE: 'reintegro/create',
  GET_MOTIVOSLIST: 'motivo/list',
  GET_AREALIST: 'area/list',
  GET_SUPERVISORLIST: (idArea) =>
    idArea
      ? `usuario/list-responsables?idArea=${idArea}`
      : 'usuario/list-responsables',
  GET_CHECKNOMINA: (fechaInicioNovedad, fechaFinNovedad) =>
    `novedad/list/checkNomina?fechaInicioNovedad=${fechaInicioNovedad}&fechaFinNovedad=${fechaFinNovedad}`,
};

export default RRHH_API;
