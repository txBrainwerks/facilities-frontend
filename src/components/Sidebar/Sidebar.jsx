import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/assets', label: 'Assets' },
  { to: '/work-orders', label: 'Work Orders' },
  { to: '/technicians', label: 'Technicians' },
  { to: '/schedules', label: 'Schedules' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Facilities Mgmt</div>
      <nav className={styles.nav}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
