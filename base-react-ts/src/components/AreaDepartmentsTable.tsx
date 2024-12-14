import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, message, Dropdown, Button, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';

const AreaDepartmentsTable = () => {
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [area, setArea] = useState([]);
    const { id } = useParams();

    const token = localStorage.getItem('token');

    const fetchAreaData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:4000/areas/${id}/departments`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setArea(response.data || []);
            setDepartments(response.data.departments || []);
        } catch (error) {
            message.error('Error al obtener los datos del área.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAreaData();
    }, []);

    const handleDelete = async () => {
        if (!selectedDepartment) return;

        try {
            await axios.delete(`http://localhost:4000/departments/${selectedDepartment._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            message.success('Departamento eliminado correctamente.');
            setIsModalVisible(false);
            setSelectedDepartment(null);
            fetchAreaData(); // Refrescar lista
        } catch (error) {
            message.error('Error al eliminar el departamento.');
        }
    };

    const showDeleteModal = (record) => {
        setSelectedDepartment(record);
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
            title: 'Acciones',
            key: 'actions',
            render: (record) => {
                const menuItems = [
                    {
                        key: 'edit',
                        label: <Link to={`/departments/edit/${record._id}`}>Editar datos</Link>,
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
            }
        },
    ];

    return (
        <div>
            {loading ? (
                <Spin tip="Cargando departamentos..." />
            ) : (
                <>
                    <h3>{area.name}</h3>
                    <Table dataSource={departments} columns={columns} rowKey="_id" />
                </>
            )}

            <Modal
                title="Confirmar eliminación"
                visible={isModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsModalVisible(false)}
                okText="Eliminar"
                cancelText="Cancelar"
            >
                <p>¿Estás seguro de que deseas eliminar este departamento?</p>
            </Modal>
        </div>
    );
};

export default AreaDepartmentsTable;
