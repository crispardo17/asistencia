import { Grid } from '@mui/material';
import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import FiltroReintegro from './FiltroReintegro.jsx';
import ReintegroForm from './Form/ReintegroForm.jsx';
import ReversarForm from '@/shared/Components/Forms/ReversarForm/ReversarForm.jsx';
import useReintegro from './useReintegro.jsx';
import TitleText from '@/shared/Components/Others/TitleText.jsx';
import { TIPOS_GESTION_NOVEDAD } from '@/utils/vars/index.jsx';

const Reintegro = () => {
  const {
    colors,
    table,
    modalShow,
    dataModals,
    listMotivos,
    setCurrentValuesFilter,
    currentValuesFilter,
    handleFilterSubmit,
    handleVerModal,
    handleReingresoModal,
  } = useReintegro();

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Reintegro" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <TableActionComponent {...table}>
          <FiltroReintegro
            colors={colors}
            onSubmit={async (values) => {
              await handleFilterSubmit(values);
              setCurrentValuesFilter(values);
            }}
          />
        </TableActionComponent>
      </Grid>
      <CustomModal
        open={modalShow === 'ver'}
        title={'Ver:'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleVerModal(null)}
        minHeight="none"
        minWidth="none"
        height="80vh"
        width="70vw"
      >
        <ReintegroForm data={dataModals.ver} />
      </CustomModal>
      <CustomModal
        open={modalShow === 'reingreso'}
        title={'Reingreso:'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleReingresoModal(null)}
        minHeight="none"
        height="40vh"
      >
        <ReversarForm
          idReporteNovedad={dataModals.reingreso?.idReporteNovedad}
          motivosList={listMotivos}
          tipo={TIPOS_GESTION_NOVEDAD.REINTEGRO}
          afterSubmit={async () => {
            await handleFilterSubmit(currentValuesFilter);
            handleReingresoModal(null);
          }}
          idPersonal={dataModals.reingreso?.idPersonal}
        />
      </CustomModal>
    </Grid>
  );
};

export default Reintegro;
