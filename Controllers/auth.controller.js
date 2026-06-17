const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/users.schema');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }


        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.estado !== 'Ativo') {
            return res.status(403).json({ message: 'Estás suspenso e náo podes entrar' });
        }

        const token = jwt.sign(
            { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo, estado: user.estado },
            process.env.SECRET || 'defaultSecret',
            { expiresIn: '2h' }
        );
        const userResponse = user.toObject();
        delete userResponse.password;

        return res.json({ user: userResponse, token });
    } catch (error) {
        console.error('Auth login error:', error);
        return res.status(500).json({ message: error.message });
    }
};

const verifyToken = (req, res, next) => {
    const header = req.headers['x-access-token'] || req.headers.authorization;
    if (typeof header === 'undefined') {
        return res.status(401).json({ success: false, msg: "Token inválido ou expirado." });
    }
    const bearer = header.split(' ');
    const token = bearer[1];
    try {
        const decoded = jwt.verify(token, process.env.SECRET || 'defaultSecret');
        req.loggedUserId = decoded.id;
        req.loggedUserRole = decoded.tipo;
        req.loggedUserEstado = decoded.estado;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, msg: "Token inválido ou expirado." });
    }
};

module.exports = {
    login,
    verifyToken
};