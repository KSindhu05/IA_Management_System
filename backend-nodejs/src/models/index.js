// Central export for all models
const User = require('./User');
const Student = require('./Student');
const Subject = require('./Subject');
const CIEMark = require('./CIEMark');
const Announcement = require('./Announcement');
const Attendance = require('./Attendance');
const Notification = require('./Notification');
const Resource = require('./Resource');

// Associations
Announcement.belongsTo(Subject, { foreignKey: 'subjectId' });
Subject.hasMany(Announcement, { foreignKey: 'subjectId' });
Announcement.belongsTo(User, { as: 'faculty', foreignKey: 'facultyId' });

Attendance.belongsTo(Student, { foreignKey: 'studentId' });
Attendance.belongsTo(Subject, { foreignKey: 'subjectId' });
Attendance.belongsTo(User, { as: 'faculty', foreignKey: 'facultyId' });
Student.hasMany(Attendance, { foreignKey: 'studentId' });
Subject.hasMany(Attendance, { foreignKey: 'subjectId' });

Notification.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Notification, { foreignKey: 'userId' });

Resource.belongsTo(Subject, { foreignKey: 'subjectId' });
Resource.belongsTo(User, { as: 'uploader', foreignKey: 'uploadedBy' });
Subject.hasMany(Resource, { foreignKey: 'subjectId' });

module.exports = {
    User,
    Student,
    Subject,
    CIEMark,
    Announcement,
    Attendance,
    Notification,
    Resource
};
