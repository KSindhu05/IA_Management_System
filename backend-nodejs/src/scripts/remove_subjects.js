const { Subject } = require('../models');
const sequelize = require('../config/database');

async function removeSubjects() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Database connected.');

        const subjectsToRemove = [
            'Data Structures',
            'Computer Organization',
            'Discrete Mathematics',
            'Digital Electronics'
        ];

        console.log(`Removing subjects: ${subjectsToRemove.join(', ')}`);

        const result = await Subject.destroy({
            where: {
                name: subjectsToRemove
            }
        });

        console.log(`\n✅ Successfully deleted ${result} subjects from the database.`);

    } catch (error) {
        console.error('❌ Error removing subjects:', error);
    } finally {
        await sequelize.close();
        process.exit();
    }
}

removeSubjects();
