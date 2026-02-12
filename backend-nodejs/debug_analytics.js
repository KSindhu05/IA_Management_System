
const { Sequelize, DataTypes, Op } = require('sequelize');
require('dotenv').config();
const sequelize = require('./src/config/database');
const CIEMark = require('./src/models/cieMark');
const Subject = require('./src/models/Subject');

async function debugAnalytics() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const dept = 'CS';
        console.log(`Analyzing for Department: ${dept}`);

        const marks = await CIEMark.findAll({
            include: [{
                model: Subject,
                as: 'subject',
                where: { department: dept }
            }]
        });

        console.log(`Total Marks Records Found: ${marks.length}`);

        if (marks.length === 0) {
            console.log('No marks found. Analytics will be 0.');
            return;
        }

        let totalMarks = 0;
        let passedCount = 0;
        let atRiskCount = 0;
        const PASS_THRESHOLD = 20;
        const RISK_THRESHOLD = 18;

        marks.forEach(mark => {
            const score = mark.marks || 0;
            totalMarks += score;

            if (score >= PASS_THRESHOLD) passedCount++;
            if (score < RISK_THRESHOLD) atRiskCount++;
        });

        const average = (totalMarks / marks.length).toFixed(1);
        const passPercentage = ((passedCount / marks.length) * 100).toFixed(1);

        console.log('--- Calculated Stats ---');
        console.log(`Average Score: ${average}`);
        console.log(`Pass Percentage: ${passPercentage}%`);
        console.log(`At Risk Count: ${atRiskCount}`);

        console.log('--- Sample Data (First 5) ---');
        marks.slice(0, 5).forEach(m => {
            console.log(`Subject: ${m.subject.name}, Mark: ${m.marks}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

debugAnalytics();
