
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const sequelize = require('./src/config/database');
const CIEMark = require('./src/models/cieMark');

async function fixMarks() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        console.log('Updating marks to be more realistic...');

        // Fetch all marks
        const marks = await CIEMark.findAll();

        let updated = 0;
        for (const mark of marks) {
            // Generate a more realistic mark
            // 80% chance of passing (20-50), 20% chance of fail (0-19)
            // Bias towards 30-45
            let newMark;
            const rand = Math.random();

            if (rand > 0.15) {
                // Pass: 20 to 50
                // Bias towards higher end
                newMark = Math.floor(Math.random() * (50 - 25 + 1)) + 25;
            } else {
                // Fail: 5 to 19
                newMark = Math.floor(Math.random() * (19 - 5 + 1)) + 5;
            }

            mark.marks = newMark;
            await mark.save();
            updated++;

            if (updated % 500 === 0) console.log(`Updated ${updated} records...`);
        }

        console.log(`Successfully updated ${updated} records.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

fixMarks();
