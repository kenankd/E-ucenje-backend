
const CourseMaterial = (sequelize, DataTypes) =>
    sequelize.define("CourseMaterial", {
        name: DataTypes.STRING,
        type: {
            type: DataTypes.ENUM('predavanje', 'vjezba'),
        }, 
        file_path: DataTypes.STRING,
    },
        {
            tableName: "CourseMaterial"
        });

export default CourseMaterial;