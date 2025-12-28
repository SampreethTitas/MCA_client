import { useEffect, useState } from 'react';
import api from '../../services/api';

const AssignStudentsToBatch = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [section, setSection] = useState('');
  const [batchId, setBatchId] = useState('');

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Load students
  useEffect(() => {
    if (academicYear && section) {
      api.get('/admin/students', {
        params: { academicYear, section }
      }).then(res => setStudents(res.data));
    }
  }, [academicYear, section]);

  // Load batches
  useEffect(() => {
    if (academicYear && section) {
      api.get('/admin/batches', {
        params: { academicYear, section }
      }).then(res => setBatches(res.data));
    }
  }, [academicYear, section]);

  const toggleStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const assign = async () => {
    if (!batchId || selectedStudents.length === 0) {
      alert('Select batch and students');
      return;
    }

    await api.post('/admin/batches/assign-students', {
      batchId,
      studentIds: selectedStudents
    });

    alert('Students assigned to batch');
    setSelectedStudents([]);
  };

  return (
    <div>
      <h2>Assign Students to Batch</h2>

      <select onChange={e => setAcademicYear(e.target.value)}>
        <option value="">Academic Year</option>
        <option value="1">1st Year</option>
        <option value="2">2nd Year</option>
      </select>

      <select onChange={e => setSection(e.target.value)}>
        <option value="">Section</option>
        <option value="A">A</option>
        <option value="B">B</option>
      </select>

      <select onChange={e => setBatchId(e.target.value)}>
        <option value="">Select Batch</option>
        {batches.map(b => (
          <option key={b._id} value={b._id}>
            {b.name}
          </option>
        ))}
      </select>

      <hr />

      <ul>
        {students.map(s => (
          <li key={s._id}>
            <label>
              <input
                type="checkbox"
                checked={selectedStudents.includes(s._id)}
                onChange={() => toggleStudent(s._id)}
              />
              {s.name} ({s.usn})
            </label>
          </li>
        ))}
      </ul>

      <button onClick={assign}>Assign to Batch</button>
    </div>
  );
};

export default AssignStudentsToBatch;
