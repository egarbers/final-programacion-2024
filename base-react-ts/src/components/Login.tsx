import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import logo from '../assets/logo.svg';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
        const response = await axios.post('http://localhost:4000/auth', {
            email: values.email,
            password: values.password,
        });

        message.success('Login exitoso');
        console.log('Respuesta del servidor:', response.data);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.replace('/organigram');       
    } catch (error) {
        message.error('Error al iniciar sesión');
        console.error('Error en el login:', error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
        <img src={logo} alt="Logo" style={{ width: 320, height: 'auto' }} />
        <h2>Login</h2>
        <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item
            name="email"
            label="Email"
            rules={[
                { required: true, message: 'Por favor ingrese su email' },
                { type: 'email', message: 'El email no es válido' },
            ]}
            >
            <Input type="email" />
            </Form.Item>

            <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Por favor ingrese su contraseña' }]}
            >
            <Input.Password />
            </Form.Item>

            <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
                Iniciar sesión
            </Button>
            </Form.Item>
        </Form>
    </div>
  );
};

export default Login;
