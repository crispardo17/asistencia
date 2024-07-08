import { Grid } from '@mui/material';

import FiltroNovedades from './FiltroNovedades.jsx';
import TableActionComponent from '@/shared/Components/Tables/CustomTable/index.jsx';
import CustomModal from '@/shared/Components/Modal/CustomModal/index.jsx';
import useLista from './useLista.jsx';
import ReversarForm from '@/shared/Components/Forms/ReversarForm/ReversarForm.jsx';
import TitleText from '@/shared/Components/Others/TitleText.jsx';
import { TIPOS_GESTION_NOVEDAD } from '@/utils/vars/index.jsx';

const Lista = () => {
  const {
    colors,
    table,
    modalShow,
    dataModals,
    listaSupervisores,
    listaMotivos,
    handleReversarModal,
    setCurrentValuesFilter,
    currentValuesFilter,
    areasList,
    handleFilterSubmit,
    handleSupervisorByArea,
  } = useLista();

  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Novedades" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <TableActionComponent {...table}>
          <FiltroNovedades
            areasList={areasList}
            colors={colors}
            onSubmit={async (values) => {
              await handleFilterSubmit(values);
              setCurrentValuesFilter(values);
            }}
            supervisoresList={listaSupervisores}
            handleSupervisorByArea={handleSupervisorByArea}
          />
        </TableActionComponent>
      </Grid>
      <CustomModal
        open={modalShow === 'cerrar'}
        title={'Cierre Novedad'}
        titleColor={colors?.HxPrimary}
        onClose={() => handleReversarModal(null)}
        minHeight="none"
        height="40vh"
      >
        <ReversarForm
          idReporteNovedad={dataModals.cerrar}
          tipo={TIPOS_GESTION_NOVEDAD.CIERRE}
          motivosList={listaMotivos}
          afterSubmit={async () => {
            await handleFilterSubmit(currentValuesFilter);
            handleReversarModal(null);
          }}
          colors={colors}
        />
      </CustomModal>
    </Grid>
  );
};

export default Lista;
