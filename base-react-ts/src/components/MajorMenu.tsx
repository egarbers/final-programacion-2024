import React, { useState, useEffect } from 'react';
import { UserOutlined, ApartmentOutlined, UnorderedListOutlined, UserAddOutlined, PlusCircleOutlined, BankOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Dropdown, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

type MenuItem = Required<MenuProps>['items'][number];

const MajorMenu: React.FC = () => {
    const [current, setCurrent] = useState('mail');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
        console.log(user);
        const userName = user ? user.firstName + ' ' + user.lastName : '';
        const userRole = user ? user.role : '';

        // Definir los elementos del menú de acuerdo con el rol
        const items: MenuItem[] = [
            {
                key: 'logo',
                icon: <img src={logo} alt="Logo" style={{ width: 180, height: 'auto' }} />,
                label: '',
                disabled: true,
                style: { height: 120, textAlign: 'center', padding: 0, marginBottom: '20px' },
            },
            {
                key: 'organigram',
                icon: <ApartmentOutlined />,
                label: <Link to="/organigram">Organigrama</Link>,
            },
            {
                label: 'Usuarios',
                key: 'users',
                icon: <UserOutlined />,
                children: [
                    {
                        type: 'group',
                        children: [
                            {
                                label: <Link to="/users/list">Listado</Link>,
                                icon: <UnorderedListOutlined />,
                                key: 'listUser:1',
                            },
                            {
                                label: <Link to="/users/create">Agregar</Link>,
                                icon: <UserAddOutlined />,
                                key: 'addUser:2',
                            },
                        ],
                    },
                ],
            },
            {
                label: 'Áreas',
                key: 'areas',
                icon: <BankOutlined />,
                children: [
                    {
                        type: 'group',
                        children: [
                            {
                                label: <Link to="/areas/list">Listado</Link>,
                                icon: <UnorderedListOutlined />,
                                key: 'listArea:1',
                            },
                            {
                                label: <Link to="/areas/add">Agregar</Link>,
                                icon: <PlusCircleOutlined />,
                                key: 'addArea:2',
                            },
                        ],
                    },
                ],
            },
            {
                label: (
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: 'edit-profile',
                                    label: (
                                        <Link to="/edit-account">
                                            <SettingOutlined style={{ marginRight: 8 }} />
                                            Editar cuenta
                                        </Link>
                                    ),
                                },
                                {
                                    key: 'logout',
                                    label: (
                                        <Link type="text" onClick={handleLogout}>
                                            <LogoutOutlined style={{ marginRight: 8 }} />
                                            Cerrar sesión
                                        </Link>
                                    ),
                                },
                            ],
                        }}
                        trigger={['click']}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                            {userName}
                        </div>
                    </Dropdown>
                ),
                key: 'user',
                style: { marginTop: '20px' },
            }
        ];

        // Si el rol no es 'admin', ocultamos las opciones de 'Usuarios' y 'Áreas'
        if (userRole !== 'admin') {
            const filteredItems = items.filter(item => item.key !== 'users' && item.key !== 'areas');
            setMenuItems(filteredItems);
        } else {
            setMenuItems(items);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.replace('/login'); // Redirigir al login tras cerrar sesión
    };

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <div style={{ width: 250 }}>
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                mode="inline"
                items={menuItems}
            />
        </div>
    );
};

export default MajorMenu;
