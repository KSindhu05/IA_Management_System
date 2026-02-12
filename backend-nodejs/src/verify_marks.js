const sequelize = require('./config/database');
const { CIEMark, Student, Subject } = require('./models');

async function verifyMarks() {
    try {
        console.log('🔍 Verifying stored CIE-1 marks...\n');

        await sequelize.authenticate();
        console.log('✓ Connected to database\n');

        // Find subjects
        const allSubjects = await Subject.findAll();
        const mathsSubject = allSubjects.find(s => s.name.includes('Maths'));
        const caegSubject = allSubjects.find(s => s.name.includes('CAEG'));

        // Get marks for Engineering Maths
        if (mathsSubject) {
            console.log('📊 ENGINEERING MATHS-II CIE-1 MARKS:');
            console.log('=====================================');
            const mathsMarks = await CIEMark.findAll({
                where: {
                    subjectId: mathsSubject.id,
                    cieType: 'CIE1'
                },
                include: [{ model: Student, as: 'student' }],
                order: [[{ model: Student, as: 'student' }, 'regNo', 'ASC']]
            });

            console.log(`Total records: ${mathsMarks.length}\n`);
            console.log('First 10 students:');
            mathsMarks.slice(0, 10).forEach((mark, idx) => {
                console.log(`${idx + 1}. ${mark.student.regNo} - ${mark.student.name}: ${mark.marks}/50`);
            });

            const avgMaths = mathsMarks.reduce((sum, m) => sum + m.marks, 0) / mathsMarks.length;
            const absentMaths = mathsMarks.filter(m => m.marks === 0).length;
            console.log(`\nAverage: ${avgMaths.toFixed(2)}/50`);
            console.log(`Absent: ${absentMaths} students\n`);
        }

        // Get marks for CAEG
        if (caegSubject) {
            console.log('📊 CAEG CIE-1 MARKS:');
            console.log('====================');
            const caegMarks = await CIEMark.findAll({
                where: {
                    subjectId: caegSubject.id,
                    cieType: 'CIE1'
                },
                include: [{ model: Student, as: 'student' }],
                order: [[{ model: Student, as: 'student' }, 'regNo', 'ASC']]
            });

            console.log(`Total records: ${caegMarks.length}\n`);
            console.log('First 10 students:');
            caegMarks.slice(0, 10).forEach((mark, idx) => {
                console.log(`${idx + 1}. ${mark.student.regNo} - ${mark.student.name}: ${mark.marks}/50`);
            });

            const avgCaeg = caegMarks.reduce((sum, m) => sum + m.marks, 0) / caegMarks.length;
            const absentCaeg = caegMarks.filter(m => m.marks === 0).length;
            console.log(`\nAverage: ${avgCaeg.toFixed(2)}/50`);
            console.log(`Absent: ${absentCaeg} students\n`);
        }

        console.log('✅ Verification complete! All marks are stored in the database.');

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    verifyMarks()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = verifyMarks;
