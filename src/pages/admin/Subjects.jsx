import { useEffect, useState } from 'react';
import api from '../../services/api';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    subjectCode: '',
    name: '',
    academicYear: 1,
    semester: 1,
    category: 'CORE',
    type: 'THEORY',
    totalHours: 0
  });

  const loadSubjects = async () => {
    const res = await api.get('/admin/subjects');
    setSubjects(res.data);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/subjects/${editId}`, form);
        setEditId(null);
      } else {
        await api.post('/admin/subjects', form);
      }

      setForm({
        subjectCode: '',
        name: '',
        academicYear: 1,
        semester: 1,
        category: 'CORE',
        type: 'THEORY',
        totalHours: 0
      });
      loadSubjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving subject');
    }
  };

  const editSubject = (s) => {
    setEditId(s._id);
    setForm({
      subjectCode: s.subjectCode,
      name: s.name,
      academicYear: s.academicYear,
      semester: s.semester,
      category: s.category,
      type: s.type,
      totalHours: s.totalHours
    });
  };

  const disableSubject = async (id) => {
    if (!window.confirm('Disable this subject?')) return;
    await api.patch(`/admin/subjects/${id}/disable`);
    loadSubjects();
  };

  return (
    <div>
      <h2>Subjects</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Subject Code"
          value={form.subjectCode}
          onChange={e => setForm({ ...form, subjectCode: e.target.value })}
          disabled={!!editId}
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <select value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="CORE">Core</option>
          <option value="ELECTIVE">Elective</option>
        </select>

        <select value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="THEORY">Theory</option>
          <option value="LAB">Lab</option>
        </select>

        <input
          type="number"
          placeholder="Total Hours"
          value={form.totalHours}
          onChange={e => setForm({ ...form, totalHours: Number(e.target.value) })}
        />

        <button>{editId ? 'Update' : 'Add'}</button>
      </form>

      <hr />

      <ul>
        {subjects.map(s => (
          <li key={s._id}>
            {s.subjectCode} - {s.name} ({s.category}, {s.type})
            {' '}
            <button onClick={() => editSubject(s)}>Edit</button>
            {' '}
            <button onClick={() => disableSubject(s._id)}>Disable</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subjects;
