import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { post, put, del } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import TechnicianForm from './TechnicianForm';
import styles from './Technicians.module.css';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'specialties', label: 'Specialties' },
  {
    key: 'is_active',
    label: 'Active',
    render: (v) => (v ? 'Yes' : 'No'),
  },
];

export default function Technicians() {
  const { data, loading, error, refetch } = useApi('/technicians/');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);

  function close() {
    setModal(null);
    setSelected(null);
  }

  async function handleSave(formData) {
    if (modal === 'edit') {
      await put(`/technicians/${selected.id}`, formData);
    } else {
      await post('/technicians/', formData);
    }
    close();
    refetch();
  }

  async function handleDelete() {
    await del(`/technicians/${selected.id}`);
    close();
    refetch();
  }

  if (loading) return <div className={styles.loading}>Loading technicians...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Technicians</h1>
        <button
          className={styles.addBtn}
          onClick={() => {
            setSelected(null);
            setModal('create');
          }}
        >
          + Add Technician
        </button>
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
          title={modal === 'edit' ? 'Edit Technician' : 'New Technician'}
          onClose={close}
        >
          <TechnicianForm
            initial={modal === 'edit' ? selected : null}
            onSave={handleSave}
            onCancel={close}
          />
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title="Delete Technician" onClose={close}>
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
