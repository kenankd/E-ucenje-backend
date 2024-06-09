const UserQuiz = (sequelize, DataTypes) =>
    sequelize.define("UserQuiz", {
        score: DataTypes.INTEGER
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "UserQuiz"
        });

export default UserQuiz;