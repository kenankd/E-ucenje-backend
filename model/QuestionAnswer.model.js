const QuestionAnswer = (sequelize, DataTypes) =>
    sequelize.define("QuestionAnswer", {
        text: DataTypes.STRING,
        isCorrect: DataTypes.BOOLEAN
    },
        {
            tableName: "QuestionAnswer"
        });

export default QuestionAnswer;
