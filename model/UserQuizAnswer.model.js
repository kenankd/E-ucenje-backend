const UserQuizAnswer = (sequelize, DataTypes) =>
    sequelize.define("UserQuizAnswer", {
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt', 'AnswerId', 'QuestionId', 'QuizAttemptId'] }
            },
            tableName: "UserQuizAnswer"
        });

export default UserQuizAnswer;