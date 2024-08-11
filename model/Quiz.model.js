const Quiz = (sequelize, DataTypes) =>
    sequelize.define("Quiz", {
        name: DataTypes.STRING,
        minScore: DataTypes.INTEGER,
        time: DataTypes.INTEGER,
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "Quiz"
        });

export default Quiz;