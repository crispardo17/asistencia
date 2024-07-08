import { TIPOS_NOVEDAD } from '@/utils/vars/index.jsx';
import { throwErrors } from '@/utils/functions';
import SHARED_API from '../api';
import ADMINISTRACION_API from '@/core/api/administrador_api';
import { axiosService, request, requestFiles } from '../axios';

export const getUsuario = async (idUsuario) => {
  try {
    const { data } = await request({
      url: SHARED_API.GET_USUARIO(idUsuario),
    });
    return data.records || data.record;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};
/** {fechaFin:"2024/12/24", fechaInicio:"} */
export const getNovedadList = async (tipo, querys) => {
  try {
    let url;
    switch (tipo) {
      case TIPOS_NOVEDAD.AVAL:
        url = querys
          ? `${SHARED_API.GET_NOVEDAD_LIST(tipo)}?fechaFin=${querys.fechaFin}&fechaInicio=${querys.fechaInicio}`
          : SHARED_API.GET_NOVEDAD_LIST(tipo);
        break;
      case TIPOS_NOVEDAD.HISTORICO:
        url = querys
          ? `${SHARED_API.GET_NOVEDAD_LIST(tipo)}?numDocumento=${querys.numDocumento}`
          : SHARED_API.GET_NOVEDAD_LIST(tipo);
        break;
      case TIPOS_NOVEDAD.LISTA:
        url = querys
          ? `${SHARED_API.GET_NOVEDAD_LIST(tipo)}?fechaReporte=${querys.fechaReporte}&idUsuario=${querys.idUsuario}&idArea=${querys.idArea}`
          : SHARED_API.GET_NOVEDAD_LIST(tipo);
        break;
      case TIPOS_NOVEDAD.CREAR:
        url = querys
          ? `${SHARED_API.GET_NOVEDAD_LIST(tipo)}?numDocumento=${querys.numDocumento}`
          : SHARED_API.GET_NOVEDAD_LIST(tipo);
        break;
      case TIPOS_NOVEDAD.REINTEGRAR:
        url = querys
          ? `${SHARED_API.GET_NOVEDAD_LIST(tipo)}?numDocumento=${querys.numDocumento}`
          : SHARED_API.GET_NOVEDAD_LIST(tipo);
        break;
      case TIPOS_NOVEDAD.PENDIENTES:
        url = SHARED_API.GET_NOVEDAD_LIST(tipo);
        break;
      case TIPOS_NOVEDAD.APROBACION:
        url = ADMINISTRACION_API.GET_LIST_NOVEDAD(
          `${TIPOS_NOVEDAD.APROBACION}?fechaInicio=${querys.fechaInicio}&fechaFin=${querys.fechaFin}`
        );
        break;
      default:
        url = SHARED_API.GET_NOVEDAD_LIST();
    }

    const { data } = await request({ url });
    return data.records || data.record;
  } catch (error) {
    throw {
      message: error.response.data.errors.message,
      status: error.response.status,
    };
  }
};

export const getTiposNovedades = async () => {
  try {
    const { data } = await request({
      url: SHARED_API.GET_TIPOSNOVEDADES,
    });
    return data;
  } catch (error) {
    throwErrors(error);
  }
};

export const postCrearNovedad = async (dataSend) => {
  try {
    const { data } = await request(
      { url: SHARED_API.POST_NOVEDAD_CREATE, data: { ...dataSend } },
      'post'
    );
    return data;
  } catch (error) {
    throwErrors(error);
  }
};
export const putNovedad = async (idReporteNovedad, dataSend) => {
  try {
    const { data } = await request(
      { url: SHARED_API.PUT_NOVEDAD(idReporteNovedad), data: { ...dataSend } },
      'put'
    );
    return data;
  } catch (error) {
    throwErrors(error);
  }
};

export const postUploadAdjuntoNovedad = async ({
  files,
  idReporteNovedad,
  notif,
}) => {
  try {
    return await Promise.all(
      files.map(async (file) => {
        try {
          const formData = new FormData();
          formData.append('id_reporteNovedad', idReporteNovedad);
          formData.append('adjunto_novedad', file);
          await requestFiles({
            url: SHARED_API.POST_NOVEDAD_ARCHIVO,
            data: formData,
          });
          notif(`${file.name} cargado con exito`);
          return true;
        } catch (error) {
          notif(error?.response?.data?.errors?.message, 'error');
          return false;
        }
      })
    );
  } catch (error) {
    notif(error.response.data.errors.message, 'error');
  }
};

export const getAdjuntoNovedad = async (idAdjuntoNovedad) => {
  try {
    const { data } = await axiosService.get(
      SHARED_API.GET_NOVEDAD_ADJUNTO(idAdjuntoNovedad),
      { responseType: 'blob' }
    );
    return data;
  } catch (error) {
    throwErrors(error);
  }
};
export const getSupervisoresList = async (idArea) => {
  try {
    const { data } = await request({
      url: SHARED_API.GET_SUPERVISORLIST(idArea),
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const getAsistenciaControl = async (params) => {
  try {
    const { data } = await request({
      url: SHARED_API.GET_CONTROL_ASISTENCIA(params),
    });
    return data;
  } catch (error) {
    throwErrors(error);
  }
};

export const getDocumentList = async () => {
  try {
    const { data } = await request({
      url: SHARED_API.GET_TIPOSDOCUMENTOS,
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const getPersonalReporteAsistencia = async (params) => {
  try {
    const { data } = await request({
      url: ADMINISTRACION_API.GET_PERSONALASISTENCIA_REPORTE(params),
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const getNotificationsByLayoutType = async (layoutPage) => {
  try {
    const { data } = await request({
      url: SHARED_API.GET_NOTIFICACIONES(layoutPage),
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const leerNotificacion = async (idNotificacon) => {
  try {
    const { data } = await request(
      {
        url: SHARED_API.PATCH_LEER_NOTIFICACION(idNotificacon),
      },
      'patch'
    );
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};
