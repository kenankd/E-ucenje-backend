const Course = (sequelize, DataTypes) =>
    sequelize.define("Course", {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
    },
        {
            tableName: "Course"
        });

export default Course;