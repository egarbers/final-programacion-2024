import mongodb from 'mongodb';

const { ObjectId } = mongodb;

// Datos iniciales para las colecciones
const initialAreas = [
  {
    _id: new ObjectId('111111111111111111111111'),
    name: 'Recursos Humanos',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('222222222222222222222222'),
    name: 'Tecnología',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('333333333333333333333333'),
    name: 'Finanzas',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('444444444444444444444444'),
    name: 'Marketing',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: new ObjectId('555555555555555555555555'),
    name: 'Operaciones',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialDepartments = [
  // Recursos Humanos
  { _id: new ObjectId(), name: 'Reclutamiento', areaId: initialAreas[0]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Relaciones Laborales', areaId: initialAreas[0]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Capacitación', areaId: initialAreas[0]._id, createdAt: new Date(), updatedAt: new Date() },

  // Tecnología
  { _id: new ObjectId(), name: 'Desarrollo de Software', areaId: initialAreas[1]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Infraestructura', areaId: initialAreas[1]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Soporte Técnico', areaId: initialAreas[1]._id, createdAt: new Date(), updatedAt: new Date() },

  // Finanzas
  { _id: new ObjectId(), name: 'Contabilidad', areaId: initialAreas[2]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Presupuestos', areaId: initialAreas[2]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Tesorería', areaId: initialAreas[2]._id, createdAt: new Date(), updatedAt: new Date() },

  // Marketing
  { _id: new ObjectId(), name: 'Publicidad', areaId: initialAreas[3]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Relaciones Públicas', areaId: initialAreas[3]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Investigación de Mercados', areaId: initialAreas[3]._id, createdAt: new Date(), updatedAt: new Date() },

  // Operaciones
  { _id: new ObjectId(), name: 'Logística', areaId: initialAreas[4]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Gestión de Proyectos', areaId: initialAreas[4]._id, createdAt: new Date(), updatedAt: new Date() },
  { _id: new ObjectId(), name: 'Control de Calidad', areaId: initialAreas[4]._id, createdAt: new Date(), updatedAt: new Date() },
];

const initialPositions = [];
const departmentHeads = [];

// Crear posiciones y definir un jefe para cada departamento
initialDepartments.forEach((department, index) => {
  // Crear un puesto de jefe
  const headPositionId = new ObjectId();
  initialPositions.push({
    _id: headPositionId,
    name: `Jefe de ${department.name}`,
    areaId: department.areaId,
    departmentId: department._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  initialPositions.push({
    _id: new ObjectId(),
    name: `Empleado de ${department.name}`,
    areaId: department.areaId,
    departmentId: department._id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Agregar la referencia del jefe al departamento
  departmentHeads.push({
    departmentId: department._id,
    head: headPositionId,
  });
});

// Migración `up` para insertar datos
export const up = async (db) => {
  await db.collection('areas').insertMany(initialAreas);
  await db.collection('departments').insertMany(initialDepartments);

  // Actualizar los departamentos con sus jefes
  for (const head of departmentHeads) {
    await db.collection('departments').updateOne(
      { _id: head.departmentId },
      { $set: { head: head.head } }
    );
  }

  await db.collection('positions').insertMany(initialPositions);
};

// Migración `down` para eliminar datos
export const down = async (db) => {
  await db.collection('positions').deleteMany({
    _id: { $in: initialPositions.map((position) => position._id) },
  });
  await db.collection('departments').deleteMany({
    _id: { $in: initialDepartments.map((department) => department._id) },
  });
  await db.collection('areas').deleteMany({
    _id: { $in: initialAreas.map((area) => area._id) },
  });
};
