import { Sequelize } from "sequelize";

const User = (sequelize, DataTypes) =>
    sequelize.define("User", {
        name:           Sequelize.STRING,
        username:       Sequelize.STRING,
        password:       Sequelize.STRING,
    },
    {
        defaultScope: {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        },
        tableName: "User"
    });

export default User;