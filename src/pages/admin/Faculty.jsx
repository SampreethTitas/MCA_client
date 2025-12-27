import { useEffect, useState } from 'react';
import api from '../../services/api';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    facultyCode: '',
    name: '',
    email: ''
  });

  const loadFaculty = async () => {
    const res = await api.get('/admin/faculty');
    setFaculty(res.data);
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
try {
    console.log('Submitting faculty:', form);
    if (editId) {
      await api.put(`/admin/faculty/${editId}`, form);
      setEditId(null);
    } else {
      await api.post('/admin/faculty', form);
    }
    setForm({ facultyCode: '', name: '', email: '' });
    loadFaculty();
     } catch (err) {
    console.error('Backend error:', err.response?.data); // 👈 IMPORTANT
    alert(err.response?.data?.message || 'Error adding faculty');
  }
  };

  const editFaculty = (f) => {
    setEditId(f._id);
    setForm({
      facultyCode: f.facultyCode,
      name: f.name,
      email: f.email
    });
  };

  const disableFaculty = async (id) => {
    if (!window.confirm('Disable this faculty?')) return;
    await api.patch(`/admin/faculty/${id}/disable`);
    loadFaculty();
  };

  return (
    <div>
      <h2>Faculty</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Faculty Code"
          value={form.facultyCode}
          onChange={e => setForm({ ...form, facultyCode: e.target.value })}
          disabled={!!editId}
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <button>{editId ? 'Update' : 'Add'}</button>
      </form>

      <hr />

      <ul>
        {faculty.map(f => (
          <li key={f._id}>
            {f.facultyCode} - {f.name}
            {' '}
            <button onClick={() => editFaculty(f)}>Edit</button>
            {' '}
            <button onClick={() => disableFaculty(f._id)}>Disable</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Faculty;
