const { Subject } = require('./src/models');
const sequelize = require('./src/config/database');

async function updateICFaculty() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Find Indian Constitution subject
        const subject = await Subject.findOne({
            where: { name: 'Indian Constitution' }
        });

        if (subject) {
            await subject.update({
                instructorId: 'W',
                instructorName: 'Wahida Banu'
            });
            console.log('✅ Indian Constitution → Wahida Banu (W)');
        } else {
            console.log('❌ Indian Constitution subject not found');
        }

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateICFaculty();
