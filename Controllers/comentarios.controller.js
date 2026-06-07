const Comentario = require('../Models/comentarios.schema');

// Listar todos os comentários de uma ocorrência específica
exports.getComentariosByOcorrencia = async (req, res) => {
    try {
        const { id } = req.params; // ID da ocorrência vindo da rota pai
        const comentarios = await Comentario.find({ ocorrencia_id: id });
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao procurar comentários', error: error.message });
    }
};

// Criar um novo comentário para uma ocorrência
exports.createComentario = async (req, res) => {
    try {
        const { id } = req.params; // ID da ocorrência
        const { user_id, texto } = req.body;

        const novoComentario = new Comentario({
            ocorrencia_id: id,
            user_id,
            texto
        });

        const comentarioSalvo = await novoComentario.save();
        res.status(201).json(comentarioSalvo);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar comentário', error: error.message });
    }
};

// Eliminar um comentário
exports.deleteComentario = async (req, res) => {
    try {
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

// Atualizar estado do comentário (ex: para moderar/marcar como Indevido)
exports.updateEstadoComentario = async (req, res) => {
    try {
        const { comentarioId } = req.params;
        const { estado } = req.body;

        const comentarioAtualizado = await Comentario.findByIdAndUpdate(
            comentarioId,
            { estado },
            { new: true, runValidators: true }
        );

        if (!comentarioAtualizado) {
            return res.status(404).json({ message: 'Comentário não encontrado' });
        }

        res.status(200).json(comentarioAtualizado);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar estado do comentário', error: error.message });
    }
};
