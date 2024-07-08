import { Grid, Typography, Box, Tooltip } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';

import TableActionComponent from '@/shared/Components/Tables/CustomTable';
import useControlHabilitacion from './useControlHabilitacion';
import TitleText from '@/shared/Components/Others/TitleText';

const titleTootip =
  'Recuerde que para habilitar' +
  ' el cambio de contraseña esta' +
  ' será su número de documento' +
  ' más la primera letra de su' +
  ' nombre.';

const AprovacionContraseña = () => {
  const { table, colors } = useControlHabilitacion();
  return (
    <section>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">
              <TitleText
                text="Habilitación de cambio contraseña"
                color={colors?.HxPrimary}
              />
              <Tooltip title={titleTootip} size="lg">
                <InfoIcon
                  alignItems={'center'}
                  color="warning"
                  sx={{
                    marginLeft: '5px',
                    paddingTop: '2px',
                  }}
                ></InfoIcon>
              </Tooltip>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableActionComponent {...table} />
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

export default AprovacionContraseña;
