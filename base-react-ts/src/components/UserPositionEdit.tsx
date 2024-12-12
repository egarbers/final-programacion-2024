import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const UserPositionForm = () => {
const [form] = Form.useForm();
const [userData, setUserData] = useState(null);
const [Areas, setAreas] = useState([]);
const [loading, setLoading] = useState(false);
const [positions, setPositions] = useState([]);
const { id } = useParams(); 
const navigate = useNavigate();
const token = localStorage.getItem('token');

useEffect(() => {
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = response.data;

            setUserData(user);

            // Si el usuario ya tiene una posición configurada, obtener las posiciones del departamento
            if (user.position) {
                const positionResponse = await axios.get(`http://localhost:4000/positions/${user.position.departmentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPositions(positionResponse.data);
            }

            // Configurar los valores iniciales del formulario
            form.setFieldsValue({
                ...user,
                departmentId: user.position ? user.position.departmentId : undefined,
                positionId: user.position ? user.position._id : undefined,
                governmentIdNumber: user.governmentId ? user.governmentId.number : undefined,
                governmentIdType: user.governmentId ? user.governmentId.type : undefined,
                bornDate: user.bornDate ? dayjs(user.bornDate) : null,
            });
        } catch (error) {
            message.error('Error al obtener los datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    fetchUserData();
}, [id, token, form]);

useEffect(() => {
    const fetchAreas = async () => {
    setLoading(true);
    try {
        const response = await axios.get('http://localhost:4000/areas', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setAreas(response.data);
    } catch (error) {
        message.error('Error al obtener las areas');
    } finally {
        setLoading(false);
    }
    };

    fetchAreas();
}, [token]);

const handleDepartmentChange = async (departmentId) => {
    form.setFieldsValue({ positionId: undefined }); // Limpiar posición seleccionada
    try {
        const response = await axios.get(`http://localhost:4000/positions/${departmentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setPositions(response.data);
    } catch (error) {
        console.error('Error al obtener las posiciones:', error);
    }
};

const handleSubmit = async (values) => {
    try {
        const updatedValues = {
            positionId: values.positionId, // Solo enviar positionId
        };

        await axios.put(`http://localhost:4000/users/${userData._id}/position`, updatedValues, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        message.success('Posición actualizada correctamente');
        navigate('/users/list');
    } catch (error) {
        message.error('Error al actualizar la posición del usuario');
    }
};

  if (loading) return <div>Cargando...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Form
            form={form}
            name="UserPositionForm"
            onFinish={handleSubmit}
            layout="vertical"
        >
            <Form.Item
            name="departmentId"
            label="Departamento"
            rules={[{ required: true, message: 'Por favor seleccione un departamento' }]}
            >
                <Select onChange={handleDepartmentChange}>
                    {Areas.map((area) => (
                        <Select.OptGroup key={area._id} label={area.name}>
                        {area.departments.map((department) => (
                            <Select.Option key={department._id} value={department._id}>
                            {department.name}
                            </Select.Option>
                        ))}
                        </Select.OptGroup>
                    ))}
                </Select>
            </Form.Item>

            {positions.length > 0 && (
                <Form.Item
                name="positionId"
                label="Posición"
                rules={[{ required: true, message: 'Por favor seleccione una posición' }]}
                >
                    <Select placeholder="Seleccione una posición">
                        {positions.map((position) => (
                        <Option key={position._id} value={position._id}>
                            {position.name}
                        </Option>
                        ))}
                    </Select>
                </Form.Item>
            )}
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Guardar cambios
                </Button>
            </Form.Item>
        </Form>
    </div>
  );
};

export default UserPositionForm;
