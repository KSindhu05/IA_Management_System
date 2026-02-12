const { Sequelize } = require('sequelize');
const sequelize = require('./src/config/database');
const { Student, CIEMark, Subject } = require('./src/models');

async function checkStudentMarks() {
    try {
        await sequelize.authenticate();
        console.log('✓ Database connected');

        const regNo = '459CS25001';
        const student = await Student.findOne({ where: { regNo } });

        if (!student) {
            console.log(`❌ Student ${regNo} not found`);
            return;
        }

        console.log(`✓ Found Student: ${student.name} (ID: ${student.id})`);

        const allMarks = await CIEMark.findAll({
            where: { studentId: student.id },
            include: [{ model: Subject, as: 'subject' }]
        });

        const approvedMarks = allMarks.filter(m => m.status === 'APPROVED');
        console.log(`Approved Marks: ${approvedMarks.length}`);

        if (approvedMarks.length > 0) {
            console.log('\n--- Approved Marks Details ---');
            approvedMarks.forEach(m => {
                console.log(`- Subject: ${m.subject?.name}`);
                console.log(`  Code: "${m.subject?.code}"`);
                console.log(`  Semester: "${m.subject?.semester}" (Type: ${typeof m.subject?.semester})`);
                console.log(`  Credits: ${m.subject?.credits}`);
                console.log(`  Marks: ${m.marks}`);
            });
        } else {
            console.log('No APPROVED marks found.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkStudentMarks();
