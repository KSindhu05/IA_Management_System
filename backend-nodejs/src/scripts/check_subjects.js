const { Subject } = require('../models');
const sequelize = require('../config/database');

async function listSubjects() {
    try {
        await sequelize.authenticate();
        const subjects = await Subject.findAll();
        console.log('\n--- Current Subjects ---');
        if (subjects.length === 0) {
            console.log('No subjects found.');
        } else {
            subjects.forEach(s => console.log(`- ${s.name} (${s.code})`));
        }
        console.log('------------------------\n');
    } catch (error) {
        console.error('Error fetching subjects:', error);
    } finally {
        await sequelize.close();
    }
}

listSubjects();
