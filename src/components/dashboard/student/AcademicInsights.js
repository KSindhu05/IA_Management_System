import React from 'react';
import { Lightbulb, ArrowUpRight, ArrowDownRight, CheckCircle } from 'lucide-react';
import styles from '../../../pages/StudentDashboard.module.css';

const AcademicInsights = ({ realMarks }) => {
    if (!realMarks || realMarks.length === 0) return null;

    // Analyze Data
    // 1. Best Subject
    const bestSubject = [...realMarks].sort((a, b) => b.totalScore - a.totalScore)[0];

    // 2. Needs Improvement (Lowest Score)
    const worstSubject = [...realMarks].sort((a, b) => a.totalScore - b.totalScore)[0];

    // 3. Attendance Alert
    const lowAttSubject = realMarks.find(m => m.attendancePercentage < 75);

    return (
        <div className={styles.insightsCard}>
            <div className={styles.insightsHeader}>
                <div className={styles.insightIconBox}>
                    <Lightbulb size={20} color="#F59E0B" />
                </div>
                <h3 className={styles.cardTitle} style={{ marginBottom: 0 }}>System Academic Analysis</h3>
            </div>

            <div className={styles.insightsList}>
                {/* Strength */}
                <div className={styles.insightItem}>
                    <div className={styles.insightIndicator} style={{ background: 'var(--success)' }}></div>
                    <div className={styles.insightContent}>
                        <h4>Strongest Subject</h4>
                        <p>You are excelling in <strong>{bestSubject?.subject?.name}</strong> with a score of {bestSubject?.totalScore}/50.</p>
                    </div>
                    <ArrowUpRight size={18} color="var(--success)" />
                </div>

                {/* Weakness */}
                {worstSubject && worstSubject.totalScore < 35 && (
                    <div className={styles.insightItem}>
                        <div className={styles.insightIndicator} style={{ background: 'var(--danger)' }}></div>
                        <div className={styles.insightContent}>
                            <h4>Focus Area</h4>
                            <p>Consider reviewing <strong>{worstSubject?.subject?.name}</strong> to improve your score ({worstSubject?.totalScore}/50).</p>
                        </div>
                        <ArrowDownRight size={18} color="var(--danger)" />
                    </div>
                )}

                {/* Attendance */}
                {lowAttSubject ? (
                    <div className={styles.insightItem}>
                        <div className={styles.insightIndicator} style={{ background: 'var(--warning)' }}></div>
                        <div className={styles.insightContent}>
                            <h4>Attendance Alert</h4>
                            <p>Your attendance in <strong>{lowAttSubject.subject.name}</strong> is {lowAttSubject.attendancePercentage}%. Please attend upcoming classes.</p>
                        </div>
                        <AlertIcon color="var(--warning)" />
                    </div>
                ) : (
                    <div className={styles.insightItem}>
                        <div className={styles.insightIndicator} style={{ background: 'var(--success)' }}></div>
                        <div className={styles.insightContent}>
                            <h4>Attendance Status</h4>
                            <p>Great job! You have good attendance across all subjects.</p>
                        </div>
                        <CheckCircle size={18} color="var(--success)" />
                    </div>
                )}
            </div>
        </div>
    );
};

const AlertIcon = ({ color }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

export default AcademicInsights;
