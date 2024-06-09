const Question = (sequelize, DataTypes) =>
    sequelize.define("Question", {
        text: DataTypes.STRING,
        points: DataTypes.INTEGER
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "Question"
        });

export default Question;
