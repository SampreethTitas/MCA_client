import { useEffect, useState } from 'react';
import api from '../../services/api';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    roomCode: '',
    type: 'CLASSROOM',
    capacity: 0
  });

  const loadResources = async () => {
    const res = await api.get('/admin/resources');
    setResources(res.data);
  };

  useEffect(() => {
    loadResources();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/resources/${editId}`, form);
        setEditId(null);
      } else {
        await api.post('/admin/resources', form);
      }

      setForm({ roomCode: '', type: 'CLASSROOM', capacity: 0 });
      loadResources();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving resource');
    }
  };

  const editResource = (r) => {
    setEditId(r._id);
    setForm({
      roomCode: r.roomCode,
      type: r.type,
      capacity: r.capacity
    });
  };

  const disableResource = async (id) => {
    if (!window.confirm('Disable this resource?')) return;
    await api.patch(`/admin/resources/${id}/disable`);
    loadResources();
  };

  return (
    <div>
      <h2>Resources (Classrooms & Labs)</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Room / Lab Code"
          value={form.roomCode}
          onChange={e => setForm({ ...form, roomCode: e.target.value })}
          disabled={!!editId}
        />

        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="CLASSROOM">Classroom</option>
          <option value="LAB">Lab</option>
        </select>

        <input
          type="number"
          placeholder="Capacity"
          value={form.capacity}
          onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
        />

        <button>{editId ? 'Update' : 'Add'}</button>
      </form>

      <hr />

      <ul>
        {resources.map(r => (
          <li key={r._id}>
            {r.roomCode} ({r.type}, capacity {r.capacity})
            {' '}
            <button onClick={() => editResource(r)}>Edit</button>
            {' '}
            <button onClick={() => disableResource(r._id)}>Disable</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Resources;
