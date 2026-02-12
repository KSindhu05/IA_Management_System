const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { Attendance, Student, Subject, User } = require('../models');
const { Op } = require('sequelize');

// Get attendance records (faculty/HOD query)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { subjectId, date, studentId, startDate, endDate } = req.query;

        const whereClause = {};
        if (subjectId) whereClause.subjectId = subjectId;
        if (date) whereClause.date = date;
        if (studentId) whereClause.studentId = studentId;

        if (startDate && endDate) {
            whereClause.date = {
                [Op.between]: [startDate, endDate]
            };
        }

        const attendance = await Attendance.findAll({
            where: whereClause,
            include: [
                { model: Student, attributes: ['id', 'regNo', 'name'] },
                { model: Subject, attributes: ['id', 'name', 'code'] }
            ],
            order: [['date', 'DESC']]
        });

        res.json(attendance);
    } catch (error) {
        console.error('Get attendance error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get student-specific attendance
router.get('/student/:studentId', authMiddleware, async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subjectId } = req.query;

        const whereClause = { studentId };
        if (subjectId) whereClause.subjectId = subjectId;

        const attendance = await Attendance.findAll({
            where: whereClause,
            include: [
                { model: Subject, attributes: ['id', 'name', 'code'] }
            ],
            order: [['date', 'DESC']]
        });

        // Calculate attendance percentage
        const total = attendance.length;
        const present = attendance.filter(a => a.status === 'PRESENT').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

        res.json({
            attendance,
            stats: {
                total,
                present,
                absent: total - present,
                percentage
            }
        });
    } catch (error) {
        console.error('Get student attendance error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update/Create attendance (Faculty)
router.post('/update', authMiddleware, roleMiddleware('FACULTY', 'HOD'), async (req, res) => {
    try {
        const { subjectId, date, attendanceData } = req.body;
        // attendanceData: [{ studentId, status }]

        if (!subjectId || !date || !attendanceData || !Array.isArray(attendanceData)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const facultyId = req.user.id;
        const results = [];

        for (const record of attendanceData) {
            const [attendance, created] = await Attendance.findOrCreate({
                where: {
                    studentId: record.studentId,
                    subjectId,
                    date
                },
                defaults: {
                    status: record.status,
                    facultyId
                }
            });

            if (!created) {
                await attendance.update({ status: record.status, facultyId });
            }

            results.push(attendance);
        }

        res.json({ message: 'Attendance updated successfully', count: results.length });
    } catch (error) {
        console.error('Update attendance error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get attendance summary by subject
router.get('/summary/subject/:subjectId', authMiddleware, async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { startDate, endDate } = req.query;

        const whereClause = { subjectId };
        if (startDate && endDate) {
            whereClause.date = { [Op.between]: [startDate, endDate] };
        }

        const attendance = await Attendance.findAll({
            where: whereClause,
            include: [{ model: Student, attributes: ['id', 'regNo', 'name'] }]
        });

        // Group by student
        const studentSummary = {};
        attendance.forEach(record => {
            const studentId = record.studentId;
            if (!studentSummary[studentId]) {
                studentSummary[studentId] = {
                    student: record.Student,
                    total: 0,
                    present: 0,
                    absent: 0,
                    percentage: 0
                };
            }
            studentSummary[studentId].total++;
            if (record.status === 'PRESENT') {
                studentSummary[studentId].present++;
            } else {
                studentSummary[studentId].absent++;
            }
        });

        // Calculate percentages
        Object.values(studentSummary).forEach(summary => {
            summary.percentage = summary.total > 0
                ? ((summary.present / summary.total) * 100).toFixed(2)
                : 0;
        });

        res.json(Object.values(studentSummary));
    } catch (error) {
        console.error('Get attendance summary error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
