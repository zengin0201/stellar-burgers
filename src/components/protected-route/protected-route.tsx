import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = ({ onlyUnAuth = false, component }: TProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthChecked, user } = useAppSelector((state) => state.user);

  if (!isAuthChecked) {
    return <Preloader />; 
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return component;
};

export const OnlyAuth = ProtectedRoute;
export const OnlyUnAuth = ({ component }: { component: React.JSX.Element }) => (
  <ProtectedRoute onlyUnAuth={true} component={component} />
);