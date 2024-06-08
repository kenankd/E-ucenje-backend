const Quiz = (sequelize, DataTypes) =>
    sequelize.define("Quiz", {
        name: DataTypes.STRING,
    },
        {
            tableName: "Quiz"
        });

export default Quiz;