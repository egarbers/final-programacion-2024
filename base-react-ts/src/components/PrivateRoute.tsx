import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // Obtener el token desde localStorage        
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            // Aca podria chequear que sea valido? de todas formas si back responde ok con token estaria bien. Pero capaz puede modificarse el localStorage
            // if (isValidToken(token)) {
                setIsAuthenticated(true);
            // } else {
            //     navigate('/login');
            // }
        }
    }, [navigate]);

    return <>{children}</>;
};

export default PrivateRoute;
