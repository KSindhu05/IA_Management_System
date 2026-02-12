const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { User, Subject } = require('../models');

// HOD dashboard
router.get('/dashboard', authMiddleware, roleMiddleware('HOD'), (req, res) => {
    res.json({
        message: 'HOD dashboard',
        user: req.user
    });
});

// Get Faculty List (with optional department filter)
router.get('/faculty', authMiddleware, roleMiddleware('HOD', 'PRINCIPAL'), async (req, res) => {
    try {
        const { department } = req.query;
        const whereClause = { role: 'FACULTY' };
        if (department) {
            whereClause.department = department;
        }

        const faculty = await User.findAll({
            where: whereClause,
            attributes: ['id', 'username', 'email', 'department']
        });

        // Enhance with subjects mapping
        const formatted = await Promise.all(faculty.map(async f => {
            const subjects = await Subject.findAll({ where: { instructorId: f.id } });
            return {
                id: f.id,
                username: f.username,
                fullName: f.username, // Using username as name if no fullName field
                department: f.department || 'General',
                designation: 'Faculty', // Placeholder
                subjects: subjects.map(s => s.name)
            };
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Get faculty error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
