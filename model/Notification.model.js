const Notification = (sequelize, DataTypes) =>
    sequelize.define("Notification", {
        title: DataTypes.STRING,
        date: DataTypes.DATE
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "Notification"
        });

export default Notification;