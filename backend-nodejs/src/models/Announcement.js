const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cieNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    scheduledDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 60
    },
    examRoom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instructions: {
        type: DataTypes.TEXT
    },
    syllabusCoverage: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('SCHEDULED', 'CANCELLED', 'COMPLETED'),
        defaultValue: 'SCHEDULED'
    },
    subjectId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Subjects', // Matches table name usually pluraized by Sequelize
            key: 'id'
        }
    },
    facultyId: {
        type: DataTypes.BIGINT,
        allowNull: true
    }
});

module.exports = Announcement;
