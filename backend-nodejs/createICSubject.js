const { Subject } = require('./src/models');
const sequelize = require('./src/config/database');

async function createICSubject() {
    try {
        console.log('➕ Creating "IC" Subject...\n');

        await sequelize.authenticate();

        // Check if already exists
        const existing = await Subject.findOne({ where: { name: 'Indian Constitution' } });
        if (existing) {
            console.log('⚠️  Subject "Indian Constitution" already exists.');
        } else {
            const newSubject = await Subject.create({
                name: 'Indian Constitution',
                code: 'IC',
                department: 'CS',
                semester: '2',
                credits: 1 // Assuming 1 credit for IC
            });
            console.log(`✅ Created subject: ${newSubject.name} (${newSubject.code})`);
        }

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createICSubject();
