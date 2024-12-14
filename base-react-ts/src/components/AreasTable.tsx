import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, message, Dropdown, Menu, Button, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const AreasTable = () => {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);

    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;

    const fetchAreas = async () => {
        try {
            const response = await axios.get('http://localhost:4000/areas', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            setAreas(response.data);
            setLoading(false);
        } catch (error) {
            message.error('Error al cargar los usuarios');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const handleDelete = async () => {
        if (!selectedArea) return;

        try {
            await axios.delete(`http://localhost:4000/areas/${selectedArea._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            message.success('Area eliminada correctamente');
            setIsModalVisible(false);
            setSelectedArea(null);
            fetchAreas(); // Refrescar la lista
        } catch (error) {
            message.error('Error al eliminar el area');
            setIsModalVisible(false);
            setSelectedArea(null);
        }
    };

    const showDeleteModal = (record) => {
        setSelectedArea(record);
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
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Cantidad de departamentos',
            key: 'actions',
            render: (record) => {
                return record.departments.length;
            },
        },
        {
            title: '',
            key: 'actions',
            render: (record) => {
                const menuItems = [
                    {
                        key: 'edit',
                        label: <Link to={`/areas/edit/${record._id}`}>Editar datos</Link>,
                    },
                    {
                        key: 'addDepartment',
                        label: <Link to={`/areas/${record._id}/departments/add`}>Agregar departamento</Link>,
                    },
                    {
                        key: 'delete',
                        label: <Link onClick={() => showDeleteModal(record)}>Eliminar</Link>,
                    },
                ];

                // Si hay departamentos agrego el modificar
                if (record.departments?.length > 0) {
                    menuItems.splice(2, 0, { // Se inserta despues del add
                        key: 'editDepartments',
                        label: <Link to={`/areas/${record._id}/departments`}>Modificar departamentos</Link>,
                    });
                }

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
                <Spin tip="Cargando areas..." />
            ) : (
                <Table dataSource={areas} columns={columns} rowKey="_id" />
            )}

            <Modal
                title="Confirmar eliminación"
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsModalVisible(false)}
                okText="Eliminar"
                cancelText="Cancelar"
            >
                <p>¿Estás seguro de que deseas eliminar esta area?</p>
            </Modal>
        </div>
    );
};

export default AreasTable;