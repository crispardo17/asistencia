import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getDiaStrName } from '@/utils/functions';
import { MESES_NUM } from '@/utils/vars';
import { subDays } from 'date-fns';

/**  Funcion para calcular el ancho de cada columna para hacer mas legible el excelll */
const calculateColumnWidths = (data, headers) => {
  const widths = headers.map((header) => ({ wch: header.length }));
  data.forEach((row) => {
    headers.forEach((header, index) => {
      const value = row[header];
      if (value && value.toString().length > widths[index].wch) {
        widths[index].wch = value.toString().length + 5;
      }
    });
  });
  return widths;
};
const separarStr = (...strings) => strings.join(' - ');

const formatKeys = (key, mes) => {
  const spl = key.split('_d');
  // eslint-disable-next-line no-unused-vars
  const [_, day] = spl;
  const fecha = `${new Date().getFullYear()}-${mes}-${Number(day) < 10 ? '0' + day : day}`;
  const dia_str = getDiaStrName(subDays(fecha, 1));
  return separarStr(key.replace('_d', ''), dia_str.toUpperCase());
};

const useDowloadReportePersonal = () => {
  const getHeaderOrders = (headersDetailDais, mes) => [
    'N DOCUMENTO',
    'NOMBRE',
    'CARGO',
    'CENTRO DE COSTO',
    'EMPRESA',
    'CIUDAD',
    'FECHA DE INGRESO',
    'SUPERVISOR',
    'MES',
    ...headersDetailDais
      .filter((elem) => !elem.key.startsWith('_'))
      .map((head) => head.key),
    ...headersDetailDais
      .filter((elem) => elem.key.startsWith('_'))
      .map((head) => formatKeys(head.key, MESES_NUM[mes])),
  ];

  const getFileDataFormat = (data, headerOrders) => {
    return data?.map((item) => {
      const transformedItem = {};
      Object.keys(item).forEach((key) => {
        let newKey = key;
        let value = item[key];
        if (typeof value === 'string' && value?.toUpperCase() === 'N/R')
          value = 'no reporte';
        if (key.startsWith('_d')) newKey = formatKeys(key, MESES_NUM[item.MES]);
        transformedItem[newKey] = value;
      });

      const orderedItem = {};
      headerOrders?.forEach((header) => {
        orderedItem[header] = transformedItem[header];
      });
      return orderedItem;
    });
  };

  const formatDetallesPersonalToFileExcellData = (personalData) => {
    const {
      nombre,
      apellido,
      numDocumento,
      fechaIngreso,
      supervisor,
      mes,
      cargo,
      ciudad,
      cc,
      empresa,
      detalles,
    } = personalData;

    return detalles.map((detalle) => ({
      ...detalle,
      'N DOCUMENTO': numDocumento,
      NOMBRE: `${nombre || ''} ${apellido || ''}`,
      CARGO: cargo,
      'CENTRO DE COSTO': cc,
      EMPRESA: empresa,
      CIUDAD: ciudad,
      'FECHA DE INGRESO': fechaIngreso,
      SUPERVISOR: supervisor,
      MES: mes,
    }));
  };

  /**
   * @param {Array} originalData data equivale a un array segun la data con la que se quiera formar el archivo excell
   * @param {string} nameFile el nombre del arvhivo a descargar
   * @param {string} hojaName el nombre de la hoja
   * @param {string[]} headers headers establece el orden en que se desee alterar las columnas del excell
   */
  const handleDowLoadReporte = (
    originalData,
    nameFile,
    hojaName = 'Records',
    headers = []
  ) => {
    try {
      const data = originalData.map((item) => {
        const transformedItem = {};
        for (const key in item)
          transformedItem[key] =
            typeof item[key] === 'string' ? item[key].toUpperCase() : item[key];

        return transformedItem;
      });

      const worksheet = XLSX.utils.json_to_sheet(data, {
        header: headers,
        origin: 1,
      });

      const columnWidths = calculateColumnWidths(data, headers);
      worksheet['!cols'] = columnWidths;
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, hojaName);

      const blob = new Blob(
        [XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })],
        {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
      );
      saveAs(blob, `${nameFile}.xlsx`);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    handleDowLoadReporte,
    getHeaderOrders,
    getFileDataFormat,
    formatDetallesPersonalToFileExcellData,
  };
};

export default useDowloadReportePersonal;
