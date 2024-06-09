const UserQuiz = (sequelize, DataTypes) =>
    sequelize.define("UserQuiz", {
        id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "UserQuiz"
        });

export default UserQuiz;