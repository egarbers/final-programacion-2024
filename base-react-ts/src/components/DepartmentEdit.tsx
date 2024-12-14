import React, { useState, useEffect } from 'react';
import { Form, Input, message, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [departmentData, setDepartmentData] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDepartmentData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/departments/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setDepartmentData(response.data)

                form.setFieldsValue({
                    ...response.data
                });
            } catch (error) {
                message.error('Error al obtener los datos del departamento');
            } finally {
                setLoading(false);
            }
        };

        fetchDepartmentData();
    }, [id, token, form]);

    const handleSubmit = async (values) => {
        try {
            console.log(departmentData);
            const updatedValues = {
                ...values
            };

            console.log("Valores para actualizar:", updatedValues);
            await axios.put(`http://localhost:4000/departments/${id}`, updatedValues, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            message.success('Departamento actualizado correctamente');
            navigate(`/areas/${departmentData.areaId}/departments`);
        } catch (error) {
            message.error('Error al actualizar el departamento');
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
