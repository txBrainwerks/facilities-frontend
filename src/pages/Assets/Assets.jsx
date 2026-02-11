import { useState, useRef } from 'react';
import { useApi } from '../../hooks/useApi';
import { post, put, del, uploadFile } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import AssetForm from './AssetForm';
import styles from './Assets.module.css';

export default function Assets() {
  const { data, loading, error, refetch } = useApi('/assets/');
  const [modal, setModal] = useState(null); // 'create' | 'edit' | 'delete' | 'import'
  const [selected, setSelected] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

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

  const columns = [
    { key: 'name', label: 'Name', render: (v, row) => (
      <button className={styles.nameLink} onClick={() => openEdit(row)}>{v}</button>
    )},
    { key: 'asset_type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'serial_number', label: 'Serial #' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge value={v} /> },
  ];

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

  function openImport() {
    setImportResult(null);
    setModal('import');
  }

  function closeImport() {
    setModal(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    refetch();
  }

  function downloadTemplate() {
    const headers = 'name,asset_type,location,serial_number,manufacturer,model,install_date,warranty_expiry,status,notes';
    const blob = new Blob([headers + '\n'], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assets_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport() {
    const file = fileInputRef.current?.files[0];
    if (!file) return;
    setImporting(true);
    try {
      const result = await uploadFile('/assets/import', file);
      setImportResult(result);
    } catch (e) {
      setImportResult({ imported: 0, errors: [{ row: '-', message: e.message }] });
    } finally {
      setImporting(false);
    }
  }

  if (loading) return <div className={styles.loading}>Loading assets...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Assets</h1>
        <div className={styles.headerActions}>
          <button className={styles.importBtn} onClick={openImport}>
            Import CSV
          </button>
          <button className={styles.addBtn} onClick={openCreate}>
            + Add Asset
          </button>
        </div>
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

      {modal === 'import' && (
        <Modal title="Import Assets from CSV" onClose={closeImport}>
          <div className={styles.importBody}>
            <button className={styles.templateBtn} onClick={downloadTemplate}>
              Download CSV Template
            </button>
            <label className={styles.fileLabel}>
              Select CSV file
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                className={styles.fileInput}
              />
            </label>
            {!importResult && (
              <div className={styles.formActions}>
                <button className={styles.cancelBtn} onClick={closeImport}>
                  Cancel
                </button>
                <button
                  className={styles.saveBtn}
                  onClick={handleImport}
                  disabled={importing}
                >
                  {importing ? 'Importing...' : 'Upload'}
                </button>
              </div>
            )}
            {importResult && (
              <div className={styles.importResult}>
                <p className={styles.importSuccess}>
                  {importResult.imported} asset{importResult.imported !== 1 ? 's' : ''} imported.
                </p>
                {importResult.errors.length > 0 && (
                  <div className={styles.importErrors}>
                    <p>Errors:</p>
                    <ul>
                      {importResult.errors.map((err, i) => (
                        <li key={i}>Row {err.row}: {err.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className={styles.formActions}>
                  <button className={styles.saveBtn} onClick={closeImport}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
