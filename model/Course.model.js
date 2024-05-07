import { Sequelize } from "sequelize";

const Course = (sequelize, DataTypes) =>
    sequelize.define("Course", {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
    },
        {
            tableName: "Course"
        });

export default Course;