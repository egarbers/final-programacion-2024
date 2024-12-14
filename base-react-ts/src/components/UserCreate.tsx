import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditForm = () => {
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams(); // Obtener el ID desde la URL
    const navigate = useNavigate(); // Usamos useNavigate para redirigir

    // Simulando obtener el token Bearer
    const token = localStorage.getItem('token');

    // Fetch roles from the API
    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/roles', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setRoles(response.data);  // Assuming the roles are in response.data
            } catch (error) {
                message.error('Error al obtener los roles');
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, [token]);


    const handleSubmit = async (values) => {
        console.log("Datos enviados:", values);

        const postValues = {
            ...values,
            bornDate: values.bornDate ? values.bornDate.format('YYYY-MM-DD') : null,
            governmentId: {
                type: values.governmentIdType,
                number: values.governmentIdNumber
            }
        };

        try {

            await axios.post(
                `http://localhost:4000/users`,
                postValues,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            message.success('Usuario creado correctamente');
            navigate('/users/list'); // Redirigir a la lista de usuarios
        } catch (error) {
            message.error('Error al agregar al usuario');
        }
    };

    const governmentIdTypes = ['cuil', 'cuit', 'dni', 'lc', 'le', 'pas'];

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
                    name="firstName"
                    label="Nombre"
                    rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="lastName"
                    label="Apellido"
                    rules={[{ required: true, message: 'Por favor ingrese el apellido' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Correo electrónico"
                    rules={[
                        { required: true, message: 'Por favor ingrese un email válido' },
                        { type: 'email', message: 'El email no es válido' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Teléfono"
                    rules={[{ required: false, message: 'Por favor ingrese un número de teléfono' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="bornDate"
                    label="Fecha de nacimiento"
                    rules={[{ required: false, message: 'Por favor ingrese la fecha de nacimiento' }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    name="role" // Aquí estás usando "role._id"
                    label="Rol"
                    rules={[{ required: true, message: 'Por favor seleccione un rol' }]}
                >
                    <Select>
                        {roles.map((role) => (
                            <Option key={role._id} value={role._id}>
                                {role.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="governmentIdType"
                    label="Tipo de documento"
                    rules={[{ required: true, message: 'Por favor seleccione un tipo de documento' }]}
                >
                    <Select>
                        {governmentIdTypes.map((type) => (
                            <Select.Option key={type} value={type}>
                                {type}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="governmentIdNumber"
                    label="N° de documento"
                    rules={[{ required: true, message: 'Por favor ingrese el DNI' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Contraseña"
                    rules={[{ required: true, message: 'Por favor ingrese una contraseña' }]}
                >
                    <Input.Password />
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
