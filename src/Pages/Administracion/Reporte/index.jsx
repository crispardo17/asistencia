import { Grid } from '@mui/material';

import useReportePage from './useReportePage.jsx';
import FiltroReporte from './FiltroReporte.jsx';
import TableDetails from '@/shared/Components/Tables/TableDetails/index.jsx';
import TitleText from '@/shared/Components/Others/TitleText.jsx';

const ReportePage = () => {
  const {
    tableDetails,
    supervisoresList,
    colors,
    tableData,
    handleSubmitFilterReporte,
  } = useReportePage();
  return (
    <Grid
      container
      spacing={2}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <TitleText text="Reporte" color={colors?.HxPrimary} />
      <Grid item xs={12}>
        <FiltroReporte
          {...{
            colors,
            supervisoresList,
            onSubmit: handleSubmitFilterReporte,
          }}
        />
        {!!tableData.length && <TableDetails {...tableDetails} />}
      </Grid>
    </Grid>
  );
};

export default ReportePage;
