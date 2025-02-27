import {
  getSupervisoresList,
  getTiposNovedades,
  getUsuario,
} from '@/core/services';
import { getInfoTokenUserLogged } from '@/utils/functions';
import {
  Outlet,
  useLoaderData,
  Navigate,
  json,
  redirect,
} from 'react-router-dom';

export const loader = async ({ request }) => {
  const { url } = request;
  const tkninfo = await getInfoTokenUserLogged();

  const autorized = url.includes(tkninfo?.lay);

  if (!tkninfo || !autorized) return redirect('/');

  const { _sub, lay: layoutPage } = tkninfo;

  const usuario = await getUsuario(_sub);
  if (!usuario) return null;

  const [{ records: tipoNovedadesList }, { records: supervisoresList }] =
    await Promise.all([getTiposNovedades(), getSupervisoresList()]);

  return json({
    usuario,
    tipoNovedadesList,
    supervisoresList,
    layoutPage,
    tokenInfoLogged: tkninfo,
  });
};

/* Obtiene los datos de el usuario y revisa si el prefil puede acceder a las rutas adecuadas */
function UserVerifications() {
  const { usuario } = useLoaderData();
  if (!usuario) {
    return <Navigate to={'/'} />;
  }

  return <Outlet />;
}
export default UserVerifications;
