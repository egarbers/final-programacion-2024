import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [area, setArea] = useState(null); // Estado para almacenar el área obtenida
    const { id } = useParams(); // Obtener el ID del área desde la URL
    const navigate = useNavigate(); // Usamos useNavigate para redirigir

    // Simulando obtener el token Bearer
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchArea = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:4000/areas/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setArea(response.data); // Almacenar el área obtenida
            } catch (error) {
                message.error('Error al obtener el área');
            } finally {
                setLoading(false);
            }
        };

        fetchArea();
    }, [id, token]);

    const handleSubmit = async (values) => {
        console.log("Datos enviados:", values);

        const postValues = {
            ...values,
            areaId: id, // Asociar el departamento al área actual
        };

        try {
            await axios.post(
                `http://localhost:4000/departments`,
                postValues,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            message.success('Departamento creado correctamente');
            navigate(`/areas/${id}/departments`); // Redirigir a la lista de departamentos del área
        } catch (error) {
            message.error('Error al agregar el departamento');
        }
    };

    if (loading) return <div>Cargando...</div>; // Mostrar un cargador mientras se obtienen los datos

    if (!area) return <div>No se pudo cargar el área.</div>; // Manejar el caso en que el área no se cargue

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Crear Departamento para el Área: {area.name}</h2>
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
                    rules={[{ required: true, message: 'Por favor ingrese el nombre del departamento' }]}
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