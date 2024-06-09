const Course = (sequelize, DataTypes) =>
    sequelize.define("Course", {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
    },
        {
            defaultScope: {
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            },
            tableName: "Course"
        });

export default Course;