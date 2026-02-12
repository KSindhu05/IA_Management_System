const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { Resource, Subject, User } = require('../models');

// Get all resources (or filter by subject/semester/department)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { subjectId, semester, department, type } = req.query;

        const whereClause = {};
        if (subjectId) whereClause.subjectId = subjectId;
        if (semester) whereClause.semester = semester;
        if (department) whereClause.department = department;
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
        console.error('Get resources error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create new resource
router.post('/', authMiddleware, roleMiddleware('FACULTY', ' HOD', 'PRINCIPAL'), async (req, res) => {
    try {
        const { title, description, type, url, subjectId, semester, department } = req.body;

        const resource = await Resource.create({
            title,
            description,
            type,
            url,
            subjectId,
            semester,
            department,
            uploadedBy: req.user.id
        });

        res.json({ message: 'Resource created successfully', resource });
    } catch (error) {
        console.error('Create resource error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete resource
router.delete('/:id', authMiddleware, roleMiddleware('FACULTY', 'HOD', 'PRINCIPAL'), async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await Resource.findByPk(id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Check if user owns the resource or has admin role
        if (resource.uploadedBy !== req.user.id && !['HOD', 'PRINCIPAL'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await resource.destroy();
        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Delete resource error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
