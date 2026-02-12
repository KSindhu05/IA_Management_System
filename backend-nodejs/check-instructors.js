const { Subject } = require('./src/models');
const sequelize = require('./src/config/database');

async function checkSubjects() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        const subjects = await Subject.findAll({
            where: { department: 'CS' }
        });

        console.log('CS Department Subjects:\n');
        console.log('ID | Name                    | Code    | Instructor ID | Instructor Name');
        console.log('-----------------------------------------------------------------------------');
        subjects.forEach(s => {
            console.log(`${s.id.toString().padEnd(3)} | ${s.name.padEnd(24)} | ${(s.code || '').padEnd(8)} | ${(s.instructorId || 'NULL').padEnd(13)} | ${s.instructorName || 'NULL'}`);
        });

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkSubjects();
