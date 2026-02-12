const sequelize = require('./config/database');
const { CIEMark, Student, Subject } = require('./models');

// Comprehensive CIE-1 data: [regNo, name, maths, mathsAtt, english, engAtt, caeg, caegAtt, python, pythonAtt, phone]
const studentData = [
    ['459CS25001', 'A KAVITHA', 20, 87, 15, 62, 30, 81, 10, 96, '9071407865'],
    ['459CS25002', 'ABHISHEKA', 8, 62, 2, 18, 11, 53, 2, 86, '8197870656'],
    ['459CS25003', 'ADARSH REDDY G', 8, 44, 10, 27, 10, 43, 11, 40, '9182990109'],
    ['459CS25004', 'AGASARA KEERTHANA', 37, 94, 33, 83, 48, 100, 42, 96, '9398963460'],
    ['459CS25005', 'AKHIL S', 49, 94, 40, 89, 44, 100, 42, 96, '8861821741'],
    ['459CS25006', 'AKULA SHASHI KUMAR', 50, 100, 32, 77, 45, 91, 45, 100, '7337826696'],
    ['459CS25007', 'ANAPA LEELA LASYA LAHARI', 46, 88, 48, 71, 39, 96, 48, 96, '9632215458'],
    ['459CS25008', 'ANKITH C', 10, 50, 21, 33, 12, 57, 26, 67, '9964641112'],
    ['459CS25009', 'ANUSHA', 47, 100, 36, 83, 41, 100, 49, 100, '8105423714'],
    ['459CS25010', 'B GURU SAI CHARAN', 50, 94, 42, 83, 39, 91, 46, 84, '9964658745'],
    ['459CS25011', 'B SREENATH', 16, 69, 24, 50, 8, 81, 11, 55, '7411218677'],
    ['459CS25012', 'B VAMSHI', 40, 88, 21, 71, 22, 81, 30, 56, '6361456899'],
    ['459CS25013', 'BASAVARAJA', 39, 75, 35, 68, 44, 81, 35, 84, '8749012076'],
    ['459CS25014', 'BEBE KHUTEJA', 7, 75, 20, 34, 23, 72, 22, 80, '8050387857'],
    ['459CS25015', 'BHUMIKA K', 39, 69, 47, 65, 37, 72, 47, 96, '7619103210'],
    ['459CS25016', 'C ABHINAV', 43, 81, 45, 68, 37, 76, 43, 100, '9886242695'],
    ['459CS25017', 'C D ANNAPOORNA', 20, 100, 26, 86, 42, 91, 38, 100, '9742185010'],
    ['459CS25018', 'C JEEVAN KUMAR', 29, 100, 41, 95, 39, 100, 41, 100, '7204372409'],
    ['459CS25019', 'D LIKHITA', 50, 100, 45, 89, 49, 100, 50, 100, '9845869211'],
    ['459CS25020', 'D PREM KUMAR', 21, 88, 39, 59, 42, 72, 31, 91, '9164717674'],
    ['459CS25021', 'D S YASHODA', 38, 75, 38, 77, 31, 81, 48, 100, '8147405033'],
    ['459CS25022', 'DARSHANI', 49, 88, 35, 77, 44, 100, 37, 96, '9398467849'],
    ['459CS25023', 'DARUR KAVYA', 49, 81, 28, 56, 41, 81, 39, 80, '9390132247'],
    ['459CS25024', 'DASHAVANTH', 15, 81, 15, 62, 34, 81, 15, 76, '9986338788'],
    ['459CS25025', 'DHANESHWARI', 31, 94, 36, 77, 22, 81, 36, 96, '7996120040'],
    ['459CS25026', 'FIRDOUS D', 46, 76, 48, 48, 45, 62, 46, 96, '6360127172'],
    ['459CS25027', 'G ANUSRI', 50, 94, 48, 77, 47, 91, 49, 100, '8105538270'],
    ['459CS25028', 'G M VISHWANATH', 13, 81, 35, 77, 18, 81, 25, 90, '9986072933'],
    ['459CS25029', 'GAGANA PATIL', 47, 88, 48, 83, 48, 100, 43, 90, '9703009416'],
    ['459CS25030', 'GANJALA KUSHAL SAI', 5, 81, 28, 71, 12, 91, 20, 87, '8861218835'],
    ['459CS25031', 'GOUTHAM HEGADE K S', 20, 81, 35, 53, 18, 81, 40, 100, '9731481118'],
    ['459CS25032', 'GOUTHAMI', 48, 100, 35, 83, 45, 100, 49, 100, '9901001777'],
    ['459CS25033', 'GULAM MUSTAFA KHAN', 'A', 44, 'AB', 12, 'AB', 0, 'A', 35, '9945242035'],
    ['459CS25034', 'H D NANDISH NAIK', 49, 88, 36, 74, 40, 100, 41, 80, '9168777525'],
    ['459CS25035', 'H VINAYA PATIL', 1, 100, 9, 92, 4, 100, 9, 100, '9342690869'],
    ['459CS25036', 'HALLI SIDDANA GOUDU', 48, 100, 29, 92, 44, 100, 32, 100, '6363619489'],
    ['459CS25037', 'HANUMANTHA REDDY', 30, 94, 26, 89, 32, 100, 31, 100, '9916739882'],
    ['459CS25038', 'HARI CHARAN K', 10, 69, 28, 50, 20, 71, 31, 80, '9035144971'],
    ['459CS25039', 'HEMANT DWIVEDI', 2, 31, 18, 18, 4, 24, 15, 30, '8808788150'],
    ['459CS25040', 'J SHIVASHANKAR', 49, 100, 46, 89, 30, 100, 32, 100, '8867267769'],
    ['459CS25041', 'K ABHILASH', 45, 100, 29, 83, 45, 100, 38, 100, '6360877334'],
    ['459CS25042', 'K ANANDA', 5, 81, 20, 53, 30, 91, 21, 72, '9148495756'],
    ['459CS25043', 'K HARI PRASAD REDDY', 13, 50, 20, 36, 10, 52, 25, 71, '8546921855'],
    ['459CS25044', 'K JASHWANTH GOWDA', 49, 81, 41, 83, 43, 91, 45, 100, '8147438890'],
    ['459CS25045', 'K JEETHENDRA REDDY', 31, 94, 29, 83, 36, 100, 31, 100, '7676687662'],
    ['459CS25046', 'K KAVYA', 49, 94, 40, 74, 36, 81, 42, 100, '9743844937'],
    ['459CS25047', 'K M MEGHA', 'A', 'A', 'A', 'AB', 'AB', 0, 'A', 0, '8095370824'],
    ['459CS25048', 'K MOUNIKA', 15, 63, 9, 56, 33, 57, 14, 76, '8970247705'],
    ['459CS25049', 'K PRAVEEN KUMAR', 7, 63, 23, 33, 21, 71, 18, 75, '9035978727'],
    ['459CS25050', 'K THARUN', 6, 63, 15, 59, 21, 62, 14, 76, '9663589522'],
    ['459CS25051', 'K VINAY', 6, 69, 9, 39, 30, 71, 25, 80, '9886693299'],
    ['459CS25052', 'KEERTHANA M', 37, 81, 23, 39, 44, 81, 30, 92, '9663357475'],
    ['459CS25053', 'KYADHARI KAVYASRI', 48, 81, 35, 74, 41, 71, 49, 80, '6281695156'],
    ['459CS25054', 'LAKSHA R', 20, 69, 33, 48, 34, 81, 33, 87, '8050996617'],
    ['459CS25055', 'LAKSHMI S', 30, 81, 49, 71, 36, 91, 37, 100, '9008373394'],
    ['459CS25056', 'M AAMIR HAMZA', 50, 81, 35, 95, 31, 86, 30, 100, '7411875119'],
    ['459CS25057', 'M MAHESHA', 48, 100, 30, 95, 18, 91, 32, 100, '9603311547'],
    ['459CS25058', 'M S MOHAMMAD ISMAIL', 'A', 44, 'AB', 18, 'AB', 29, 'A', 68, '9141166696'],
    ['459CS25059', 'M S POORVI', 'A', 'A', 'AB', 'AB', 'AB', 'AB', 'A', 0, '8904393994'],
    ['459CS25060', 'MAHADEVI V', 45, 81, 23, 89, 44, 91, 30, 100, '7483506383'],
    ['459CS25061', 'MANEESHA V M', 45, 81, 42, 71, 38, 91, 44, 87, '7204425993'],
    ['459CS25062', 'MARESHA Y', 'A', 'A', 'AB', 12, 'AB', 0, 'A', 45, '8431904049'],
    ['459CS25063', 'MARUTHI H', 10, 100, 21, 65, 24, 100, 23, 100, '9110646963']
];

