import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate('/organigram');
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <Result
                status="404"
                title="404"
                subTitle="La página que intentas ingresar no existe."
                extra={<Button type="primary" onClick={handleBackToHome}>Volver al inicio</Button>}
            />
        </div>
    );
};

export default NotFoundPage;
