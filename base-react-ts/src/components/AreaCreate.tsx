import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // Obtener el ID desde la URL
    const navigate = useNavigate(); // Usamos useNavigate para redirigir

    // Simulando obtener el token Bearer
    const token = localStorage.getItem('token');


    const handleSubmit = async (values) => {
        console.log("Datos enviados:", values);

        const postValues = {
            ...values
        };

        try {

            await axios.post(
                `http://localhost:4000/areas`,
                postValues,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            message.success('Area creada correctamente');
            navigate('/areas/list'); // Redirigir a la lista de usuarios
        } catch (error) {
            message.error('Error al agregar el area');
        }
    };

    if (loading) return <div>Cargando...</div>; // Mostrar un cargador mientras se obtienen los datos

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Form
                form={form}
                name="editForm"
                onFinish={handleSubmit}
                initialValues={{}} // Se llena después con los datos del registro
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="Nombre"
                    rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Guardar cambios
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditForm;
