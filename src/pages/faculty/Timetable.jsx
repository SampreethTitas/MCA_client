import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';


const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const PERIODS = [1, 2, 3, 4, 5, 6];

const FacultyTimetable = () => {
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    api.get('/faculty/timetable').then(res => {
      setSlots(res.data);
    });
  }, []);

  const findSlot = (day, period) =>
    slots.find(s => s.day === day && s.period === period);

  return (
    <div>
      <h2>My Timetable</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Day</th>
            {PERIODS.map(p => <th key={p}>P{p}</th>)}
          </tr>
        </thead>

        <tbody>
          {DAYS.map(day => (
            <tr key={day}>
              <td>{day}</td>
              {PERIODS.map(p => {
                const slot = findSlot(day, p);

                return (
                  <td key={p}>
                    {slot
                      ? slot.sessions.map((s, i) => (
                        <div key={i}>
                            <strong>{s.subject.subjectCode}</strong>
                            <div>{s.batch ? s.batch.name : 'Theory'}</div>
                            <div>{s.room.roomCode}</div>
                            <button
                              onClick={() => navigate(`/faculty/attendance/${slot._id}`)}
                            >
                              Take Attendance
                            </button>
                        </div>
                        
                        ))
                      : ''}
                      
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacultyTimetable;
