import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, message, Dropdown, Menu, Button, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem('token');
  const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      message.error('Error al cargar los usuarios');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(`http://localhost:4000/users/${selectedUser._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      message.success('Usuario eliminado correctamente');
      setIsModalVisible(false);
      setSelectedUser(null);
      fetchUsers(); // Refrescar la lista
    } catch (error) {
      message.error('Error al eliminar el usuario');
      setIsModalVisible(false);
      setSelectedUser(null);
    }
  };

  const showDeleteModal = (record) => {
    setSelectedUser(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Nombre',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Apellido',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Correo electrónico',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || 'No disponible',
    },
    {
        title: 'Posición',
        dataIndex: 'position',
        key: 'position',
        render: (position) => position?.name || 'No asignado',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role?.name || 'No asignado',
    },
    {
        title: '',
        key: 'actions',
        render: (record) => {
          if (record._id === currentUser._id) {
            return null; // No mostrar acciones para el usuario logueado
          }
  
          const menuItems = [
            {
              key: 'view',
              label: <Link to={`/users/view/${record._id}`}>Ver detalle</Link>,
            },
            {
              key: 'edit',
              label: <Link to={`/users/edit/${record._id}`}>Editar datos</Link>,
            },
            {
                key: 'editPosition',
                label: <Link to={`/users/position/edit/${record._id}`}>Modificar posición</Link>,
            },
            {
              key: 'delete',
              label: <Link onClick={() => showDeleteModal(record)}>Eliminar</Link>,
            },
          ];
  
          return (
            <Dropdown menu={{ items: menuItems }}>
              <Button>
                Acciones <DownOutlined />
              </Button>
            </Dropdown>
          );
        },
      },
  ];

  return (
    <div>
      {loading ? (
        <Spin tip="Cargando usuarios..." />
      ) : (
        <Table dataSource={users} columns={columns} rowKey="_id" />
      )}

      <Modal
        title="Confirmar eliminación"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Eliminar"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro de que deseas eliminar este usuario?</p>
      </Modal>
    </div>
  );
};

export default UsersTable;