import { useState } from 'react';
import styles from './Assets.module.css';

const STATUSES = ['operational', 'down', 'maintenance', 'retired'];

function toDateInput(val) {
  if (!val) return '';
  return val.slice(0, 10);
}

export default function AssetForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    asset_type: initial?.asset_type || '',
    location: initial?.location || '',
    serial_number: initial?.serial_number || '',
    manufacturer: initial?.manufacturer || '',
    model: initial?.model || '',
    install_date: toDateInput(initial?.install_date) || '',
    warranty_expiry: toDateInput(initial?.warranty_expiry) || '',
    status: initial?.status || 'operational',
    notes: initial?.notes || '',
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form };
    data.install_date = data.install_date ? `${data.install_date}T00:00:00` : null;
    data.warranty_expiry = data.warranty_expiry ? `${data.warranty_expiry}T00:00:00` : null;
    data.location = data.location || null;
    data.serial_number = data.serial_number || null;
    data.manufacturer = data.manufacturer || null;
    data.model = data.model || null;
    data.notes = data.notes || null;
    onSave(data);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Name *
        <input value={form.name} onChange={set('name')} required />
      </label>
      <label>
        Type *
        <input value={form.asset_type} onChange={set('asset_type')} required />
      </label>
      <div className={styles.formRow}>
        <label>
          Location
          <input value={form.location} onChange={set('location')} />
        </label>
        <label>
          Serial Number
          <input value={form.serial_number} onChange={set('serial_number')} />
        </label>
      </div>
      <div className={styles.formRow}>
        <label>
          Manufacturer
          <input value={form.manufacturer} onChange={set('manufacturer')} />
        </label>
        <label>
          Model
          <input value={form.model} onChange={set('model')} />
        </label>
      </div>
      <div className={styles.formRow}>
        <label>
          Install Date
          <input type="date" value={form.install_date} onChange={set('install_date')} />
        </label>
        <label>
          Warranty Expiry
          <input type="date" value={form.warranty_expiry} onChange={set('warranty_expiry')} />
        </label>
      </div>
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
      <label>
        Notes
        <textarea rows={3} value={form.notes} onChange={set('notes')} />
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
