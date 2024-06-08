const Notification = (sequelize, DataTypes) =>
    sequelize.define("Notification", {
        title: DataTypes.STRING,
        date: DataTypes.DATE
    },
        {
            tableName: "Notification"
        });

export default Notification;