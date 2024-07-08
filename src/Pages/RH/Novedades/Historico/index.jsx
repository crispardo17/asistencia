import { Grid } from '@mui/material';
import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';

import FiltroHistorico from './FiltroHistorico.jsx';
import DetalleForm from '@/shared/Components/Forms/DetalleForm/DetalleForm.jsx';
import useHistorico from './useHistorico.jsx';
import TitleText from '@/shared/Components/Others/TitleText.jsx';
import { TIPOS_GESTION_NOVEDAD } from '@/utils/vars/index.jsx';
import ReversarForm from '@/shared/Components/Forms/ReversarForm/ReversarForm.jsx';

const Historico = () => {
  const {
    colors,
    table,
    modalShow,
    dataModals,
    listaMotivos,
    currentDocFilter,
    dataReversarForm,
    modalReversar,
    handleFilterSubmit,
    handleDetalleNovedadModal,
    handleReversarModal,
  } = useHistorico();

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Historico" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <TableActionComponent {...table}>
          <FiltroHistorico
            colors={colors}
            onSubmit={async (values) => {
              await handleFilterSubmit(values);
            }}
          />
        </TableActionComponent>
      </Grid>
      <CustomModal
        open={modalShow === 'detalleNovedad'}
        title={'Detalle Novedad'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleDetalleNovedadModal(null)}
        minHeight="none"
        height="45vh"
      >
        <DetalleForm
          data={dataModals.detalleNovedad}
          handleOpenReversar={handleReversarModal}
        />
      </CustomModal>
      <CustomModal
        titleColor={colors.HxPrimary}
        open={modalReversar}
        title={'Reversar Novedad'}
        onClose={() => handleReversarModal(null)}
        minHeight="none"
        height="40vh"
        minWidth="none"
        width="50vw"
      >
        <ReversarForm
          idReporteNovedad={dataReversarForm}
          tipo={TIPOS_GESTION_NOVEDAD.REVERSAR}
          motivosList={listaMotivos}
          afterSubmit={async () => {
            await handleFilterSubmit(currentDocFilter);
            handleReversarModal(null);
            handleDetalleNovedadModal(null);
          }}
        />
      </CustomModal>
    </Grid>
  );
};

export default Historico;
