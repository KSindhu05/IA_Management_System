const sequelize = require('./config/database');
const { CIEMark, Student, Subject } = require('./models');

async function resetCIEMarks() {
    try {
        console.log('🔄 Starting CIE Marks Reset...\n');

        // Connect to database
        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Find all subjects
        const allSubjects = await Subject.findAll();
        console.log(`Found ${allSubjects.length} subjects\n`);

        // Find subjects for FAC001 (Maths) and FAC002 (CAEG)
        const mathsSubject = allSubjects.find(s => s.name.includes('Maths'));
        const caegSubject = allSubjects.find(s => s.name.includes('CAEG'));

        if (mathsSubject) {
            console.log(`FAC001 Subject: ${mathsSubject.name} (ID: ${mathsSubject.id})`);
        }
        if (caegSubject) {
            console.log(`FAC002 Subject: ${caegSubject.name} (ID: ${caegSubject.id})`);
        }

        const targetSubjectIds = [];
        if (mathsSubject) targetSubjectIds.push(mathsSubject.id);
        if (caegSubject) targetSubjectIds.push(caegSubject.id);

        if (targetSubjectIds.length === 0) {
            console.log('❌ No subjects found for FAC001/FAC002. Exiting.');
            process.exit(1);
        }

        // Delete existing marks for these subjects
        console.log('\n🗑️ Deleting existing marks for FAC001 & FAC002 subjects...');
        const deletedCount = await CIEMark.destroy({
            where: { subjectId: targetSubjectIds }
        });
        console.log(`✓ Deleted ${deletedCount} existing marks\n`);

        // Create new realistic marks
        console.log('📝 Creating realistic CIE marks...\n');

        const students = await Student.findAll();
        console.log(`Found ${students.length} students\n`);

        if (students.length === 0) {
            console.log('❌ No students found. Please add students first.');
            process.exit(1);
        }

        const newMarks = [];

        // Generate marks for each student and each target subject
        for (const subject of targetSubjectIds) {
            const subjectObj = allSubjects.find(s => s.id === subject);
            console.log(`\nGenerating marks for: ${subjectObj?.name || subject}`);

            for (const student of students) {
                // Generate realistic marks for CIE-1 ONLY
                // CIE marks are out of 50. Realistic distribution:
                // - Most students score between 25-45
                // - Some high performers: 45-50
                // - Some low performers: 10-25
                // - Rare absents or very low: 0-10

                // Determine student's performance type based on their ID
                const studentIdNum = student.id % 10;
                let baseScore;

                if (studentIdNum <= 1) {
                    // 20% top performers
                    baseScore = 40 + Math.floor(Math.random() * 10); // 40-49
                } else if (studentIdNum >= 8) {
                    // 20% low performers
                    baseScore = 15 + Math.floor(Math.random() * 15); // 15-29
                } else {
                    // 60% average performers
                    baseScore = 28 + Math.floor(Math.random() * 15); // 28-42
                }

                // Add some variation (±5)
                const variation = Math.floor(Math.random() * 11) - 5;
                let finalScore = Math.min(50, Math.max(0, baseScore + variation));

                // 2% chance of absent (score = 0)
                if (Math.random() < 0.02) {
                    finalScore = 0;
                }

                // Only create CIE-1 marks
                newMarks.push({
                    studentId: student.id,
                    subjectId: subject,
                    cieType: 'CIE1',
                    marks: finalScore,
                    maxMarks: 50,
                    attendance: 75 + Math.floor(Math.random() * 20), // 75-94%
                    status: 'PENDING'
                });
            }
        }

        // Bulk create marks
        console.log(`\n💾 Saving ${newMarks.length} mark records...`);
        await CIEMark.bulkCreate(newMarks);
        console.log('✓ Marks saved successfully!\n');

        // Summary
        console.log('📊 Summary:');
        console.log(`- Subjects updated: ${targetSubjectIds.length}`);
        console.log(`- Students processed: ${students.length}`);
        console.log(`- Total marks created: ${newMarks.length}`);
        console.log(`- CIE-1 marks only (CIE-2 to CIE-5 are empty)\n`);

        console.log('✅ CIE Marks reset completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    resetCIEMarks()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = resetCIEMarks;
