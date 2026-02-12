const { Subject } = require('./src/models');
const sequelize = require('./src/config/database');

async function listSubjects() {
    try {
        console.log('📚 Listing all subjects in database...\n');

        await sequelize.authenticate();

        const subjects = await Subject.findAll();

        if (subjects.length === 0) {
            console.log('No subjects found!');
        } else {
            console.log('Code        | Name                               | Dept | Sem');
            console.log('------------------------------------------------------------');
            subjects.forEach(s => {
                console.log(`${s.code.padEnd(12)} | ${s.name.padEnd(35)} | ${s.department}   | ${s.semester}`);
            });
        }

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

listSubjects();
