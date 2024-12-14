import React, { useState, useEffect } from 'react';
import { Form, Input, message, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAreaData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/areas/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                form.setFieldsValue({
                    ...response.data
                });
            } catch (error) {
                message.error('Error al obtener los datos del area');
            } finally {
                setLoading(false);
            }
        };

        fetchAreaData();
    }, [id, token, form]);

    const handleSubmit = async (values) => {
        try {
            const updatedValues = {
                ...values
            };

            console.log("Valores para actualizar:", updatedValues);
            await axios.put(`http://localhost:4000/areas/${id}`, updatedValues, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Area actualizada correctamente');
            navigate('/areas/list');
        } catch (error) {
            message.error('Error al actualizar el area');
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Form
                form={form}
                name="editForm"
                onFinish={handleSubmit}
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
