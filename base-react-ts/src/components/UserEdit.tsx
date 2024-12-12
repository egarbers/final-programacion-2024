import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, DatePicker } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

const EditForm = () => {
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); 
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:4000/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setUserData(response.data);
        form.setFieldsValue({
          ...response.data,
          role: response.data.role ? response.data.role._id : undefined,
          governmentIdNumber: response.data.governmentId ? response.data.governmentId.number : undefined,
          governmentIdType: response.data.governmentId ? response.data.governmentId.type : undefined,
          bornDate: response.data.bornDate ? dayjs(response.data.bornDate) : null, // Convertir a Dayjs
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
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:4000/roles', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRoles(response.data);
      } catch (error) {
        message.error('Error al obtener los roles');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [token]);

  const handleSubmit = async (values) => {
    try {
      const updatedValues = {
        ...values,
        bornDate: values.bornDate ? values.bornDate.format('YYYY-MM-DD') : null,
        governmentId: {
            type: values.governmentIdType,
            number: values.governmentIdNumber
        }
      };

      console.log("Valores para actualizar:", updatedValues);
      await axios.put(`http://localhost:4000/users/${id}`, updatedValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Registro actualizado correctamente');
      navigate('/users/list');
    } catch (error) {
      message.error('Error al actualizar el usuario');
    }
  };

  const governmentIdTypes = ['cuil', 'cuit', 'dni', 'lc', 'le', 'pas'];

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
          name="role"
          label="Rol"
          rules={[{ required: true, message: 'Por favor seleccione un rol' }]}
        >
          <Select>
            {roles.map((role) => (
              <Select.Option key={role._id} value={role._id}>
                {role.name}
              </Select.Option>
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
