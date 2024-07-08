import RESPONSABLE_API from '@/core/api/responsable_api';
import { request } from '@/core/axios';
import { throwErrors } from '@/utils/functions';

export const getPersonalAsistencias = async () => {
  try {
    const { data } = await request({
      url: RESPONSABLE_API.GET_PERSONAL_ASISTENCIA,
    });
    return data;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const getNovedadList = async () => {
  try {
    const { data } = await request({ url: RESPONSABLE_API.GET_NOVEDAD_LIST });
    return data?.record || data?.records;
  } catch (error) {
    throw {
      message: error['response']['data']['errors']['message'],
      status: error['response']['status'],
    };
  }
};

export const postAsistenciaCreate = async (dataSend) => {
  try {
    const { data } = await request(
      {
        url: RESPONSABLE_API.POST_ASISTENCIA_CREAR,
        data: { ...dataSend },
      },
      'post'
    );
    return data;
  } catch (error) {
    throwErrors(error);
  }
};

