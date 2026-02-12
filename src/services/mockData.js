// Mock Data for Frontend Development (No Backend Required)
// Set USE_MOCK = true to use mock data, false to use real API

export const USE_MOCK = false;

// Mock Users
export const mockUsers = {
    principal: { id: 1, username: 'principal', role: 'PRINCIPAL', token: 'mock-token-principal' },
    hod_cs: { id: 2, username: 'hod_cs', role: 'HOD', associatedId: 'CS', token: 'mock-token-hod' },
    faculty_cs: { id: 3, username: 'faculty_cs', role: 'FACULTY', associatedId: 'CS', token: 'mock-token-faculty' },
    '459CS23001': { id: 4, username: '459CS23001', role: 'STUDENT', associatedId: '459CS23001', token: 'mock-token-student' }
};

// Mock Students
export const mockStudents = [
    { id: 1, regNo: '459CS23001', name: 'A KAVITHA', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9071407865' },
    { id: 2, regNo: '459CS23002', name: 'ABHISHEKA', department: 'CS', semester: '2nd', section: 'A', phoneNo: '8197870656' },
    { id: 3, regNo: '459CS23003', name: 'ADARSH REDDY G', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9182990109' },
    { id: 4, regNo: '459CS23004', name: 'AGASARA KEERTHANA', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9494061680' },
    { id: 5, regNo: '459CS23005', name: 'AKHIL S', department: 'CS', semester: '2nd', section: 'A', phoneNo: '8861821741' },
    { id: 6, regNo: '459CS23006', name: 'AKULA SHASHI KUMAR', department: 'CS', semester: '2nd', section: 'A', phoneNo: '7337820690' },
    { id: 7, regNo: '459CS23007', name: 'ANAPA LEELA LASYA LAHARI', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9392215458' },
    { id: 8, regNo: '459CS23008', name: 'ANKITH C', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9564641112' },
    { id: 9, regNo: '459CS23009', name: 'ANUSHA', department: 'CS', semester: '2nd', section: 'A', phoneNo: '8105423714' },
    { id: 10, regNo: '459CS23010', name: 'B GURU SAI CHARAN', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9564658745' },
    { id: 11, regNo: '459CS23011', name: 'B SREENATH', department: 'CS', semester: '2nd', section: 'A', phoneNo: '7411218677' },
    { id: 12, regNo: '459CS23012', name: 'B VAMSHI', department: 'CS', semester: '2nd', section: 'A', phoneNo: '6361450899' },
    { id: 13, regNo: '459CS23013', name: 'BASAVARAJA', department: 'CS', semester: '2nd', section: 'A', phoneNo: '8495012076' },
    { id: 14, regNo: '459CS23014', name: 'BEBE KHUTEJA', department: 'CS', semester: '2nd', section: 'A', phoneNo: '8050887857' },
    { id: 15, regNo: '459CS23015', name: 'BHUMIKA K', department: 'CS', semester: '2nd', section: 'A', phoneNo: '7619103210' },
    { id: 16, regNo: '459CS23016', name: 'C ABHINAV', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9380242695' },
    { id: 17, regNo: '459CS23017', name: 'C D ANNAPOORNA', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9742183010' },
    { id: 18, regNo: '459CS23018', name: 'C JEEVAN KUMAR', department: 'CS', semester: '2nd', section: 'A', phoneNo: '7204372409' },
    { id: 19, regNo: '459CS23019', name: 'D LIKHITA', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9845865211' },
    { id: 20, regNo: '459CS23020', name: 'D PREM KUMAR', department: 'CS', semester: '2nd', section: 'A', phoneNo: '9164717674' }
];

// Mock Subjects
export const mockSubjects = [
    { id: 1, code: 'SC202T', name: 'Engineering Maths-II', department: 'CS', semester: '2nd', maxMarks: 50, type: 'Theory' },
    { id: 2, code: 'HU201T', name: 'English Communication', department: 'CS', semester: '2nd', maxMarks: 50, type: 'Theory' },
    { id: 3, code: 'ME201T', name: 'CAEG', department: 'CS', semester: '2nd', maxMarks: 50, type: 'Lab' },
    { id: 4, code: 'CS201T', name: 'Python', department: 'CS', semester: '2nd', maxMarks: 50, type: 'Lab' }
];

// Mock Marks (CIE-1 only for now)
export const mockMarks = [
    { studentId: 1, subjectId: 1, subjectName: 'Engineering Maths-II', cie1: 30, cie2: 0, cie3: 0, cie4: 0, cie5: 0 },
    { studentId: 1, subjectId: 2, subjectName: 'English Communication', cie1: 30, cie2: 0, cie3: 0, cie4: 0, cie5: 0 },
    { studentId: 1, subjectId: 3, subjectName: 'CAEG', cie1: 30, cie2: 0, cie3: 0, cie4: 0, cie5: 0 },
    { studentId: 1, subjectId: 4, subjectName: 'Python', cie1: 20, cie2: 0, cie3: 0, cie4: 0, cie5: 0 }
];

// Mock Notifications
export const mockNotifications = [
    { id: 1, title: 'CIE-1 Scheduled', message: 'Engineering Maths-II CIE-1 on Feb 15, 2026', type: 'CIE_ANNOUNCEMENT', isRead: false, createdAt: '2026-02-06' },
    { id: 2, title: 'Marks Published', message: 'Python CIE-1 marks are now available', type: 'MARKS_PUBLISHED', isRead: true, createdAt: '2026-02-05' }
];

// Mock Announcements
export const mockAnnouncements = [
    { id: 1, subjectName: 'Engineering Maths-II', cieNumber: 1, scheduledDate: '2026-02-15', syllabus: 'Unit 1 & 2', status: 'SCHEDULED' },
    { id: 2, subjectName: 'Python', cieNumber: 1, scheduledDate: '2026-02-18', syllabus: 'Chapters 1-5', status: 'SCHEDULED' }
];

// Mock API Functions
export const mockLogin = (username, password) => {
    const user = mockUsers[username];
    if (user && password === 'password') {
        return { success: true, ...user };
    }
    return { success: false, error: 'Invalid credentials' };
};

export const mockGetStudentMarks = (regNo) => {
    const student = mockStudents.find(s => s.regNo === regNo);
    return { student, marks: mockMarks };
};

export const mockGetStudents = () => mockStudents;
export const mockGetSubjects = () => mockSubjects;
export const mockGetNotifications = () => mockNotifications;
export const mockGetAnnouncements = () => mockAnnouncements;
