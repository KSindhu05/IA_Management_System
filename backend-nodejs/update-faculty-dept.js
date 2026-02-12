const { Sequelize } = require('sequelize');
const sequelize = require('./src/config/database');
const { User } = require('./src/models');

async function updateFacultyDepartments() {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connected');

        // Update all faculty users to Computer Science department
        const [affectedCount] = await User.update(
            { department: 'Computer Science' },
            {
                where: {
                    role: 'FACULTY'
                }
            }
        );

        console.log(`✓ Updated ${affectedCount} faculty members to Computer Science department`);

        // Verify the changes
        const facultyList = await User.findAll({
            where: { role: 'FACULTY' },
            attributes: ['username', 'fullName', 'department']
        });

        console.log('\n--- Faculty Members ---');
        facultyList.forEach(f => {
            console.log(`- ${f.fullName || f.username} (${f.username}): ${f.department}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

updateFacultyDepartments();
