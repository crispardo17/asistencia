import { Form, Formik } from 'formik';
import { Grid } from '@mui/material';
import * as Yup from 'Yup';
import CustomSelect from '@/shared/Components/Inputs/CustomSelect/index.jsx';
import CustomButton from '@/shared/Components/Inputs/CustomButton/index.jsx';
import { getCurrentDate } from '@/utils/functions';
import {
  format as formatDateFn,
  parseISO,
  endOfMonth,
  format,
  addDays,
} from 'date-fns';
import CustomDateField from '@/shared/Components/Inputs/CustomDatePicker/index.jsx';

const FiltroReporte = ({ onSubmit, supervisoresList, colors }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        supervisorId: '-1',
        fechaInicio: format(getCurrentDate().toISOString(), "yyyy-MM-dd'"),
        fechaFin: formatDateFn(
          endOfMonth(format(getCurrentDate().toISOString(), 'yyyy-MM-dd')),
          'yyyy-MM-dd'
        ),
      }}
      validationSchema={Yup.object().shape({})}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting, handleChange, setFieldValue }) => {
        const fechaInicio = parseISO(values.fechaInicio);
        const minFechaFin = formatDateFn(fechaInicio, 'yyyy-MM-dd');
        const maxFechaFin = formatDateFn(endOfMonth(fechaInicio), 'yyyy-MM-dd');
        return (
          <Form>
            <Grid
              container
              spacing={2}
              sx={{ marginTop: 2, margin: '0 auto', marginBottom: 1 }}
            >
              <Grid item xs={12} md={3}>
                <CustomSelect
                  label={'Supervisor'}
                  name="supervisorId"
                  value={values.supervisorId}
                  error={false}
                  options={supervisoresList}
                  onChange={handleChange}
                  autoWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomDateField
                  label={'Fecha Inicio'}
                  value={values.fechaInicio}
                  name={'fechaInicio'}
                  format="YYYY-MM-DD"
                  views={['year', 'month', 'day']}
                  onHandleChange={(fecha) => {
                    setFieldValue(
                      'fechaFin',
                      formatDateFn(endOfMonth(addDays(fecha, 1)), 'yyyy-MM-dd')
                    );
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomDateField
                  label={'Fecha Fin'}
                  value={values.fechaFin}
                  name={'fechaFin'}
                  format="YYYY-MM-DD"
                  views={['year', 'month', 'day']}
                  minDate={minFechaFin}
                  maxDate={maxFechaFin}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={3}
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                <CustomButton
                  color={colors?.primary}
                  submitting={isSubmitting}
                  disabled={false}
                  type={'submit'}
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ height: 56 }}
                >
                  Buscar
                </CustomButton>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FiltroReporte;
