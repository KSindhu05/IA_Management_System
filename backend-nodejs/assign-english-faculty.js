const { Subject } = require('./src/models');
const sequelize = require('./src/config/database');

async function assignEnglishFaculty() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Find English Communication subject
        const subject = await Subject.findOne({
            where: { name: 'English Communication' }
        });

        if (subject) {
            await subject.update({
                instructorId: 'N',
                instructorName: 'Nasrin Banu'
            });
            console.log('✅ English Communication → Nasrin Banu (N)');
        } else {
            console.log('❌ English Communication subject not found');
        }

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

assignEnglishFaculty();
