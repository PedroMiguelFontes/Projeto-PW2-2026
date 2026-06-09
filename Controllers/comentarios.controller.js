const mongoose = require('mongoose');
const Comentario = require('../Models/comentarios.schema');


exports.getComentariosByOcorrencia = async (req, res) => {
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

exports.createComentario = async (req, res) => {
    try {
        const { id } = req.params; 
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
