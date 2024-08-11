import jwt from 'jsonwebtoken';
import db from "../config/db.js";
import bcrypt from 'bcrypt';
const login = async (req, res) => {

    try {
        const { username, password } = req.body;
        const user = await db.User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.dataValues.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }


        const token = jwt.sign({ id: user.dataValues.id, username: user.dataValues.username }, process.env.JWT_SECRET);
        req.session.user = user.dataValues;
        console.log(req.session.user);
        // Return the token
        return res.json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default { login };
