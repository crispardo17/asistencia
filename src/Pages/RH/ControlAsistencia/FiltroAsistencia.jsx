import { Form, Formik } from 'formik';
import { Grid } from '@mui/material';
import CustomSelect from '@/shared/Components/Inputs/CustomSelect';
import * as Yup from 'Yup';
import CustomButton from '@/shared/Components/Inputs/CustomButton';
import CustomDateField from '@/shared/Components/Inputs/CustomDatePicker';

const FiltroAsistencia = ({ onSubmit, supervisoresList, colors = {} }) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{
        supervisorId: '-1',
        mesAnno: '',
      }}
      validationSchema={Yup.object().shape({
        supervisorId: Yup.string().optional().notRequired(),
        mesAnno: Yup.string().optional().notRequired(),
      })}
      onSubmit={async (values) => {
        const data = {
          areasId:
            values.supervisorId !== '-1'
              ? supervisoresList[values.supervisorId].areasArr
              : undefined,
          mesAnno: values.mesAnno !== '' ? values.mesAnno : undefined,
        };
        await onSubmit(data);
      }}
    >
      {({ values, isSubmitting, handleChange }) => {
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
                  labelSelectDefault="Todos"
                  onChange={handleChange}
                  name="supervisorId"
                  value={values.supervisorId}
                  error={false}
                  options={supervisoresList}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <CustomDateField
                  label={'Mes y Año'}
                  value={values.mesAnno}
                  name={'mesAnno'}
                  format="YYYY-MM-DD"
                />
              </Grid>
              <Grid item xs={12} md={3}>
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
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FiltroAsistencia;
