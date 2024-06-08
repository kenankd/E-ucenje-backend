
const Material = (sequelize, DataTypes) =>
    sequelize.define("Material", {
        name: DataTypes.STRING,
        type: {
            type: DataTypes.ENUM('predavanje', 'vjezba'),
        }, 
        file: DataTypes.BLOB('long'),
    },
        {
            tableName: "Material"
        });

export default Material;