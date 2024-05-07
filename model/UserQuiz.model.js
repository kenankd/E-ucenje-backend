const UserQuiz = (sequelize, DataTypes) =>
    sequelize.define("UserQuiz", {
        score: DataTypes.INTEGER
    },
        {
            tableName: "UserQuiz"
        });

export default UserQuiz;