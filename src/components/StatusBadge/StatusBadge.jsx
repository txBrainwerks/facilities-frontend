import styles from './StatusBadge.module.css';

export default function StatusBadge({ value }) {
  if (!value) return '—';
  const cls = styles[value] || '';
  const label = value.replace(/_/g, ' ');
  return <span className={`${styles.badge} ${cls}`}>{label}</span>;
}
