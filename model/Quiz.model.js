const Quiz = (sequelize, DataTypes) =>
    sequelize.define("Quiz", {
        name: DataTypes.STRING,
        maxScore: DataTypes.INTEGER
    },
        {
            tableName: "Quiz"
        });

export default Quiz;