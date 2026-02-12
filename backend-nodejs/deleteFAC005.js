const { User } = require('./src/models');
const sequelize = require('./src/config/database');

async function deleteFAC005() {
    try {
        console.log('🗑️  Deleting FAC005 user...\n');

        await sequelize.authenticate();
        console.log('✓ Connected to database');

        const deleted = await User.destroy({
            where: { username: 'FAC005' }
        });

        if (deleted) {
            console.log('✅ FAC005 (Sunil Babu H) has been deleted successfully!');
        } else {
            console.log('⚠️  FAC005 not found in database (already deleted)');
        }

        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

deleteFAC005();
