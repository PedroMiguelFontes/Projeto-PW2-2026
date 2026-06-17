const mongoose = require('mongoose');

const Ocorrencia = require('../Models/ocorrencias.model');
const User = require('../Models/users.model');
const Categoria = require('../Models/categorias.model');
const Estado = require('../Models/estados.model');

async function migrate() {
    try {
        await mongoose.connect('mongodb://localhost:27017/TEU_DB');

        const ocorrencias = await Ocorrencia.find();

        for (let o of ocorrencias) {

            // 🔴 procurar user por "id antigo"
            const user = await User.findOne({ id: o.user_id });
            const categoria = await Categoria.findOne({ id: o.categoria_id });
            const estado = await Estado.findOne({ id: o.estado_id });

            if (!user || !categoria || !estado) {
                console.log("Skip ocorrência:", o.id);
                continue;
            }

            o.user_id = user._id;
            o.categoria_id = categoria._id;
            o.estado_id = estado._id;

            await o.save();

            console.log("Migrada ocorrência:", o.id);
        }

        console.log("Migração concluída!");
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();