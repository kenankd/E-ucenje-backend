const UserQuizAnswer = (sequelize, DataTypes) =>
    sequelize.define("UserQuizAnswer", {
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "UserQuizAnswer"
        });

export default UserQuizAnswer;