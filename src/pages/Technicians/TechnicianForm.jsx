import { useState } from 'react';
import styles from './Technicians.module.css';

export default function TechnicianForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    specialties: initial?.specialties || '',
    is_active: initial?.is_active ?? true,
  });

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = { ...form };
    data.phone = data.phone || null;
    data.specialties = data.specialties || null;
    onSave(data);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        Name *
        <input value={form.name} onChange={set('name')} required />
      </label>
      <label>
        Email *
        <input type="email" value={form.email} onChange={set('email')} required />
      </label>
      <label>
        Phone
        <input value={form.phone} onChange={set('phone')} />
      </label>
      <label>
        Specialties
        <input
          value={form.specialties}
          onChange={set('specialties')}
          placeholder="e.g. HVAC, Electrical, Plumbing"
        />
      </label>
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
