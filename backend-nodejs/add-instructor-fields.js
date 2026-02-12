const { Subject } = require('./src/models');
const sequelize = require('./src/config/database');

// Faculty assignment mapping based on existing mock data
const facultyAssignments = {
    'Engineering Maths-II': { id: 'M', name: 'Miss Manju Sree' },
    'Communication Skills': { id: 'N', name: 'Nasrin Banu' },
    'CAEG': { id: 'R', name: 'Ramesh Gouda' },
    'Python': { id: 'W', name: 'Wahida Banu' },
    'Indian Constitution': { id: 'S', name: 'Shreedar Singh' },
    'IC': { id: 'W', name: 'Wahida Banu' }
};

async function addInstructorFields() {
    try {
        console.log('🔄 Adding instructor fields to subjects table...\n');

        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Add columns to table (MySQL will execute ALTER TABLE)
        try {
            await sequelize.query(`
                ALTER TABLE subjects 
                ADD COLUMN instructorId VARCHAR(255),
                ADD COLUMN instructorName VARCHAR(255)
            `);
            console.log('✅ Columns added to subjects table\n');
        } catch (error) {
            if (error.original && error.original.errno === 1060) {
                console.log('ℹ️  Columns already exist, skipping...\n');
            } else {
                throw error;
            }
        }

        // Fetch all subjects
        const subjects = await Subject.findAll();
        console.log(`📚 Found ${subjects.length} subjects to update\n`);

        // Update each subject with faculty assignment
        for (const subject of subjects) {
            const faculty = facultyAssignments[subject.name];
            if (faculty) {
                await subject.update({
                    instructorId: faculty.id,
                    instructorName: faculty.name
                });
                console.log(`✅ ${subject.name} → ${faculty.name} (${faculty.id})`);
            } else {
                console.log(`⚠️  ${subject.name} → No faculty assigned`);
            }
        }

        console.log('\n✅ Migration completed successfully!');
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

addInstructorFields();
