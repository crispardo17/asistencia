import { getAdjuntoNovedad } from '@/core/services';
import useMainApp from '@/shared/Hooks/useMainApp.jsx';
import { saveAs } from 'file-saver';

const useDetalleForm = () => {
  const { colors, handlePopUpToast } = useMainApp();

  const handleGetAdjunto = async (file) => {
    try {
      const { idAdjuntoNovedad, nombreFile, extension } = file;
      const respBlobFile = await getAdjuntoNovedad(idAdjuntoNovedad);
      saveAs(new Blob([respBlobFile]), `${nombreFile}${extension}`);
    } catch (error) {
      handlePopUpToast('Error al descargar el archivo', 'error');
    }
  };

  return {
    colors,
    handleGetAdjunto,
  };
};

export default useDetalleForm;
