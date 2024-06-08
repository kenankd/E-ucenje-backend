import { Sequelize } from "sequelize";

const User = (sequelize, DataTypes) =>
    sequelize.define("User", {
        name:           Sequelize.STRING,
        username:       Sequelize.STRING,
        password:       Sequelize.STRING,
    },
    {
        tableName: "User"
    });

export default User;