import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';
import { Tree, Spin, message } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';

// API call to fetch areas using Axios
const fetchAreas = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found'); // Verifica que el token exista

    const response = await axios.get('http://localhost:4000/areas/organigram', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    return response.data;
};

const normalizeDepartments = (departments: any[]) => {
    const departmentMap: Record<string, any> = {};

    departments.forEach(department => {
        const { _id, name, positions } = department;

        if (!departmentMap[_id]) {
            departmentMap[_id] = { _id, name, positions: [] };
        }

        if (positions) {
            departmentMap[_id].positions = [
                ...departmentMap[_id].positions,
                ...(Array.isArray(positions) ? positions : [positions]).map(position => ({
                    ...position,
                    users: position.users || [], // Asegura que users sea siempre un arreglo
                })),
            ];
        }
    });

    return Object.values(departmentMap);
};

// Helper function to map API response to tree data
const mapToTreeData = (areas: any[]): TreeDataNode[] => {
    return areas.map(area => ({
        title: <span style={{ fontWeight: 'bold' }}>{area.name}</span>,
        key: `area-${area._id}`,
        children: normalizeDepartments(area.departments).map(department => ({
            title: <span style={{ fontWeight: 'bold' }}>{department.name}</span>,
            key: `department-${department._id}`,
            children: department.positions.map(position => ({
                title: <span style={{ textDecoration: 'underline' }}>{position.name}  ({position.users.length})</span>,
                key: `position-${position._id}`,
                children: (position.users || []).map(user => ({
                    title: `${user.firstName} ${user.lastName} (${user.email})`,
                    key: `user-${user._id}`,
                })),
            })),
        })),
    }));
};

const getAllKeys = (data: any) => {
    const keys: string[] = [];
    const traverse = (nodes: any) => {
        nodes.forEach((node: any) => {
            keys.push(node.key);
            if (node.children) {
                traverse(node.children);
            }
        });
    };
    traverse(data);
    return keys;
};

const App: React.FC = () => {
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const areas = await fetchAreas();
                const tree = mapToTreeData(areas);
                setTreeData(tree);
                setExpandedKeys(getAllKeys(tree)); // Establece las claves expandidas
            } catch (error) {
                console.error('Error loading data:', error);
                message.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    return (
        <>
            {loading ? (
                <Spin />
            ) : (
                <Tree
                    showLine
                    switcherIcon={<DownOutlined />}
                    expandedKeys={expandedKeys} // Usa expandedKeys en lugar de defaultExpandedKeys
                    onSelect={onSelect}
                    treeData={treeData}
                />
            )}
        </>
    );
};

export default App;
