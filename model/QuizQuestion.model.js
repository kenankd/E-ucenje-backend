const QuizQuestion = (sequelize, DataTypes) =>
    sequelize.define("QuizQuestion", {
        text: DataTypes.STRING,
    },
        {
            tableName: "QuizQuestion"
        });

export default QuizQuestion;
