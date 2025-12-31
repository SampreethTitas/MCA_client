import { useEffect, useState } from 'react';
import api from '../../services/api';

import { useParams } from 'react-router-dom';

const Attendance = () => {
  const { timetableId } = useParams();

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [isLocked, setIsLocked] = useState(false);


  const date = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get('/faculty/attendance', {
      params: { timetableId, date }
    }).then(res => {
      setStudents(res.data.students);
      setAttendance(res.data.attendance || {});
      setIsLocked(res.data.isLocked);
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
        `Absentees:\n${absentees
          .map(a => `${a.name} (${a.usn})`)
          .join('\n')}\n\nSubmit?`

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

    const res = await api.get('/faculty/attendance', {
      params: { timetableId, date }
    });
    setIsLocked(res.data.isLocked);

  };

  return (
    <div>
      <h3>Attendance</h3>

{!isLocked && (
      <ul>
        {students.map(s => (
          <li key={s._id}>
            <label>
              <input
                type="checkbox"
                disabled={isLocked}
                checked={attendance[s._id]?.status === 'PRESENT'}
                onChange={() => toggle(s._id)}
              />
              {s.usn} - {s.name}
            </label>
          </li>
        ))}
      </ul>
)}


      <button onClick={submit} disabled={isLocked}>
        {isLocked ? 'Attendance Locked' : 'Submit Attendance'}
      </button>
    </div>
  );
};

export default Attendance;
