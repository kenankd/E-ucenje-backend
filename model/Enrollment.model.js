const Enrollment = (sequelize, DataTypes) =>
    sequelize.define("Enrollment", {},
        {
            tableName: "Enrollment"
        });

export default Enrollment;