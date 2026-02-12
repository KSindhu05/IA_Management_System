const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { Notification } = require('../models');

// Get user notifications
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { isRead, limit = 50 } = req.query;

        const whereClause = { userId };
        if (isRead !== undefined) {
            whereClause.isRead = isRead === 'true';
        }

        const notifications = await Notification.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit)
        });

        res.json(notifications);
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create notification (admin/system use)
router.post('/', authMiddleware, roleMiddleware('HOD', 'PRINCIPAL', 'FACULTY'), async (req, res) => {
    try {
        const { userId, message, type, link, category } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const notification = await Notification.create({
            userId,
            message,
            type: type || 'INFO',
            link,
            category
        });

        res.json({ message: 'Notification created', notification });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOne({
            where: { id, userId }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.update({ isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Mark all as read
router.put('/read-all', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.update(
            { isRead: true },
            { where: { userId, isRead: false } }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get unread count
router.get('/unread/count', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await Notification.count({
            where: { userId, isRead: false }
        });

        res.json({ count });
    } catch (error) {
        console.error('Unread count error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
