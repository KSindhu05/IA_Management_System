import React, { memo } from 'react';
import { Calendar, Download, Bell, FileText, Search, Plus, Briefcase, Clock } from 'lucide-react';
import styles from '../../../pages/PrincipalDashboard.module.css';

export const FacultyDirectorySection = memo(({ facultyMembers = [], onAdd }) => {
    return (
        <div className={styles.sectionVisible}>
            {/* --- FACULTY BANNER --- */}
            <div style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                borderRadius: '24px',
                padding: '2rem',
                color: 'white',
                marginBottom: '2rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.5)'
            }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
                                <Briefcase size={24} color="white" />
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>Academic Staff</span>
                        </div>
                        <h1 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800 }}>Staff Directory</h1>
                        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Manage faculty profiles, workload, and performance.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', textAlign: 'right' }}>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Total Faculty</p>
                            <p style={{ margin: '0', fontSize: '1.8rem', fontWeight: '700' }}>{facultyMembers.length}</p>
                        </div>
                        <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.3)' }}></div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>Avg Workload</p>
                            <p style={{ margin: '0', fontSize: '1.8rem', fontWeight: '700' }}>18h/wk</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TOOLBAR --- */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem',
                background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0'
            }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        placeholder="Search Faculty..."
                        style={{
                            padding: '0.6rem 0.6rem 0.6rem 2.5rem', borderRadius: '10px',
                            border: '1px solid #e2e8f0', outline: 'none', width: '100%', fontSize: '0.9rem',
                            background: '#f8fafc'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', color: '#64748b' }}>
                        <option>All Departments</option>
                        <option>CS</option>
                        <option>ME</option>
                        <option>EC</option>
                    </select>
                    <button
                        className={styles.primaryBtn}
                        onClick={onAdd}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem' }}
                    >
                        <Plus size={18} /> Add Faculty
                    </button>
                </div>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>Sl. No</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Workload</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facultyMembers.map((f, index) => (
                            <tr key={f.id} style={{ transition: 'background 0.2s', cursor: 'default' }}>
                                <td style={{ color: '#64748b', fontWeight: 500 }}>{index + 1}</td>
                                <td style={{ fontFamily: 'monospace', color: '#64748b' }}>{f.id || f.EmployeeID}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {f.name ? f.name.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{f.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.qualifications || f.Qualification}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span style={{ padding: '4px 8px', borderRadius: '6px', background: '#f1f5f9', fontWeight: 600, fontSize: '0.85rem' }}>{f.dept || f.Department}</span>
                                </td>
                                <td>{f.designation || f.Designation}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Clock size={14} color="#64748b" />
                                        {f.workload || '0 Hrs/Wk'}
                                    </div>
                                </td>
                                <td>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
                                        background: (f.status === 'Active' || !f.status) ? '#dcfce7' : '#fee2e2',
                                        color: (f.status === 'Active' || !f.status) ? '#166534' : '#991b1b',
                                        display: 'inline-flex', alignItems: 'center', gap: '4px'
                                    }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                        {f.status || 'Active'}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.secondaryBtn} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>View Profile</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export const TimetablesSection = memo(({ timetables = [], onDownload }) => {
    return (
        <div className={styles.sectionVisible}>
            <h2 className={styles.chartTitle} style={{ marginBottom: '1.5rem' }}>Master Timetables</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {timetables.map(t => (
                    <div key={t.id} className={styles.glassCard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
                        <div style={{ padding: '1rem', borderRadius: '50%', background: '#e0f2fe', color: '#0ea5e9', marginBottom: '1rem' }}>
                            <Calendar size={32} />
                        </div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: '#0f172a' }}>{t.dept || 'Department'}</h3>
                        <p style={{ margin: 0, fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>{t.semester || 'Semester'}</p>
                        <p style={{ margin: '0.5rem 0 1.5rem 0', fontSize: '0.8rem', color: '#94a3b8' }}>Updated {t.updated || 'Recently'}</p>

                        <button
                            onClick={() => onDownload(t)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '0.6rem 1.2rem', borderRadius: '8px',
                                border: '1px solid #e2e8f0', background: 'white',
                                color: '#475569', cursor: 'pointer', transition: 'all 0.2s',
                                fontWeight: 500
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.color = '#0ea5e9'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
                        >
                            <Download size={16} /> Download PDF
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
});

export const CircularsSection = memo(({ circulars = [], onNewBroadcast }) => (
    <div className={styles.sectionVisible}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className={styles.chartTitle}>Circulars & Broadcasts</h2>
            <button className={styles.primaryBtn} style={{ background: '#7c3aed' }} onClick={onNewBroadcast}>+ New Broadcast</button>
        </div>
        <div className={styles.glassCard}>
            {circulars.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.5rem', background: '#f5f3ff', borderRadius: '8px', color: '#7c3aed' }}>
                            <Bell size={20} />
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem 0' }}>{c.title}</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Target: {c.target} | Date: {c.date}</p>
                        </div>
                    </div>
                    <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#16a34a', borderRadius: '12px', fontSize: '0.8rem' }}>{c.status}</span>
                </div>
            ))}
        </div>
    </div>
));

export const ReportsSection = memo(({ reports = [], onDownload }) => (
    <div className={styles.sectionVisible}>
        <h2 className={styles.chartTitle} style={{ marginBottom: '1.5rem' }}>Reports Center</h2>
        <div className={styles.glassCard}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Report Name</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Generated Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(r => (
                        <tr key={r.id}>
                            <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                <FileText size={16} color="#64748b" /> {r.name}
                            </td>
                            <td>{r.type}</td>
                            <td>{r.size}</td>
                            <td>{r.date}</td>
                            <td>
                                <button className={styles.actionBtn} onClick={() => onDownload(r)}>Download</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
));

export const GrievancesSection = memo(({ grievances = [], onView }) => (
    <div className={styles.sectionVisible}>
        <h2 className={styles.chartTitle} style={{ marginBottom: '1.5rem' }}>Student Grievances</h2>
        <div className={styles.glassCard}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student</th>
                        <th>Issue</th>
                        <th>Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {grievances.map(g => (
                        <tr key={g.id}>
                            <td>{g.id}</td>
                            <td>{g.student}</td>
                            <td>{g.issue}</td>
                            <td>{g.date}</td>
                            <td>
                                <span style={{
                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                                    background: g.priority === 'High' ? '#fee2e2' : g.priority === 'Medium' ? '#fef3c7' : '#f1f5f9',
                                    color: g.priority === 'High' ? '#991b1b' : g.priority === 'Medium' ? '#b45309' : '#64748b'
                                }}>{g.priority}</span>
                            </td>
                            <td>{g.status}</td>
                            <td>
                                <button className={styles.secondaryBtn} onClick={() => onView(g)}>Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
));
