const sequelize = require('./config/database');
const { CIEMark, Student, Subject } = require('./models');

// Exact CIE-1 marks for Engineering Maths in student registration order
const mathsMarks = [
    20, 8, 8, 37, 40, 50, 40, 10, 47, 50,
    16, 40, 39, 7, 39, 43, 20, 29, 50, 21,
    38, 49, 15, 31, 46, 50, 13, 47, 5, 20,
    48, 8, 49, 1, 48, 30, 10, 2, 45, 45,
    5, 13, 49, 31, 49, 21, 15, 7, 8, 8,
    37, 48, 20, 30, 50, 48, 'A', 24, 45, 45,
    4, 10
];

async function updateMathsCIE1() {
    try {
        console.log('🔄 Starting Engineering Maths CIE-1 Update...\n');

        // Connect to database
        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Find Engineering Maths subject
        const allSubjects = await Subject.findAll();
        const mathsSubject = allSubjects.find(s => s.name.includes('Maths'));

        if (!mathsSubject) {
            console.log('❌ Engineering Maths subject not found. Exiting.');
            process.exit(1);
        }

        console.log(`Found subject: ${mathsSubject.name} (ID: ${mathsSubject.id})\n`);

        // Get all students ordered by registration number
        const students = await Student.findAll({
            order: [['regNo', 'ASC']]
        });

        console.log(`Found ${students.length} students\n`);

        if (students.length !== mathsMarks.length) {
            console.log(`⚠️ Warning: ${students.length} students but ${mathsMarks.length} marks provided`);
        }

        // Delete existing CIE-1 marks for Engineering Maths
        console.log('🗑️ Deleting existing CIE-1 marks for Engineering Maths...');
        const deletedCount = await CIEMark.destroy({
            where: {
                subjectId: mathsSubject.id,
                cieType: 'CIE1'
            }
        });
        console.log(`✓ Deleted ${deletedCount} existing marks\n`);

        // Create new marks with exact data
        console.log('📝 Creating new CIE-1 marks...\n');
        const newMarks = [];

        for (let i = 0; i < Math.min(students.length, mathsMarks.length); i++) {
            const student = students[i];
            const mark = mathsMarks[i];

            // Convert 'A' (absent) to 0
            const finalMark = mark === 'A' || mark === 'a' ? 0 : mark;

            newMarks.push({
                studentId: student.id,
                subjectId: mathsSubject.id,
                cieType: 'CIE1',
                marks: finalMark,
                maxMarks: 50,
                attendance: mark === 'A' || mark === 'a' ? 0 : 85, // Lower attendance for absent students
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
        console.log(`- Subject: ${mathsSubject.name}`);
        console.log(`- Students processed: ${newMarks.length}`);
        console.log(`- Average marks: ${avgMark.toFixed(2)}`);
        console.log(`- Absent students: ${absentCount}`);
        console.log(`- Top scorers (≥45): ${topScorers}\n`);

        console.log('✅ Engineering Maths CIE-1 update completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    updateMathsCIE1()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = updateMathsCIE1;
