const Answer = (sequelize, DataTypes) =>
    sequelize.define("Answer", {
        text: DataTypes.STRING,
        correct: DataTypes.BOOLEAN
    },
        {
            tableName: "Answer"
        });

export default Answer;
