import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
import styles from './Sidebar.module.css';
import { LogOut } from 'lucide-react';
import collegeLogo from '../assets/college_logo.png';

const Sidebar = ({ menuItems }) => {
    const { user, logout } = useAuth();
    // const { isDarkMode, toggleTheme } = useTheme(); 

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoSection}>
                <img src={collegeLogo} alt="SGP Logo" className={styles.sidebarLogo} />
            </div>

            <nav className={styles.nav}>
                {menuItems.map((item, index) => {
                    // Check if we need to render a category header
                    const prevCategory = index > 0 ? menuItems[index - 1].category : null;
                    const showHeader = item.category && item.category !== prevCategory;

                    return (
                        <React.Fragment key={item.label}>
                            {showHeader && (
                                <div className={styles.categoryHeader}>
                                    {item.category}
                                </div>
                            )}
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    (item.isActive ?? isActive) ? `${styles.navItem} ${styles.active}` : styles.navItem
                                }
                                onClick={(e) => {
                                    if (item.onClick) {
                                        e.preventDefault();
                                        item.onClick();
                                    }
                                }}
                                end
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className={styles.badge}>{item.badge}</span>
                                )}
                            </NavLink>
                        </React.Fragment>
                    );
                })}
            </nav>

            <button onClick={logout} className={styles.logoutButton}>
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;
