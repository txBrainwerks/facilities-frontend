import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import styles from './Schedules.module.css';

function toDateInput(val) {
  if (!val) return '';
  return val.slice(0, 10);
}

export default function ScheduleForm({ initial, onSave, onCancel }) {
  const { data: assets } = useApi('/assets/');
  const { data: technicians } = useApi('/technicians/');

  const [form, setForm] = useState({
    asset_id: initial?.asset_id || '',
    task_description: initial?.task_description || '',
    frequency_days: initial?.frequency_days ?? '',
    last_performed: toDateInput(initial?.last_performed) || '',
    next_due: toDateInput(initial?.next_due) || '',
    assigned_technician_id: initial?.assigned_technician_id || '',
    is_active: initial?.is_active ?? true,
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form };
    data.asset_id = Number(data.asset_id);
    data.frequency_days = Number(data.frequency_days);
    data.assigned_technician_id = data.assigned_technician_id
      ? Number(data.assigned_technician_id)
      : null;
    data.last_performed = data.last_performed ? `${data.last_performed}T00:00:00` : null;
    data.next_due = `${data.next_due}T00:00:00`;
    onSave(data);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
        Task Description *
        <textarea rows={2} value={form.task_description} onChange={set('task_description')} required />
      </label>
      <div className={styles.formRow}>
        <label>
          Frequency (days) *
          <input
            type="number"
            min="1"
            value={form.frequency_days}
            onChange={set('frequency_days')}
            required
          />
        </label>
        <label>
          Assigned Technician
          <select value={form.assigned_technician_id} onChange={set('assigned_technician_id')}>
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
          Last Performed
          <input type="date" value={form.last_performed} onChange={set('last_performed')} />
        </label>
        <label>
          Next Due *
          <input type="date" value={form.next_due} onChange={set('next_due')} required />
        </label>
      </div>
      <label className={styles.checkLabel}>
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
        />
        Active
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
