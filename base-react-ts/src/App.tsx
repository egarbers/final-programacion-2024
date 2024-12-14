import React from 'react';
import 'antd/dist/reset.css';
import './App.css';

import { Layout } from 'antd';

import Login from './components/Login';
import UsersTable from './components/UsersTable';
import MajorMenu from './components/MajorMenu';
import WorkTree from './components/WorkTree';
import UserEdit from './components/UserEdit';
import UserCreate from './components/UserCreate';
import UserPositionEdit from './components/UserPositionEdit';
import NotFoundPage from './components/NotFoundPage';
import AreasTable from './components/AreasTable';
import AreaEdit from './components/AreaEdit';
import AreaCreate from './components/AreaCreate';
import AreaDepartmentsTable from './components/AreaDepartmentsTable';
import DepartmentCreate from './components/DepartmentCreate';
import DepartmentEdit from './components/DepartmentEdit';

import PrivateRoute from './components/PrivateRoute';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const { Sider, Content } = Layout;

function App() {
    const hasValidToken = !!localStorage.getItem('token');
    
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                {/* Barra lateral con el menú */}
                {hasValidToken && (
                    <Sider width={250} style={{ background: '#fff', boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)' }}>
                        <MajorMenu />
                    </Sider>
                )}

                {/* Contenido principal */}
                <Layout>
                    <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    <>
                                        <Login />
                                    </>
                                }
                            />
                            {/* Ruta principal con la tabla de usuarios */}
                            <Route
                                path="/users/list"
                                element={
                                    <PrivateRoute>
                                        <h2>Usuarios registrados</h2>
                                        <UsersTable />
                                    </PrivateRoute>
                                }
                            />

                            {/* Ruta para el árbol de trabajo */}
                            <Route
                                path="/organigram"
                                element={
                                    <PrivateRoute>
                                        <h2>Organigrama</h2>
                                        <WorkTree />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/users/edit/:id"
                                element={
                                    <PrivateRoute>
                                        <h2>Editar usuario</h2>
                                        <UserEdit />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/users/position/edit/:id"
                                element={
                                    <PrivateRoute>
                                        <h2>Editar puesto</h2>
                                        <UserPositionEdit />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/users/create"
                                element={
                                    <PrivateRoute>
                                        <h2>Crear usuario</h2>
                                        <UserCreate />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/areas/list"
                                element={
                                    <PrivateRoute>
                                        <h2>Areas registradas</h2>
                                        <AreasTable />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/areas/edit/:id"
                                element={
                                    <PrivateRoute>
                                        <h2>Editar area</h2>
                                        <AreaEdit />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/areas/add"
                                element={
                                    <PrivateRoute>
                                        <h2>Crear area</h2>
                                        <AreaCreate />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/areas/:id/departments"
                                element={
                                    <PrivateRoute>
                                        <h2>Departamentos del area</h2>
                                        <AreaDepartmentsTable />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/areas/:id/departments/add"
                                element={
                                    <PrivateRoute>
                                        <DepartmentCreate />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/departments/edit/:id"
                                element={
                                    <PrivateRoute>
                                        <h2>Editar departamento</h2>
                                        <DepartmentEdit />
                                    </PrivateRoute>
                                }
                            />
                            {/* Ruta para cualquier página no encontrada */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
}

export default App;
