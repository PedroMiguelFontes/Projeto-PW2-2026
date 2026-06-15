const mongoose = require('mongoose')
let ocorrenciaSchema = require('../Models/ocorrencias.schema')

let ocorrencias =
[
    {"id":1, "titulo":"Vazamento no telhado", "descricao":"Há um vazamento no telhado do prédio, causando infiltração e danos à estrutura.", "categoria_id":1, "user_id":2, "estado_id":1, "prioridade":3, "edificio": "Aldi", "zona":"Norte", "latitude": 41.1579, "longitude": -8.6291, "data_registo":"2024-06-01T09:00:00Z", "data_resolucao":null},
    {"id":2, "titulo":"Luz do corredor avariada", "descricao":"A luz do corredor principal está avariada, deixando a área escura e insegura à noite.", "categoria_id":2, "user_id":3, "estado_id":3, "prioridade":2, "edificio":"NorteShopping", "zona":"Sul", "latitude": 84.1579, "longitude": -2.3295, "data_registo":"2024-06-02T14:30:00Z", "data_resolucao":"2024-06-05T15:30:00Z"},
    {"id":3, "titulo":"Entupimento no esgoto", "descricao":"O esgoto do prédio está entupido, causando mau cheiro e risco de transbordamento.", "categoria_id":3, "user_id":4, "estado_id":2, "prioridade":1, "edificio":"Continente", "zona":"Centro", "latitude": 80.0273, "longitude": 1.4917, "data_registo":"2024-06-08T10:00:00Z", "data_resolucao":null}
]

module.exports = mongoose.model(
    'Ocorrencia',ocorrenciaSchema,'Ocorrencias'
);