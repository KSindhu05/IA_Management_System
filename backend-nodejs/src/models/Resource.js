const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resource = sequelize.define('Resource', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    type: {
        type: DataTypes.ENUM('NOTES', 'ASSIGNMENT', 'QUESTION_PAPER', 'REFERENCE', 'VIDEO', 'OTHER'),
        defaultValue: 'NOTES'
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'External link or file path'
    },
    subjectId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'Subjects',
            key: 'id'
        }
    },
    uploadedBy: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    semester: {
        type: DataTypes.STRING,
        allowNull: true
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'resources',
    timestamps: true
});

module.exports = Resource;
