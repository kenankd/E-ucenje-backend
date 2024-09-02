const QuizAttempt = (sequelize, DataTypes) =>
    sequelize.define("QuizAttempt", {
        date: DataTypes.DATE,
        score: DataTypes.DOUBLE,
        time: DataTypes.INTEGER
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt', 'UserQuizId'] }
            },
            tableName: "QuizAttempt"
        });

export default QuizAttempt;