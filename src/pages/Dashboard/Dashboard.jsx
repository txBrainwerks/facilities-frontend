import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { data: assets, loading: la } = useApi('/assets/');
  const { data: workOrders, loading: lw } = useApi('/work-orders/');
  const { data: technicians, loading: lt } = useApi('/technicians/');
  const { data: schedules, loading: ls } = useApi('/maintenance-schedules/');

  const loading = la || lw || lt || ls;
  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;

  const assetList = assets || [];
  const woList = workOrders || [];
  const techList = technicians || [];
  const schedList = schedules || [];

  const openWOs = woList.filter((w) => w.status === 'open' || w.status === 'in_progress');
  const activeTechs = techList.filter((t) => t.is_active);
  const activeScheds = schedList.filter((s) => s.is_active);

  const statusBreakdown = {};
  for (const a of assetList) {
    statusBreakdown[a.status] = (statusBreakdown[a.status] || 0) + 1;
  }

  const urgentWOs = woList
    .filter((w) => w.priority === 'urgent' && w.status !== 'closed' && w.status !== 'completed')
    .slice(0, 5);

  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>

      <div className={styles.cards}>
        <Link to="/assets" className={styles.card}>
          <h3>Total Assets</h3>
          <div className={styles.value}>{assetList.length}</div>
        </Link>
        <Link to="/work-orders" className={styles.card}>
          <h3>Open Work Orders</h3>
          <div className={styles.value}>{openWOs.length}</div>
        </Link>
        <Link to="/technicians" className={styles.card}>
          <h3>Active Technicians</h3>
          <div className={styles.value}>{activeTechs.length}</div>
        </Link>
        <Link to="/schedules" className={styles.card}>
          <h3>Active Schedules</h3>
          <div className={styles.value}>{activeScheds.length}</div>
        </Link>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h2>Asset Status Breakdown</h2>
          {Object.keys(statusBreakdown).length === 0 ? (
            <div className={styles.loading}>No assets yet</div>
          ) : (
            Object.entries(statusBreakdown).map(([status, count]) => (
              <div key={status} className={styles.breakdownRow}>
                <StatusBadge value={status} />
                <span>{count}</span>
              </div>
            ))
          )}
        </div>

        <div className={styles.section}>
          <h2>Urgent Work Orders</h2>
          {urgentWOs.length === 0 ? (
            <div className={styles.loading}>No urgent work orders</div>
          ) : (
            urgentWOs.map((wo) => (
              <div key={wo.id} className={styles.woItem}>
                <span>{wo.title}</span>
                <StatusBadge value={wo.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
