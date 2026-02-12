const sequelize = require('./config/database');
const { CIEMark, Student, Subject } = require('./models');

// Exact CIE-2 marks for Python in student registration order
const pythonMarks = [
    10, 9, 11, 42, 42, 45, 48, 26, 49, 11,
    39, 35, 22, 47, 43, 38, 41, 50, 31, 48,
    37, 49, 15, 36, 46, 49, 23, 43, 26, 40,
    49, 4, 41, 9, 32, 31, 31, 15, 32, 21,
    25, 45, 31, 42, 11, 14, 18, 14, 25, 33,
    49, 37, 30, 32, 'A', 11, 44, 0, 23
];

async function updatePythonCIE2() {
    try {
        console.log('🔄 Starting Python CIE-2 Update...\n');

        // Connect to database
        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Find Python subject (could be "Python" or "Python Programming" or "IC")
        const allSubjects = await Subject.findAll();
        const pythonSubject = allSubjects.find(s =>
            s.name.includes('Python') || s.name.includes('IC')
        );

        if (!pythonSubject) {
            console.log('❌ Python subject not found. Available subjects:');
            allSubjects.forEach(s => console.log(`  - ${s.name}`));
            process.exit(1);
        }

        console.log(`Found subject: ${pythonSubject.name} (ID: ${pythonSubject.id})\n`);

        // Get all students ordered by registration number
        const students = await Student.findAll({
            order: [['regNo', 'ASC']]
        });

        console.log(`Found ${students.length} students\n`);

        if (students.length < pythonMarks.length) {
            console.log(`⚠️ Warning: ${students.length} students but ${pythonMarks.length} marks provided`);
        }

        // Delete existing CIE-2 marks for Python
        console.log('🗑️ Deleting existing CIE-2 marks for Python...');
        const deletedCount = await CIEMark.destroy({
            where: {
                subjectId: pythonSubject.id,
                cieType: 'CIE2'
            }
        });
        console.log(`✓ Deleted ${deletedCount} existing marks\n`);

        // Create new marks with exact data
        console.log('📝 Creating new CIE-2 marks...\n');
        const newMarks = [];

        for (let i = 0; i < Math.min(students.length, pythonMarks.length); i++) {
            const student = students[i];
            const mark = pythonMarks[i];

            // Convert 'A' (absent) to 0
            const isAbsent = mark === 'A' || mark === 'a' || mark === 'AB' || mark === 'ab';
            const finalMark = isAbsent ? 0 : mark;

            newMarks.push({
                studentId: student.id,
                subjectId: pythonSubject.id,
                cieType: 'CIE2',
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
        console.log(`- Subject: ${pythonSubject.name}`);
        console.log(`- Students processed: ${newMarks.length}`);
        console.log(`- Average marks: ${avgMark.toFixed(2)}`);
        console.log(`- Absent students: ${absentCount}`);
        console.log(`- Top scorers (≥45): ${topScorers}\n`);

        console.log('✅ Python CIE-2 update completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    updatePythonCIE2()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = updatePythonCIE2;
