import React, { useState, useEffect } from 'react';
import { Users, Briefcase, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import styles from '../../../pages/PrincipalDashboard.module.css';
import API_BASE_URL from '../../../config/api';

import { useAuth } from '../../../context/AuthContext';

const DepartmentCard = ({ dept, onSelect }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch real stats for this specific department
                const token = user?.token;
                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

                const response = await fetch(`${API_BASE_URL}/analytics/department/${dept.id}/stats`, { headers });

                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else {
                    console.warn(`Failed to fetch stats for ${dept.id}: ${response.status}`);
                    setStats({
                        studentCount: 0,
                        facultyCount: 0,
                        passPercentage: 0,
                        atRiskCount: 0
                    });
                }
            } catch (error) {
                console.error(`Failed to load stats for ${dept.id}`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [dept.id, user]);

    return (
        <div className={styles.glassCard} style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: `5px solid ${dept.color}`,
            transition: 'transform 0.2s',
            cursor: 'pointer'
        }}
            onClick={() => onSelect(dept)}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>{dept.name}</h3>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>HOD: {dept.hod}</span>
                    </div>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: `${dept.color}20`, color: dept.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Briefcase size={20} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Users size={14} color="#64748b" />
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Students</span>
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                            {loading ? '...' : (stats?.studentCount || 0)}
                        </span>
                    </div>
                    <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <AlertTriangle size={14} color="#ef4444" />
                            <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>At Risk</span>
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444' }}>
                            {loading ? '...' : (stats?.atRiskCount || 0)}
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#64748b' }}>Pass Percentage</span>
                        <span style={{ fontWeight: 600, color: '#16a34a' }}>{loading ? '-' : stats?.passPercentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                        <div style={{
                            width: `${loading ? 0 : stats?.passPercentage}%`,
                            height: '100%',
                            background: '#16a34a',
                            borderRadius: '3px',
                            transition: 'width 1s ease-out'
                        }}></div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View Details <ArrowRight size={16} />
                </span>
            </div>
        </div>
    );
};

const DepartmentSection = ({ departments = [
    { id: 'CS', name: 'Computer Science', hod: 'MD Jaffar', color: '#3b82f6' },
    { id: 'CV', name: 'Civil Engineering', hod: 'Dr. Sarah Smith', color: '#10b981' },
    { id: 'ME', name: 'Mechanical Eng.', hod: 'Prof. R. Kumar', color: '#f59e0b' },
    { id: 'EC', name: 'Electronics & Comm.', hod: 'Dr. Anita Roy', color: '#8b5cf6' }
] }) => {

    const [selectedDept, setSelectedDept] = useState(null);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 className={styles.chartTitle} style={{ fontSize: '1.5rem' }}>Department Monitoring</h2>
                <p style={{ color: '#64748b' }}>Overview of department performance, faculty compliance, and student risk levels.</p>
            </div>

            {selectedDept ? (
                <div className={styles.glassCard} style={{ padding: '2rem' }}>
                    <button
                        onClick={() => setSelectedDept(null)}
                        style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 600 }}
                    >
                        ← Back to Overview
                    </button>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{selectedDept.name} Details</h2>
                    <p style={{ color: '#64748b' }}>
                        Detailed analytics for {selectedDept.name} will appear here.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {departments.map(dept => (
                        <DepartmentCard
                            key={dept.id}
                            dept={dept}
                            onSelect={setSelectedDept}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DepartmentSection;
