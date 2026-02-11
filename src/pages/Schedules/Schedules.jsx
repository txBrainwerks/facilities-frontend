import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { post, put, del } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import ScheduleForm from './ScheduleForm';
import styles from './Schedules.module.css';

export default function Schedules() {
  const [activeFilter, setActiveFilter] = useState('');

  const params = new URLSearchParams();
  if (activeFilter !== '') params.set('is_active', activeFilter);
  const qs = params.toString();
  const path = `/maintenance-schedules/${qs ? `?${qs}` : ''}`;

  const { data, loading, error, refetch } = useApi(path);
  const { data: assets } = useApi('/assets/');
  const { data: technicians } = useApi('/technicians/');

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  const assetMap = {};
  for (const a of assets || []) assetMap[a.id] = a.name;
  const techMap = {};
  for (const t of technicians || []) techMap[t.id] = t.name;

  const columns = [
    {
      key: 'asset_id',
      label: 'Asset',
      render: (v) => assetMap[v] || v,
    },
    { key: 'task_description', label: 'Task' },
    { key: 'frequency_days', label: 'Frequency (days)' },
    {
      key: 'next_due',
      label: 'Next Due',
      render: (v) => (v ? v.slice(0, 10) : '—'),
    },
    {
      key: 'assigned_technician_id',
      label: 'Technician',
      render: (v) => (v ? techMap[v] || v : '—'),
    },
    {
      key: 'is_active',
      label: 'Active',
      render: (v) => (v ? 'Yes' : 'No'),
    },
  ];

  function close() {
    setModal(null);
    setSelected(null);
  }

  async function handleSave(formData) {
    if (modal === 'edit') {
      await put(`/maintenance-schedules/${selected.id}`, formData);
    } else {
      await post('/maintenance-schedules/', formData);
    }
    close();
    refetch();
  }

  async function handleDelete() {
    await del(`/maintenance-schedules/${selected.id}`);
    close();
    refetch();
  }

  if (loading) return <div className={styles.loading}>Loading schedules...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Maintenance Schedules</h1>
        <button
          className={styles.addBtn}
          onClick={() => {
            setSelected(null);
            setModal('create');
          }}
        >
          + Add Schedule
        </button>
      </div>

      <div className={styles.filters}>
        <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data}
        onEdit={(row) => {
          setSelected(row);
          setModal('edit');
        }}
        onDelete={(row) => {
          setSelected(row);
          setModal('delete');
        }}
      />

      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'edit' ? 'Edit Schedule' : 'New Schedule'}
          onClose={close}
        >
          <ScheduleForm
            initial={modal === 'edit' ? selected : null}
            onSave={handleSave}
            onCancel={close}
          />
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Schedule" onClose={close}>
          <p className={styles.confirmText}>
            Are you sure you want to delete this schedule?
          </p>
          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={close}>
              Cancel
            </button>
            <button className={styles.dangerBtn} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