async function updateAllCIE1Marks() {
    try {
        console.log('🔄 Starting comprehensive CIE-1 marks update...\n');

        await sequelize.authenticate();
        console.log('✓ Database connected\n');

        // Step 1: Convert all CIE-2 to CIE-1
        console.log('📝 Step 1: Converting all CIE-2 marks to CIE-1...');
        const converted = await CIEMark.update(
            { cieType: 'CIE1' },
            { where: { cieType: 'CIE2' } }
        );
        console.log(`✓ Converted ${converted[0]} marks from CIE-2 to CIE-1\n`);

        // Get subjects
        const allSubjects = await Subject.findAll();
        const mathsSubject = allSubjects.find(s => s.name.includes('Maths'));
        const englishSubject = allSubjects.find(s => s.name.includes('English'));
        const caegSubject = allSubjects.find(s => s.name.includes('CAEG'));
        const pythonSubject = allSubjects.find(s => s.name.includes('Python') || s.name.includes('IC'));

        if (!mathsSubject || !englishSubject || !caegSubject || !pythonSubject) {
            console.log('❌ Required subjects not found');
            process.exit(1);
        }

        console.log('Found subjects:');
        console.log(`  - ${mathsSubject.name}`);
        console.log(`  - ${englishSubject.name}`);
        console.log(`  - ${caegSubject.name}`);
        console.log(`  - ${pythonSubject.name}\n`);

        // Get all students
        const students = await Student.findAll({
            order: [['regNo', 'ASC']]
        });

        console.log(`Found ${students.length} students\n`);

        // Step 2: Delete all existing CIE-1 marks
        console.log('📝 Step 2: Deleting all existing CIE-1 marks...');
        const deleted = await CIEMark.destroy({
            where: { cieType: 'CIE1' }
        });
        console.log(`✓ Deleted ${deleted} existing CIE-1 marks\n`);

        // Step 3: Create new marks from data
        console.log('📝 Step 3: Creating new CIE-1 marks with exact data...\n');
        const newMarks = [];
        let processedCount = 0;

        for (const data of studentData) {
            const [regNo, name, maths, mathsAtt, english, engAtt, caeg, caegAtt, python, pythonAtt, phone] = data;

            // Find student
            const student = students.find(s => s.regNo === regNo);
            if (!student) {
                console.log(`⚠️ Student not found: ${regNo}`);
                continue;
            }

            // Helper function to parse marks and attendance
            const parseMark = (val) => {
                if (val === 'A' || val === 'AB' || val === 'Ab' || val === 'ab') return 0;
                return typeof val === 'number' ? val : parseInt(val) || 0;
            };

            const parseAtt = (val) => {
                if (val === 'A' || val === 'AB' || val === 'Ab' || val === 'ab') return 0;
                return typeof val === 'number' ? val : parseInt(val) || 0;
            };

            // Create marks for all 4 subjects
            newMarks.push(
                // Maths
                {
                    studentId: student.id,
                    subjectId: mathsSubject.id,
                    cieType: 'CIE1',
                    marks: parseMark(maths),
                    maxMarks: 50,
                    attendance: parseAtt(mathsAtt),
                    status: 'PENDING'
                },
                // English
                {
                    studentId: student.id,
                    subjectId: englishSubject.id,
                    cieType: 'CIE1',
                    marks: parseMark(english),
                    maxMarks: 50,
                    attendance: parseAtt(engAtt),
                    status: 'PENDING'
                },
                // CAEG
                {
                    studentId: student.id,
                    subjectId: caegSubject.id,
                    cieType: 'CIE1',
                    marks: parseMark(caeg),
                    maxMarks: 50,
                    attendance: parseAtt(caegAtt),
                    status: 'PENDING'
                },
                // Python
                {
                    studentId: student.id,
                    subjectId: pythonSubject.id,
                    cieType: 'CIE1',
                    marks: parseMark(python),
                    maxMarks: 50,
                    attendance: parseAtt(pythonAtt),
                    status: 'PENDING'
                }
            );

            processedCount++;
            if (processedCount % 10 === 0) {
                console.log(`Processed ${processedCount} students...`);
            }
        }

        // Bulk create
        console.log(`\n💾 Saving ${newMarks.length} mark records...`);
        await CIEMark.bulkCreate(newMarks);
        console.log('✓ All marks saved successfully!\n');

        // Summary
        console.log('📊 Summary:');
        console.log(`- Students processed: ${processedCount}`);
        console.log(`- Total marks created: ${newMarks.length} (${processedCount} × 4 subjects)`);
        console.log(`- Subjects updated: Maths, English, CAEG, Python`);
        console.log(`\n✅ All CIE-1 marks updated successfully with exact data including attendance!`);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    updateAllCIE1Marks()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Error:', err);
            process.exit(1);
        });
}

module.exports = updateAllCIE1Marks;
