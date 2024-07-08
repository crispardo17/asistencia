import { Alert, CircularProgress, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import CustomTextField from '@/shared/Components/Inputs/CustomTextfield/index.jsx';
import CustomButton from '@/shared/Components/Inputs/CustomButton/index.jsx';
import useFormAsignacion from './useFormAsignacion.jsx';
import CustomSelect from '@/shared/Components/Inputs/CustomSelect/index.jsx';

const FormAsignacion = ({ data, afterSubmit }) => {
  const {
    handleSubmit,
    initialValuesAsignacionForm,
    validationSchema,
    personalsByDepto,
    supervisorActual,
    loadedData,
    colors,
  } = useFormAsignacion({ data });

  return (
    <>
      <Formik
        initialValues={initialValuesAsignacionForm}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          if (await handleSubmit(values, resetForm)) {
            await afterSubmit();
          }
        }}
      >
        {({ values, errors, handleChange, setFieldValue }) => {
          return (
            <Form>
              <Grid container spacing={2} sx={{ marginTop: '10px' }}>
                <Grid item xs={6}>
                  <Typography
                    variant="body1"
                    fontWeight={'bold'}
                    align="center"
                  >
                    Departamento
                  </Typography>
                  <Typography variant="body2" align="center">
                    {values.departamento}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body1"
                    fontWeight={'bold'}
                    align="center"
                  >
                    Centro de costo
                  </Typography>
                  <Typography variant="body2" align="center">
                    {values.centroCosto}
                  </Typography>
                </Grid>
                {supervisorActual && (
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      fontWeight={'bold'}
                      align="center"
                    >
                      Responsable actual
                    </Typography>
                    <Typography variant="body2" align="center">
                      {supervisorActual.nombre}{' '}
                      {supervisorActual.apellido || ''}
                    </Typography>
                  </Grid>
                )}
                {!loadedData && (
                  <Grid
                    item
                    xs={12}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <CircularProgress
                      size={30}
                      color={colors?.primary}
                      sx={{ alignSelf: 'center' }}
                    />
                  </Grid>
                )}
                {!!personalsByDepto.length && (
                  <>
                    <Grid item xs={12}>
                      <CustomSelect
                        label={
                          supervisorActual
                            ? 'Cambiar supervisor'
                            : 'Asignar supervisor'
                        }
                        labelSelectDefault="Selecione un personal"
                        name="idPersonal"
                        value={values.idPersonal}
                        error={!!errors.idPersonal}
                        options={personalsByDepto?.map((dep) => ({
                          value: dep?.idPersonal,
                          label: `${dep?.nombre ?? ''} ${dep?.apellido ?? ''}`,
                        }))}
                        onChange={(e) => {
                          const personalCorreo = personalsByDepto?.find(
                            (pers) => pers.idPersonal === e.target.value
                          )?.correo;
                          setFieldValue('correo', personalCorreo ?? '');
                          return handleChange(e);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextField
                        className="correoInput"
                        type="email"
                        label="Correo"
                        name="correo"
                        value={values.correo}
                        error={!!errors.correo}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}
                >
                  {personalsByDepto.length ? (
                    <CustomButton
                      fullWidth
                      variant="contained"
                      type="submit"
                      color="#088cd4"
                    >
                      {supervisorActual ? 'Actualizar' : 'Asignar'}
                    </CustomButton>
                  ) : loadedData && !personalsByDepto.length ? (
                    <Alert color={colors?.primary}>
                      {`No hay ${supervisorActual ? 'mas' : ''} registros de personal o usuarios del área para asignar.`}
                    </Alert>
                  ) : null}
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default FormAsignacion;
