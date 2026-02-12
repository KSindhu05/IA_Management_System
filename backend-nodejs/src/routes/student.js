const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { Student, CIEMark, Subject, Attendance, Resource, User } = require('../models');
const { Op } = require('sequelize');

// Student dashboard
router.get('/dashboard', authMiddleware, roleMiddleware('STUDENT'), async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { regNo: req.user.username },
            include: [
                {
                    model: CIEMark,
                    as: 'marks',
                    include: [{ model: Subject, as: 'subject' }]
                }
            ]
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            student: {
                id: student.id,
                regNo: student.regNo,
                name: student.name,
                department: student.department,
                semester: student.semester,
                section: student.section
            },
            marks: student.marks || []
        });
    } catch (error) {
        console.error('Student dashboard error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all students (for faculty/HOD)
router.get('/all', authMiddleware, roleMiddleware('ADMIN', 'FACULTY', 'HOD', 'PRINCIPAL'), async (req, res) => {
    try {
        const { department } = req.query;
        const whereClause = {};
        if (department) {
            whereClause.department = department;
        }

        const students = await Student.findAll({
            where: whereClause,
            attributes: ['id', 'regNo', 'name', 'department', 'semester', 'section', 'email', 'phoneNo', 'parentPhone'],
            include: [{
                model: CIEMark,
                as: 'marks',
                required: false // Left join to include students even without marks
            }],
            order: [['regNo', 'ASC']]
        });
        res.json(students);
    } catch (error) {
        console.error('Get all students error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Student Profile
router.get('/profile', authMiddleware, roleMiddleware('STUDENT'), async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { regNo: req.user.username }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Get student profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update Student Profile
router.put('/profile', authMiddleware, roleMiddleware('STUDENT'), async (req, res) => {
    try {
        const { email, phone, parentPhone, address } = req.body;

        const student = await Student.findOne({
            where: { regNo: req.user.username }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        await student.update({
            email: email || student.email,
            phone: phone || student.phone,
            parentPhone: parentPhone || student.parentPhone,
            address: address || student.address
        });

        res.json({ message: 'Profile updated successfully', student });
    } catch (error) {
        console.error('Update student profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Student Attendance
router.get('/attendance', authMiddleware, roleMiddleware('STUDENT'), async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { regNo: req.user.username }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const { subjectId } = req.query;
        const whereClause = { studentId: student.id };
        if (subjectId) whereClause.subjectId = subjectId;

        const attendance = await Attendance.findAll({
            where: whereClause,
            include: [
                { model: Subject, attributes: ['name', 'code'] }
            ],
            order: [['date', 'DESC']]
        });

        // Calculate stats
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

// Get Student Resources
router.get('/resources', authMiddleware, roleMiddleware('STUDENT'), async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { regNo: req.user.username }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const { subjectId, type } = req.query;
        const whereClause = {};

        // Filter by student's department and semester if not filtered by subject
        if (!subjectId) {
            whereClause.department = student.department;
            whereClause.semester = student.semester;
        } else {
            whereClause.subjectId = subjectId;
        }

        if (type) whereClause.type = type;

        const resources = await Resource.findAll({
            where: whereClause,
            include: [
                { model: Subject, attributes: ['name', 'code'] },
                { model: User, as: 'uploader', attributes: ['username'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(resources);
    } catch (error) {
        console.error('Get student resources error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get Student's Faculty
router.get('/faculty', authMiddleware, roleMiddleware('STUDENT'), async (req, res) => {
    try {
        const student = await Student.findOne({
            where: { regNo: req.user.username }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Find subjects for this student
        const subjects = await Subject.findAll({
            where: {
                department: student.department,
                semester: student.semester
            }
        });

        // Get instructor IDs
        const instructorIds = subjects
            .filter(s => s.instructorId)
            .map(s => s.instructorId);

        if (instructorIds.length === 0) {
            return res.json([]);
        }

        // Find faculty users
        const faculty = await User.findAll({
            where: {
                id: { [Op.in]: instructorIds },
                role: 'FACULTY'
            },
            attributes: ['id', 'fullName', 'email', 'department']
        });

        // Map faculty to subjects
        const facultyDetails = faculty.map(f => {
            const teaches = subjects
                .filter(s => s.instructorId == f.id)
                .map(s => s.name)
                .join(', ');

            return {
                id: f.id,
                name: f.fullName || 'Unknown Faculty',
                email: f.email,
                department: f.department,
                subjects: teaches
            };
        });

        res.json(facultyDetails);

    } catch (error) {
        console.error('Get student faculty error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
