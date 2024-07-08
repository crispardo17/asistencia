import RRHH_API from '@/core/api/rrhh_api.js';
import { request } from '@/core/axios';
import { throwErrors } from '@/utils/functions/index.js';

export const getAreasList = async () => {
  try {
    const { data } = await request({
      url: RRHH_API.GET_AREALIST,
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};
export const getMotivosList = async () => {
  try {
    const { data } = await request({
      url: RRHH_API.GET_MOTIVOSLIST,
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};
export const getSupervisoresList = async (idArea) => {
  try {
    const { data } = await request({
      url: RRHH_API.GET_SUPERVISORLIST(idArea),
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const getCheckNomina = async (fechaInicioNovedad, fechaFinNovedad) => {
  try {
    const { data } = await request({
      url: RRHH_API.GET_CHECKNOMINA(fechaInicioNovedad, fechaFinNovedad),
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const putGestionNovedad = async (tipo, dataSend) => {
  try {
    const { data } = await request(
      {
        url: `novedad/gestionar-novedad/${tipo}?idReporteNovedad=${dataSend.idReporteNovedad}`,
        data: { ...dataSend },
      },
      'put'
    );
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const postCrearReintegro = async (dataSend) => {
  try {
    const { data } = await request(
      { url: RRHH_API.POST_REINTEGRO_CREATE, data: { ...dataSend } },
      'post'
    );
    return data;
  } catch (error) {
    throwErrors(error);
  }
};
