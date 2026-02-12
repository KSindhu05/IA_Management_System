const sequelize = require('./config/database');
const { CIEMark, Subject } = require('./models');

async function convertCIE1toCIE2() {
    try {
        console.log('🔄 Converting CIE-1 marks to CIE-2...\n');

        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Find Engineering Maths and CAEG subjects
        const allSubjects = await Subject.findAll();
        const mathsSubject = allSubjects.find(s => s.name.includes('Maths'));
        const caegSubject = allSubjects.find(s => s.name.includes('CAEG'));

        if (!mathsSubject || !caegSubject) {
            console.log('❌ Required subjects not found');
            process.exit(1);
        }

        console.log('📝 Updating marks...');

        // Update Engineering Maths marks from CIE1 to CIE2
        const mathsUpdated = await CIEMark.update(
            { cieType: 'CIE2' },
            {
                where: {
                    subjectId: mathsSubject.id,
                    cieType: 'CIE1'
                }
            }
        );

        console.log(`✓ Engineering Maths: ${mathsUpdated[0]} marks updated to CIE-2`);

        // Update CAEG marks from CIE1 to CIE2
        const caegUpdated = await CIEMark.update(
            { cieType: 'CIE2' },
            {
                where: {
                    subjectId: caegSubject.id,
                    cieType: 'CIE1'
                }
            }
        );

        console.log(`✓ CAEG: ${caegUpdated[0]} marks updated to CIE-2\n`);

        console.log('📊 Summary:');
        console.log(`- Total marks updated: ${mathsUpdated[0] + caegUpdated[0]}`);
        console.log(`- Engineering Maths: ${mathsUpdated[0]} records`);
        console.log(`- CAEG: ${caegUpdated[0]} records\n`);

        console.log('✅ All marks successfully converted from CIE-1 to CIE-2!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    convertCIE1toCIE2()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = convertCIE1toCIE2;
