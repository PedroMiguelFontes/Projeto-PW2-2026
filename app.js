const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Load environment variables FIRST
dotenv.config();

const userRoutes = require('./Routes/users.route');
const authRoutes = require('./Routes/auth.route');
const categoriasRoutes = require('./Routes/categorias.route');
const ocorrenciasRoutes = require('./Routes/ocorrencias.route');
const comentariosRoutes = require('./Routes/comentarios.route');
const imagensRoutes = require('./Routes/imagens.route');
const estadosRoutes = require('./Routes/estados.route');
const tratamentosRoutes = require('./Routes/tratamentos.route');

// MongoDB Connection: prefer explicit MONGODB_URI, otherwise build from DB_* env vars with URL-encoding
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
let MONGODB_URI = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();
if (!MONGODB_URI && DB_USER && DB_PASSWORD && DB_HOST && DB_NAME) {
    const user = encodeURIComponent(DB_USER);
    const pass = encodeURIComponent(DB_PASSWORD);
    const host = DB_HOST;
    const isSrv = host.includes('mongodb.net') || host.startsWith('cluster');
    if (isSrv) {
        MONGODB_URI = `mongodb+srv://${user}:${pass}@${host}/${DB_NAME}?retryWrites=true&w=majority`;
    } else {
        MONGODB_URI = `mongodb://${user}:${pass}@${host}:27017/${DB_NAME}`;
    }
}
if (!MONGODB_URI) {
    MONGODB_URI = `mongodb://${process.env.DB_HOST || 'localhost'}:27017/${process.env.DB_NAME}`;
}
const sanitizedUri = MONGODB_URI.replace(/(mongodb(?:\+srv)?:\/\/)(.*?:.*?@)/, '$1***:***@');
console.log('Connecting to MongoDB via URI:', sanitizedUri);

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err.message));

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
if (Number.isNaN(PORT)) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

// Middleware
app.use(bodyParser.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/ocorrencias', ocorrenciasRoutes);
app.use('/api/ocorrencias/:id/comentarios', comentariosRoutes);
app.use('/api/ocorrencias/:id/imagens', imagensRoutes); 
app.use('/api/estados', estadosRoutes);
app.use('/api/tratamentos', tratamentosRoutes);
app.use('/api/estatisticas', estatisticasRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});