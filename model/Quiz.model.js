const Quiz = (sequelize, DataTypes) =>
    sequelize.define("Quiz", {
        name: DataTypes.STRING,
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "Quiz"
        });

export default Quiz;