import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (!token) {
        toast.error('Please login to access this page');
        return <Navigate to="/log-in" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute; 