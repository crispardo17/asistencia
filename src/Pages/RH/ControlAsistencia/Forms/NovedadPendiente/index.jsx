import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import { Box, Typography } from '@mui/material';
import useNovedadPendiente from './useNovedadPendiente';

const NovedadPendiente = ({ data, handleCrearNovedadModal, colors }) => {
  const { table } = useNovedadPendiente({
    data,
    handleCrearNovedadModal,
    colors,
  });
  return (
    <Box>
      <Typography align="center" variant="h6" sx={{ marginBottom: 2 }}>
      </Typography>
      <TableActionComponent {...table} />
    </Box>
  );
};

export default NovedadPendiente;
