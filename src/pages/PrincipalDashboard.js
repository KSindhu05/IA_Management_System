import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import styles from './PrincipalDashboard.module.css';
import {
    LayoutDashboard, Users, ShieldCheck, Calendar, BarChart2,
    Briefcase, Bell, AlertTriangle, FileText, Building, LogOut
} from 'lucide-react';
import headerLogo from '../assets/header_logo.png';

// Import Extracted Components
import { ToastNotification, SimpleModal } from '../components/dashboard/principal/Shared';
import { StudentSentinel } from '../components/dashboard/principal/Widgets';
import OverviewSection from '../components/dashboard/principal/OverviewSection';
import ComplianceSection from '../components/dashboard/principal/ComplianceSection';
import DepartmentSection from '../components/dashboard/principal/DepartmentSection';
// import FacultySection from '../components/dashboard/principal/FacultySection'; // Replaced by FacultyDirectorySection
import { DirectorySection } from '../components/dashboard/principal/DirectorySection';
import {
    FacultyDirectorySection, TimetablesSection, CircularsSection,
    ReportsSection, GrievancesSection
} from '../components/dashboard/principal/SectionComponents';

import {
    fetchPrincipalDashboard, fetchAllFaculty, fetchTimetables,
    fetchCirculars, fetchReports, fetchGrievances
} from '../services/api';

const PrincipalDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    // Data States
    const [dashboardData, setDashboardData] = useState(null);
    const [facultyList, setFacultyList] = useState([]);
    const [timetables, setTimetables] = useState([]);
    const [circulars, setCirculars] = useState([]);
    const [reports, setReports] = useState([]);
    const [grievances, setGrievances] = useState([]);

    const [loading, setLoading] = useState(true);

    // Directory State
    const [selectedDept, setSelectedDept] = useState(null);
    const [deptStudents, setDeptStudents] = useState([]);

    // Interaction State
    const [toast, setToast] = useState({ show: false, msg: '', type: 'info' });
    const [activeModal, setActiveModal] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch All Data
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const token = user?.token;
                setLoading(true);

                // Parallel fetching of all required data
                const [
                    dashData,
                    faculty,
                    times,
                    circs,
                    reps,
                    grievs
                ] = await Promise.all([
                    fetchPrincipalDashboard(token),
                    fetchAllFaculty(token),
                    fetchTimetables(token),
                    fetchCirculars(token),
                    fetchReports(token),
                    fetchGrievances(token)
                ]);

                if (dashData) setDashboardData(dashData);
                if (faculty) setFacultyList(faculty);
                if (times) setTimetables(times);
                if (circs) setCirculars(circs);
                if (reps) setReports(reps);
                if (grievs) setGrievances(grievs);

            } catch (error) {
                console.error("Failed to load dashboard data", error);
                showToast("Failed to load live data", "error");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const showToast = useCallback((msg, type = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast({ show: false, msg: '', type: 'info' }), 3000);
    }, []);

    const handleDownload = useCallback((item) => showToast(`Downloading ${item.name || 'document'}...`, 'info'), [showToast]);
    const handleNewBroadcast = useCallback(() => setActiveModal('broadcast'), []);
    const handleSaveFaculty = useCallback((e) => { e.preventDefault(); setActiveModal(null); showToast('Faculty Saved', 'success'); }, [showToast]);

    // MENU ITEMS
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'departments', label: 'Departments', icon: Building },
        { id: 'faculty', label: 'Faculty Directory', icon: Briefcase },
        { id: 'directory', label: 'Student Search', icon: Users },
        { id: 'timetables', label: 'Time Tables', icon: Calendar },
        { id: 'compliance', label: 'CIE Compliance', icon: ShieldCheck },
        { id: 'reports', label: 'Reports & Analytics', icon: FileText },
        { id: 'circulars', label: 'Circulars', icon: Bell },
        { id: 'grievances', label: 'Grievances', icon: AlertTriangle }
    ];

    /* Chart Configs and Helper Logic */
    const barData = useMemo(() => {
        if (!dashboardData) return null;
        return {
            labels: dashboardData.branches || ['CS', 'EC', 'ME', 'CV'],
            datasets: [{
                label: 'Avg CIE Performance (%)',
                data: dashboardData.branchPerformance || [0, 0, 0, 0],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                borderRadius: 6
            }]
        };
    }, [dashboardData]);

    const departments = useMemo(() => {
        if (!dashboardData?.branches) return [];
        return dashboardData.branches.map(branch => {
            const hodInfo = dashboardData.hodSubmissionStatus?.find(h => h.dept === branch);
            return {
                id: branch,
                name: branch === 'CS' ? 'Computer Science' : branch === 'ME' ? 'Mechanical' : branch === 'EC' ? 'Electronics' : branch === 'CV' ? 'Civil' : branch,
                hod: hodInfo ? hodInfo.hod : 'Unknown',
                color: branch === 'CS' ? '#3b82f6' : branch === 'ME' ? '#f59e0b' : branch === 'EC' ? '#8b5cf6' : '#10b981'
            };
        });
    }, [dashboardData]);

    const handleDeptClick = useCallback((dept) => {
        setSelectedDept(dept);
        // Students are fetched by DirectorySection internally based on selectedDept
        setDeptStudents([]);
    }, []);

    const handleAddFaculty = useCallback(() => setActiveModal('faculty'), []);

    // const handleViewGrievance = useCallback((g) => {
    //     setSelectedItem(g);
    //     setActiveModal('grievance');
    // }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            {/* --- SIDEBAR --- */}
            <aside className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <img src={headerLogo} alt="SGP Logo" className={styles.sidebarLogo} />
                </div>

                <nav className={styles.menuNav}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); if (item.id === 'directory') setSelectedDept(null); }}
                            className={`${styles.menuItem} ${activeTab === item.id ? styles.menuItemActive : ''}`}
                        >
                            <item.icon size={20} style={{ minWidth: '20px' }} />
                            <span style={{ flex: 1 }}>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <button
                        onClick={handleLogout}
                        className={styles.logoutBtn}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className={styles.welcomeText}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Hello, Dr. Gowri Shankar</h1>
                        <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Principal | Sanjay Gandhi Polytechnic</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            className={styles.secondaryBtn}
                            onClick={() => alert("Downloading Full Institute Report...")}
                            style={{ padding: '0.5rem', marginRight: '0.5rem', border: 'none', background: '#ecfdf5', color: '#059669', borderRadius: '8px', cursor: 'pointer' }}
                            title="Download Full Report"
                        >
                            <FileText size={20} />
                        </button>
                        <StudentSentinel students={deptStudents} /> {/* Ideally fetch all students or use search API */}
                        <select className={styles.yearSelector}>
                            <option>Academic Year 2025-26</option>
                        </select>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className={styles.sectionVisible}>
                    {activeTab === 'overview' && (
                        loading ? <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading Dashboard...</div> :
                            <OverviewSection
                                stats={dashboardData?.stats}
                                chartData={barData}
                                branches={dashboardData?.branches}
                                branchPerformance={dashboardData?.branchPerformance}
                                lowPerformers={dashboardData?.lowPerformers}
                                // New Props
                                facultyAnalytics={dashboardData?.facultyAnalytics} // Not yet in backend
                                schedule={dashboardData?.dates} // Backend sends 'dates'
                                approvals={dashboardData?.approvals}
                                cieStats={dashboardData?.cieStats} // Not yet in backend
                                trends={dashboardData?.trends} // Not yet in backend
                                hodSubmissionStatus={dashboardData?.hodSubmissionStatus}
                            />
                    )}

                    {activeTab === 'compliance' && <ComplianceSection hodSubmissionStatus={dashboardData?.hodSubmissionStatus} />}

                    {activeTab === 'departments' && <DepartmentSection departments={departments} />}

                    {activeTab === 'directory' && <DirectorySection
                        departments={departments}
                        selectedDept={selectedDept}
                        deptStudents={deptStudents}
                        handleDeptClick={handleDeptClick}
                        setSelectedDept={setSelectedDept}
                    />}

                    {activeTab === 'faculty' && <FacultyDirectorySection facultyMembers={facultyList} onAdd={handleAddFaculty} />}

                    {activeTab === 'timetables' && <TimetablesSection timetables={timetables} onDownload={handleDownload} />}
                    {activeTab === 'circulars' && <CircularsSection circulars={circulars} onNewBroadcast={handleNewBroadcast} />}
                    {activeTab === 'reports' && <ReportsSection reports={reports} onDownload={handleDownload} />}
                    {activeTab === 'grievances' && <GrievancesSection grievances={grievances} onView={() => { }} />}
                </div>
            </main>

            {/* Interaction Modals */}
            <ToastNotification show={toast.show} msg={toast.msg} type={toast.type} />

            <SimpleModal isOpen={activeModal === 'faculty'} onClose={() => setActiveModal(null)} title="Add New Faculty">
                <form onSubmit={handleSaveFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input className={styles.searchBarInput} placeholder="Full Name" required style={{ border: '1px solid #e2e8f0' }} />
                    <select className={styles.searchBarInput} style={{ border: '1px solid #e2e8f0' }}>
                        <option>Computer Science</option>
                        <option>Mechanical</option>
                        <option>Civil</option>
                        <option>Electronics</option>
                    </select>
                    <button type="submit" className={styles.primaryBtn} style={{ marginTop: '0.5rem', justifyContent: 'center' }}>Save Faculty</button>
                </form>
            </SimpleModal>
        </div>
    );
};

export default PrincipalDashboard;
