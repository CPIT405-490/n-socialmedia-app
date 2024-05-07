import { Navigate } from 'react-router-dom';
import { auth } from './firebase';

const ProtectedRoute = ({Component}) => {
  const user = auth.currentUser;

  return user ? <Component /> : <Navigate to="/" />
};

export default ProtectedRoute;