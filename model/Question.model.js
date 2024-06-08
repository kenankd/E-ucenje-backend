const Question = (sequelize, DataTypes) =>
    sequelize.define("Question", {
        text: DataTypes.STRING,
        points: DataTypes.INTEGER
    },
        {
            tableName: "Question"
        });

export default Question;
