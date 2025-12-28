import { useEffect, useState } from 'react';
import api from '../../services/api';

const Attendance = ({ timetableId }) => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  const date = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get('/faculty/attendance', {
      params: { timetableId, date }
    }).then(res => {
      setStudents(res.data.students);
      setAttendance(res.data.attendance || {});
    });
  }, [timetableId]);

  const toggle = (studentId) => {
    setAttendance({
      ...attendance,
      [studentId]: {
        status:
          attendance[studentId]?.status === 'PRESENT'
            ? 'ABSENT'
            : 'PRESENT'
      }
    });
  };

  const submit = async () => {
    const absentees = students.filter(
      s => attendance[s._id]?.status !== 'PRESENT'
    );

    if (
      !window.confirm(
        `Absentees:\n${absentees.map(a => a.name).join(', ')}\n\nSubmit?`
      )
    ) return;

    await api.post('/faculty/attendance', {
      timetableId,
      date,
      entries: students.map(s => ({
        studentId: s._id,
        status: attendance[s._id]?.status || 'ABSENT'
      }))
    });

    alert('Attendance submitted');
  };

  return (
    <div>
      <h3>Attendance</h3>

      <ul>
        {students.map(s => (
          <li key={s._id}>
            <label>
              <input
                type="checkbox"
                checked={attendance[s._id]?.status === 'PRESENT'}
                onChange={() => toggle(s._id)}
              />
              {s.name}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={submit}>Submit Attendance</button>
    </div>
  );
};

export default Attendance;
