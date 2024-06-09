
const Material = (sequelize, DataTypes) =>
    sequelize.define("Material", {
        name: DataTypes.STRING,
        type: {
            type: DataTypes.ENUM('predavanje', 'vjezba'),
        }, 
        file: DataTypes.BLOB('long'),
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "Material"
        });

export default Material;