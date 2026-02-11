import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import styles from './WorkOrders.module.css';

const STATUSES = ['open', 'in_progress', 'completed', 'closed'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

function toDateInput(val) {
  if (!val) return '';
  return val.slice(0, 10);
}

export default function WorkOrderForm({ initial, onSave, onCancel }) {
  const { data: assets } = useApi('/assets/');
  const { data: technicians } = useApi('/technicians/');

  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    asset_id: initial?.asset_id || '',
    technician_id: initial?.technician_id || '',
    priority: initial?.priority || 'medium',
    status: initial?.status || 'open',
    due_date: toDateInput(initial?.due_date) || '',
    estimated_hours: initial?.estimated_hours ?? '',
    notes: initial?.notes || '',
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form };
    data.asset_id = Number(data.asset_id);
    data.technician_id = data.technician_id ? Number(data.technician_id) : null;
    data.due_date = data.due_date ? `${data.due_date}T00:00:00` : null;
    data.estimated_hours = data.estimated_hours ? Number(data.estimated_hours) : null;
    data.description = data.description || null;
    data.notes = data.notes || null;
    onSave(data);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Title *
        <input value={form.title} onChange={set('title')} required />
      </label>
      <label>
        Description
        <textarea rows={2} value={form.description} onChange={set('description')} />
      </label>
      <div className={styles.formRow}>
        <label>
          Asset *
          <select value={form.asset_id} onChange={set('asset_id')} required>
            <option value="">Select asset</option>
            {(assets || []).map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Technician
          <select value={form.technician_id} onChange={set('technician_id')}>
            <option value="">Unassigned</option>
            {(technicians || []).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.formRow}>
        <label>
          Priority
          <select value={form.priority} onChange={set('priority')}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={form.status} onChange={set('status')}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.formRow}>
        <label>
          Due Date
          <input type="date" value={form.due_date} onChange={set('due_date')} />
        </label>
        <label>
          Estimated Hours
          <input
            type="number"
            min="0"
            value={form.estimated_hours}
            onChange={set('estimated_hours')}
          />
        </label>
      </div>
      <label>
        Notes
        <textarea rows={2} value={form.notes} onChange={set('notes')} />
      </label>
      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.saveBtn}>
          {initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
