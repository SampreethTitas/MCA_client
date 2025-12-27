import { useEffect, useState } from 'react';
import api from '../../services/api';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({
    academicYear: '',
    section: '',
    name: '',
    size: 0
  });
  const [editId, setEditId] = useState(null);

  const loadBatches = async () => {
    const res = await api.get('/admin/batches', {
      params: {
        academicYear: form.academicYear,
        section: form.section
      }
    });
    setBatches(res.data);
  };

  useEffect(() => {
    if (form.academicYear && form.section) {
      loadBatches();
    }
  }, [form.academicYear, form.section]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/batches/${editId}`, form);
        setEditId(null);
      } else {
        await api.post('/admin/batches', form);
      }
      setForm({ ...form, name: '', size: 0 });
      loadBatches();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving batch');
    }
  };

  const editBatch = (b) => {
    setEditId(b._id);
    setForm({
      academicYear: b.academicYear,
      section: b.section,
      name: b.name,
      size: b.size
    });
  };

  const disableBatch = async (id) => {
    if (!window.confirm('Disable this batch?')) return;
    await api.patch(`/admin/batches/${id}/disable`);
    loadBatches();
  };

  return (
    <div>
      <h2>Batches</h2>

      <select
        value={form.academicYear}
        onChange={e => setForm({ ...form, academicYear: e.target.value })}
      >
        <option value="">Academic Year</option>
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
      </select>

      <select
        value={form.section}
        onChange={e => setForm({ ...form, section: e.target.value })}
      >
        <option value="">Section</option>
        <option value="A">A</option>
        <option value="B">B</option>
      </select>

      <form onSubmit={submit}>
        <input
          placeholder="Batch Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Batch Size"
          value={form.size}
          onChange={e => setForm({ ...form, size: Number(e.target.value) })}
        />
        <button>{editId ? 'Update' : 'Add'}</button>
      </form>

      <ul>
        {batches.map(b => (
          <li key={b._id}>
            {b.name} (size {b.size})
            {' '}
            <button onClick={() => editBatch(b)}>Edit</button>
            {' '}
            <button onClick={() => disableBatch(b._id)}>Disable</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Batches;
