import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { post, put, del } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import WorkOrderForm from './WorkOrderForm';
import styles from './WorkOrders.module.css';

const STATUSES = ['', 'open', 'in_progress', 'completed', 'closed'];
const PRIORITIES = ['', 'low', 'medium', 'high', 'urgent'];

export default function WorkOrders() {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const params = new URLSearchParams();
  if (statusFilter) params.set('status', statusFilter);
  if (priorityFilter) params.set('priority', priorityFilter);
  const qs = params.toString();
  const path = `/work-orders/${qs ? `?${qs}` : ''}`;

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
    { key: 'title', label: 'Title' },
    {
      key: 'asset_id',
      label: 'Asset',
      render: (v) => assetMap[v] || v,
    },
    { key: 'priority', label: 'Priority', render: (v) => <StatusBadge value={v} /> },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge value={v} /> },
    {
      key: 'technician_id',
      label: 'Technician',
      render: (v) => (v ? techMap[v] || v : '—'),
    },
    {
      key: 'due_date',
      label: 'Due Date',
      render: (v) => (v ? v.slice(0, 10) : '—'),
    },
  ];

  function close() {
    setModal(null);
    setSelected(null);
  }

  async function handleSave(formData) {
    if (modal === 'edit') {
      await put(`/work-orders/${selected.id}`, formData);
    } else {
      await post('/work-orders/', formData);
    }
    close();
    refetch();
  }

  async function handleDelete() {
    await del(`/work-orders/${selected.id}`);
    close();
    refetch();
  }

  if (loading) return <div className={styles.loading}>Loading work orders...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Work Orders</h1>
        <button
          className={styles.addBtn}
          onClick={() => {
            setSelected(null);
            setModal('create');
          }}
        >
          + Add Work Order
        </button>
      </div>

      <div className={styles.filters}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s ? s.replace(/_/g, ' ') : 'All Statuses'}
            </option>
          ))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p ? p.replace(/_/g, ' ') : 'All Priorities'}
            </option>
          ))}
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
        <Modal title={modal === 'edit' ? 'Edit Work Order' : 'New Work Order'} onClose={close}>
          <WorkOrderForm
            initial={modal === 'edit' ? selected : null}
            onSave={handleSave}
            onCancel={close}
          />
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Work Order" onClose={close}>
          <p className={styles.confirmText}>
            Are you sure you want to delete &quot;{selected.title}&quot;?
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
