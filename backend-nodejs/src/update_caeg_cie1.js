const sequelize = require('./config/database');
const { CIEMark, Student, Subject } = require('./models');

// Exact CIE-1 marks for CAEG in student registration order
const caegMarks = [
    30, 11, 10, 48, 44, 45, 39, 12, 41, 39,
    8, 22, 44, 23, 37, 37, 42, 39, 49, 42,
    31, 41, 34, 22, 45, 47, 18, 48, 12, 18,
    45, 35, 40, 44, 32, 20, 4, 30, 45, 38,
    10, 43, 36, 36, 48, 33, 21, 21, 30, 44,
    41, 34, 36, 31, 18, 'AB', 'AB', 44, 38, 49,
    'AB', 24
];

async function updateCAEGCIE1() {
    try {
        console.log('🔄 Starting CAEG CIE-1 Update...\n');

        // Connect to database
        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Find CAEG subject
        const allSubjects = await Subject.findAll();
        const caegSubject = allSubjects.find(s => s.name.includes('CAEG'));

        if (!caegSubject) {
            console.log('❌ CAEG subject not found. Exiting.');
            process.exit(1);
        }

        console.log(`Found subject: ${caegSubject.name} (ID: ${caegSubject.id})\n`);

        // Get all students ordered by registration number
        const students = await Student.findAll({
            order: [['regNo', 'ASC']]
        });

        console.log(`Found ${students.length} students\n`);

        if (students.length !== caegMarks.length) {
            console.log(`⚠️ Warning: ${students.length} students but ${caegMarks.length} marks provided`);
        }

        // Delete existing CIE-1 marks for CAEG
        console.log('🗑️ Deleting existing CIE-1 marks for CAEG...');
        const deletedCount = await CIEMark.destroy({
            where: {
                subjectId: caegSubject.id,
                cieType: 'CIE1'
            }
        });
        console.log(`✓ Deleted ${deletedCount} existing marks\n`);

        // Create new marks with exact data
        console.log('📝 Creating new CIE-1 marks...\n');
        const newMarks = [];

        for (let i = 0; i < Math.min(students.length, caegMarks.length); i++) {
            const student = students[i];
            const mark = caegMarks[i];

            // Convert 'AB' (absent) to 0
            const isAbsent = mark === 'AB' || mark === 'Ab' || mark === 'ab' || mark === 'A';
            const finalMark = isAbsent ? 0 : mark;

            newMarks.push({
                studentId: student.id,
                subjectId: caegSubject.id,
                cieType: 'CIE1',
                marks: finalMark,
                maxMarks: 50,
                attendance: isAbsent ? 0 : 85, // Lower attendance for absent students
                status: 'PENDING'
            });

            // Log progress every 10 students
            if ((i + 1) % 10 === 0) {
                console.log(`Processed ${i + 1} students...`);
            }
        }

        // Bulk create marks
        console.log(`\n💾 Saving ${newMarks.length} mark records...`);
        await CIEMark.bulkCreate(newMarks);
        console.log('✓ Marks saved successfully!\n');

        // Summary statistics
        const totalMarks = newMarks.reduce((sum, m) => sum + (m.marks || 0), 0);
        const avgMark = totalMarks / newMarks.length;
        const absentCount = newMarks.filter(m => m.marks === 0).length;
        const topScorers = newMarks.filter(m => m.marks >= 45).length;

        console.log('📊 Summary:');
        console.log(`- Subject: ${caegSubject.name}`);
        console.log(`- Students processed: ${newMarks.length}`);
        console.log(`- Average marks: ${avgMark.toFixed(2)}`);
        console.log(`- Absent students: ${absentCount}`);
        console.log(`- Top scorers (≥45): ${topScorers}\n`);

        console.log('✅ CAEG CIE-1 update completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    updateCAEGCIE1()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = updateCAEGCIE1;
