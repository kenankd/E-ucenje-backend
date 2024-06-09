const Answer = (sequelize, DataTypes) =>
    sequelize.define("Answer", {
        text: DataTypes.STRING,
        correct: DataTypes.BOOLEAN
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "Answer"
        });

export default Answer;
