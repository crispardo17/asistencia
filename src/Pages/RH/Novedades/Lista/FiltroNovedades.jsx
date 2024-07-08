import { Form, Formik } from 'formik';
import { Grid } from '@mui/material';
import * as Yup from 'Yup';
import CustomButton from '@/shared/Components/Inputs/CustomButton';
import CustomDateField from '@/shared/Components/Inputs/CustomDatePicker/index.jsx';
import CustomSelect from '@/shared/Components/Inputs/CustomSelect/index.jsx';

const FiltroNovedades = ({
  onSubmit,
  colors = {},
  areasList,
  supervisoresList,
  handleSupervisorByArea,
}) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{ fechaReporte: '', idUsuario: '', idArea: '' }}
      validationSchema={Yup.object().shape({})}
      onSubmit={async (values) => {
        await onSubmit(values);
      }}
    >
      {({ values, isSubmitting, handleChange, errors, setFieldValue }) => {
        return (
          <Form>
            <Grid
              container
              spacing={2}
              sx={{ marginTop: 2, margin: '0 auto', marginBottom: 1 }}
            >
              <Grid item xs={12} md={3}>
                <CustomDateField
                  label={'Mes y Año'}
                  value={values.fechaReporte}
                  error={!!errors.fechaReporte}
                  format="YYYY-MM"
                  name={'fechaReporte'}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomSelect
                  labelId="Área"
                  label="Área"
                  id="idArea"
                  name="idArea"
                  value={values.idArea}
                  onChange={async (e) => {
                    let value = e.target.value;
                    setFieldValue('idArea', value);
                    await handleSupervisorByArea(value);
                  }}
                  options={areasList?.map(({ idArea, nombre }) => ({
                    value: idArea,
                    label: nombre,
                  }))}
                  error={!!errors.idArea}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomSelect
                  labelId="Supervisor"
                  label="Supervisor"
                  id="idUsuario"
                  name="idUsuario"
                  value={values.idUsuario}
                  onChange={handleChange}
                  options={supervisoresList?.map(({ idUsuario, nombre }) => ({
                    value: idUsuario,
                    label: nombre,
                  }))}
                  error={!!errors.idArea}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={2}
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                <CustomButton
                  submitting={isSubmitting}
                  disabled={false}
                  type={'submit'}
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    height: 56,
                    margin: '0 auto',
                    background: colors?.HxPrimary,
                  }}
                >
                  Buscar
                </CustomButton>
              </Grid>
              <Grid item xs={12} md={3}></Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FiltroNovedades;
