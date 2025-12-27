
import { useEffect, useState } from 'react';
import api from '../../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    usn: '',
    name: '',
    academicYear: 1,
    semester: 1,
    section: 'A'
  });

  const loadStudents = async () => {
    const res = await api.get('/admin/students');
    setStudents(res.data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (editId) {
      await api.put(`/admin/students/${editId}`, form);
      setEditId(null);
    } else {
      await api.post('/admin/students', form);
    }
    setForm({ usn: '', name: '', academicYear: 1, semester: 1, section: 'A' });
    loadStudents();
  };

  const editStudent = (s) => {
    setEditId(s._id);
    setForm({
      usn: s.usn,
      name: s.name,
      academicYear: s.academicYear,
      semester: s.semester,
      section: s.section
    });
  };

  const disableStudent = async (id) => {
    if (!window.confirm('Disable this student?')) return;
    await api.patch(`/admin/students/${id}/disable`);
    loadStudents();
  };

  return (
    <div>
      <h2>Students</h2>

      <form onSubmit={submit}>
        <input
          placeholder="USN"
          value={form.usn}
          onChange={e => setForm({ ...form, usn: e.target.value })}
          disabled={!!editId}
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <select
          value={form.section}
          onChange={e => setForm({ ...form, section: e.target.value })}
        >
          <option>A</option>
          <option>B</option>
        </select>
        <button>{editId ? 'Update' : 'Add'}</button>
      </form>

      <hr />

      <ul>
        {students.map(s => (
          <li key={s._id}>
            {s.usn} - {s.name} ({s.section})
            {' '}
            <button onClick={() => editStudent(s)}>Edit</button>
            {' '}
            <button onClick={() => disableStudent(s._id)}>Disable</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Students;
