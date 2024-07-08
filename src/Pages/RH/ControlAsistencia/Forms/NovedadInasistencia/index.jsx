import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import useNovedadInasistencia from './useNovedadInasistencia';
import { Box } from '@mui/material';

const NovedadInasistencia = ({
  data,
  handleCrearNovedadModal,
  handleSubmitCrearAsistencia,
  colors,
}) => {
  const { table } = useNovedadInasistencia({
    data,
    handleCrearNovedadModal,
    handleSubmitCrearAsistencia,
    colors,
  });
  return (
    <Box>
      <TableActionComponent {...table} />
    </Box>
  );
};

export default NovedadInasistencia;
