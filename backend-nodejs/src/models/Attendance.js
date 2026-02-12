const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    studentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id'
        }
    },
    subjectId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'Subjects',
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE'),
        defaultValue: 'PRESENT'
    },
    facultyId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'attendance',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['studentId', 'subjectId', 'date']
        }
    ]
});

module.exports = Attendance;
