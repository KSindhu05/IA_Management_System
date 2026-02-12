const sequelize = require('./config/database');
const { CIEMark, Subject } = require('./models');

async function convertAllCIE1toCIE2() {
    try {
        console.log('🔄 Converting ALL CIE-1 marks to CIE-2 (all subjects)...\n');

        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Get count before conversion
        const beforeCount = await CIEMark.count({
            where: { cieType: 'CIE1' }
        });

        console.log(`📊 Found ${beforeCount} CIE-1 marks across all subjects\n`);

        if (beforeCount === 0) {
            console.log('✅ No CIE-1 marks found. All marks are already CIE-2 or other types.');
            process.exit(0);
        }

        console.log('📝 Converting all CIE-1 marks to CIE-2...');

        // Update ALL CIE-1 marks to CIE-2 (across all subjects)
        const updated = await CIEMark.update(
            { cieType: 'CIE2' },
            {
                where: { cieType: 'CIE1' }
            }
        );

        console.log(`✓ Successfully updated ${updated[0]} marks\n`);

        // Verify conversion
        const afterCount = await CIEMark.count({
            where: { cieType: 'CIE1' }
        });

        console.log('📊 Summary:');
        console.log(`- CIE-1 marks before: ${beforeCount}`);
        console.log(`- CIE-1 marks after: ${afterCount}`);
        console.log(`- Marks converted: ${updated[0]}\n`);

        if (afterCount === 0) {
            console.log('✅ All CIE-1 marks successfully converted to CIE-2!');
        } else {
            console.log(`⚠️ Warning: ${afterCount} CIE-1 marks still remain`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    convertAllCIE1toCIE2()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = convertAllCIE1toCIE2;
