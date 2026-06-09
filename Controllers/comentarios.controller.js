const mongoose = require('mongoose');
const Comentario = require('../Models/comentarios.schema');


const resolveUserQuery = (id) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        return { _id: id };
    }
    const numericId = Number(id);
    if (!Number.isNaN(numericId)) {
        return { id: numericId };
    }
    return { _id: id };
};


const getComentariosByOcorrencia = async (req, res) => {
    try {
        const { id } = req.params; 
        const comentarios = await Comentario.find({ ocorrencia_id: id });
        if (!comentarios) {
            return res.status(404).json({message: 'Não existem comentarios dessa ocorrencia'})
        }
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao procurar comentários', error: error.message });
    }
};

const createComentario = async (req, res) => {
    try {
        const { id } = req.params; 
        const { user_id, texto } = req.body;

        if (req.loggedUserRole!='Utilizador') {
            return res.status(403).json({message:'Só os utilizadores podem mandar comentarios'})
        }

        const novoComentario = new Comentario({
            ocorrencia_id: id,
            user_id,
            texto,
            estado:"Visivel"
        });

        const comentarioSalvo = await novoComentario.save();
        res.status(201).json(comentarioSalvo);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar comentário', error: error.message });
    }
};

const deleteComentario = async (req, res) => {
    try {
        if (req.loggedUserRole!='Admin') {
            return res.status(403).json({message:'Só os administradores podem apagar comentarios'})
        }
        const { comentarioId } = req.params;
        const comentarioEliminado = await Comentario.findByIdAndDelete(comentarioId);

        if (!comentarioEliminado) {
            return res.status(404).json({ message: 'Comentário não encontrado' });
        }

        res.status(200).json({ message: 'Comentário eliminado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao eliminar comentário', error: error.message });
    }
};

const updateComentario = async (req, res) => {
    try {
        const { comentarioId } = req.params;
        const { texto,estado } = req.body;
        if (req.loggedUserRole!='Utilizador') {
            return res.status(403).json({message:'Só os utilizadores podem mandar comentarios'})
        }
        
        const comentarioAtualizado = await Comentario.findByIdAndUpdate(
            comentarioId,
            { texto,estado },
            { new: true, runValidators: true }
        );

        if (req.params !== comentarioAtualizado.user_id ) {
            return res.status(403).json({message:'Não podes mudar as mensagens de outros'})
        }

        if (!comentarioAtualizado) {
            return res.status(404).json({ message: 'Comentário não encontrado' });
        }

        res.status(200).json(comentarioAtualizado);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar estado do comentário', error: error.message });
    }
}

const sinalizarComentario = async (req, res) => {
    if (req.loggedUserRole !== 'Utilizador' || req.loggedUserRole !=='Funcionario') {
        return res.status(403).json({ message: 'Não tem permissões para sinalizar esse comentario.' });
    }
    try {
        const query = resolveComentarioQuery(req.params.id);
        const updatedComentario = await Comentario.findOne(query)

        if (!updatedComentario) {
            res.status(404).json({ message: "Comentario não existe" });
        } else if (updatedComentario.estado === 'Indevido') {
            res.status(400).json({ message: "Comentario já está sinalizado" });
        } else {
            await Comentario.findOneAndUpdate(query, { estado: 'Indevido' }, { new: true });
            return res.status(200).json({message: "Comentario sinalizado com sucesso"});
        } 
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getComentariosByOcorrencia,
    createComentario,
    updateComentario,
    deleteComentario,
    sinalizarComentario
}