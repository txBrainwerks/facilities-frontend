import styles from './DataTable.module.css';

export default function DataTable({ columns, data, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>No records found.</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td>
                  <div className={styles.actions}>
                    {onEdit && (
                      <button className={styles.editBtn} onClick={() => onEdit(row)}>
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button className={styles.deleteBtn} onClick={() => onDelete(row)}>
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
