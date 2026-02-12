import React, { useState } from 'react';
import Sidebar from './Sidebar';
import styles from './DashboardLayout.module.css';
import NotificationPanel from './NotificationPanel';
import { Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = ({ menuItems, children, rightSidebar }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className={styles.layout}>
            <Sidebar menuItems={menuItems} />
            <main className={styles.mainContent} style={{ marginRight: rightSidebar ? '300px' : '0', transition: 'margin-right 0.3s' }}>
                {children}

                {/* Floating Notification Bell - Hide if right sidebar is used? Or keep as backup? */}
                {/* For now keeping it, but maybe hidden if right sidebar deals with notifs */}
                {!rightSidebar && (
                    <div className={styles.floatingControls}>
                        <button
                            className={styles.themeToggleBtn}
                            onClick={toggleTheme}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <Sun size={24} color="#FDB813" /> : <Moon size={24} />}
                        </button>

                        <button
                            className={styles.notificationBtn}
                            onClick={() => setShowNotifications(!showNotifications)}
                            title="Notifications"
                        >
                            <Bell size={24} />
                        </button>
                    </div>
                )}

                {showNotifications && !rightSidebar && (
                    <NotificationPanel onClose={() => setShowNotifications(false)} />
                )}
            </main>
            {rightSidebar}
        </div>
    );
};

export default DashboardLayout;
