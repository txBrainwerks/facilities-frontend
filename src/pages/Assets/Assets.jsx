import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { post, put, del } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import AssetForm from './AssetForm';
import styles from './Assets.module.css';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'asset_type', label: 'Type' },
  { key: 'location', label: 'Location' },
  { key: 'serial_number', label: 'Serial #' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge value={v} /> },
];

export default function Assets() {
  const { data, loading, error, refetch } = useApi('/assets/');
  const [modal, setModal] = useState(null); // 'create' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);

  function openCreate() {
    setSelected(null);
    setModal('create');
  }

  function openEdit(row) {
    setSelected(row);
    setModal('edit');
  }

  function openDelete(row) {
    setSelected(row);
    setModal('delete');
  }

  function close() {
    setModal(null);
    setSelected(null);
  }

  async function handleSave(data) {
    if (modal === 'edit') {
      await put(`/assets/${selected.id}`, data);
    } else {
      await post('/assets/', data);
    }
    close();
    refetch();
  }

  async function handleDelete() {
    await del(`/assets/${selected.id}`);
    close();
    refetch();
  }

  if (loading) return <div className={styles.loading}>Loading assets...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Assets</h1>
        <button className={styles.addBtn} onClick={openCreate}>
          + Add Asset
        </button>
      </div>

      <DataTable columns={columns} data={data} onEdit={openEdit} onDelete={openDelete} />

      {(modal === 'create' || modal === 'edit') && (
        <Modal title={modal === 'edit' ? 'Edit Asset' : 'New Asset'} onClose={close}>
          <AssetForm
            initial={modal === 'edit' ? selected : null}
            onSave={handleSave}
            onCancel={close}
          />
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Asset" onClose={close}>
          <p className={styles.confirmText}>
            Are you sure you want to delete &quot;{selected.name}&quot;?
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
