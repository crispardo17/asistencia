import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import { Box, Grid } from '@mui/material';
import FiltroAsistencia from './FiltroAsistencia';
import NovedadInasistencia from './Forms/NovedadInasistencia';
import useControlAsistencia from './useControlAsistencia';
import CustomModal from '@/shared/Components/Modal/CustomModal';
import NovedadPendiente from './Forms/NovedadPendiente';
import ChildModal from '@/shared/Components/Modal/ChildModal';
import NovedadForm from '@/shared/Components/Forms/NovedadForm/NovedadForm';
import { ROUTE_IDS } from '@/utils/vars';
import TitleText from '@/shared/Components/Others/TitleText';
import { useUserContext } from '@/shared/Contexts/UserContext/userContex';

const ControlAsistencia = () => {
  const {
    table,
    supervisoresList,
    modalShow,
    childModalShow,
    dataModals,
    inasistenciaData,
    novedadPendienteData,
    colors,
    layout,
    handleInasistenciaModal,
    handlePendienteModal,
    handleCrearNovedadModal,
    handleGetDataList,
    handleRefreshData,
    handleCheckCrearAsistencia,
  } = useControlAsistencia();
  const { handleListNotificacions } = useUserContext();
  return (
    <section>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TitleText text="Control asistencia" color={colors?.HxPrimary} />
          </Grid>
          <Grid item xs={12}>
            <FiltroAsistencia
              colors={colors}
              supervisoresList={supervisoresList}
              onSubmit={handleGetDataList}
            />
          </Grid>
          <Grid item xs={12}>
            <TableActionComponent {...table} />
          </Grid>
        </Grid>
      </Box>
      {/* Modales */}
      <CustomModal
        open={modalShow === 'inasistencia'}
        title={'Dias sin asistencia'}
        titleColor={colors?.HxPrimary}
        minWidth="80vw"
        minHeight="75vh"
        onClose={() => handleInasistenciaModal(null)}
      >
        <NovedadInasistencia
          data={inasistenciaData}
          handleCrearNovedadModal={handleCrearNovedadModal}
          handleSubmitCrearAsistencia={handleCheckCrearAsistencia}
          colors={colors}
        />
      </CustomModal>
      <CustomModal
        open={modalShow === 'pendiente'}
        title={'Novedades Pendientes'}
        titleColor={colors?.HxPrimary}
        minWidth="80vw"
        minHeight="75vh"
        onClose={() => handlePendienteModal(null)}
      >
        <NovedadPendiente
          data={novedadPendienteData}
          handleCrearNovedadModal={handleCrearNovedadModal}
          colors={colors}
        />
      </CustomModal>
      {/* childs modals;  */}
      <ChildModal
        title={'Novedad'}
        minWidth="70vw"
        minHeight="80vh"
        titleColor={colors?.HxPrimary}
        open={['inasistencia', 'novedad'].includes(childModalShow)}
        handleClose={() => handleCrearNovedadModal(null)}
      >
        <NovedadForm
          {...{
            ...dataModals.nov,
            colors,
            onlyRead: childModalShow === 'novedad' && layout === ROUTE_IDS.RRHH,
            afterSubmit: async (novValues) => {
              await handleRefreshData(
                novValues?.id_personal,
                inasistenciaData ? 'inasistencia' : 'novedad'
              );
              handleCrearNovedadModal(null);
              handleListNotificacions(layout);
            },
          }}
        />
      </ChildModal>
    </section>
  );
};

export default ControlAsistencia;
