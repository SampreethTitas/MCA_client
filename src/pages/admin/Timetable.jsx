// import { useEffect, useState } from 'react';
// import api from '../../services/api';
// import AddClassModal from './AddClassModal';







// const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
// const PERIODS = [
//   { key: 1, label: '09:00–10:00' },
//   { key: 2, label: '10:00–11:00' },
//   { key: 'BREAK1', label: '11:00–11:30', isBreak: true },
//   { key: 3, label: '11:30–12:30' },
//   { key: 4, label: '12:30–13:30' },
//   { key: 'LUNCH', label: '13:30–14:30', isBreak: true },
//   { key: 5, label: '14:30–15:30' },
//   { key: 6, label: '15:30–16:30' }
// ];

// const Timetable = () => {
//   const [entries, setEntries] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);

//   const loadTimetable = async () => {
//     const res = await api.get('/admin/timetable'); // we’ll add this API next if not present
//     setEntries(res.data || []);
//   };

//   useEffect(() => {
//     loadTimetable();
//   }, []);

//   const findEntry = (day, period) =>
//     entries.find(e => e.day === day && e.period === period);

//   const onCellClick = (day, period) => {
//   setSelectedSlot({ day, period });
//   setShowModal(true);
//     };

//   return (
//     <div style={{ padding: 16 }}>
//       <h2>Timetable</h2>

//       <table border="1" cellPadding="8" cellSpacing="0">
//         <thead>
//           <tr>
//             <th>Day / Time</th>
//             {PERIODS.map(p => (
//               <th key={p.key} style={{ background: p.isBreak ? '#eee' : '#fafafa' }}>
//                 {p.label}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {DAYS.map(day => (
//             <tr key={day}>
//               <td><strong>{day}</strong></td>

//               {PERIODS.map(p => {
//                 if (p.isBreak) {
//                   return (
//                     <td key={p.key} style={{ background: '#f0f0f0', textAlign: 'center' }}>
//                       BREAK
//                     </td>
//                   );
//                 }

//                 const entry = findEntry(day, p.key);

//                 return (
//                     <td key={p.key} style={{ minWidth: 120 }}>
//                         {entry ? (
//                         <div>
//                             <strong>{entry.subject?.subjectCode}</strong>
//                             <div style={{ fontSize: 12 }}>
//                             {entry.section ? `Sec ${entry.section}` : 'Elective'}
//                             </div>
//                         </div>
//                         ) : (
//                         <button
//                             onClick={() => onCellClick(day, p.key)}
//                             style={{ width: '100%' }}
//                         >
//                             +
//                         </button>
//                         )}
//                     </td>
//                 );


//                 // return (
//                 //   <td key={p.key} style={{ minWidth: 120 }}>
//                 //     {entry ? (
//                 //       <div>
//                 //         <div><strong>{entry.subject?.subjectCode}</strong></div>
//                 //         <div style={{ fontSize: 12 }}>
//                 //           {entry.section ? `Sec ${entry.section}` : 'Elective'}
//                 //         </div>
//                 //       </div>
//                 //     ) : (
//                 //       <div style={{ color: '#999' }}>—</div>
//                 //     )}
//                 //   </td>
//                 // );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showModal && (
//         <AddClassModal
//             slot={selectedSlot}
//             onClose={() => setShowModal(false)}
//             onSaved={loadTimetable}
//         />
//         )}

//     </div>
//   );
// };

// export default Timetable;




import { useEffect, useState } from 'react';
import api from '../../services/api';
import AddClassModal from './AddClassModal';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const PERIODS = [
  { key: 1, label: '09:00–10:00' },
  { key: 2, label: '10:00–11:00' },
  { key: 'BREAK1', label: '11:00–11:30', isBreak: true },
  { key: 3, label: '11:30–12:30' },
  { key: 4, label: '12:30–13:30' },
  { key: 'LUNCH', label: '13:30–14:30', isBreak: true },
  { key: 5, label: '14:30–15:30' },
  { key: 6, label: '15:30–16:30' }
];

const Timetable = () => {
  const [entries, setEntries] = useState([]);

  // 🔹 Context selector state
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');

  const [contextLoaded, setContextLoaded] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const loadTimetable = async () => {
    const res = await api.get('/admin/timetable', {
      params: { academicYear, semester, section }
    });
    setEntries(res.data || []);
  };

  const onLoadClick = () => {
    if (!academicYear || !semester || !section) {
      alert('Please select Academic Year, Semester and Section');
      return;
    }
    setContextLoaded(true);
    loadTimetable();
  };

  const findEntry = (day, period) =>
    entries.find(e => e.day === day && e.period === period);

  const onCellClick = (day, period) => {
    setSelectedSlot({ day, period });
    setShowModal(true);
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Timetable</h2>

      {/* 🔹 CONTEXT SELECTOR */}
      <div style={{ marginBottom: 16 }}>
        <select value={academicYear} onChange={e => setAcademicYear(e.target.value)}>
          <option value="">Academic Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
        </select>

        {' '}

        <select value={semester} onChange={e => setSemester(e.target.value)}>
          <option value="">Semester</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
        </select>

        {' '}

        <select value={section} onChange={e => setSection(e.target.value)}>
          <option value="">Section</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>

        {' '}

        <button onClick={onLoadClick}>Load Timetable</button>
      </div>

      {/* 🔹 TIMETABLE GRID */}
      {contextLoaded && (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Day / Time</th>
              {PERIODS.map(p => (
                <th key={p.key} style={{ background: p.isBreak ? '#eee' : '#fafafa' }}>
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {DAYS.map(day => (
              <tr key={day}>
                <td><strong>{day}</strong></td>

                {PERIODS.map(p => {
                  if (p.isBreak) {
                    return (
                      <td key={p.key} style={{ background: '#f0f0f0', textAlign: 'center' }}>
                        BREAK
                      </td>
                    );
                  }

                //   const entry = findEntry(day, p.key);
                  const slot = entries.find(
                    e => e.day === day && e.period === p.key
                    );

                  return (
                    <td key={p.key} style={{ minWidth: 150 }}>
                        {slot ? (
                        <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                            setSelectedSlot({
                                day,
                                period: p.key,
                                entry: slot
                            });
                            setShowModal(true);
                            }}
                        >
                            {slot.sessions.map((s, idx) => (
                            <div
                                key={idx}
                                style={{
                                borderBottom: '1px solid #ddd',
                                marginBottom: 4,
                                paddingBottom: 4
                                }}
                            >
                                <strong>{s.subject?.subjectCode}</strong>
                                <div style={{ fontSize: 12 }}>
                                {s.batch ? s.batch.name : 'Theory'}
                                </div>
                                <div style={{ fontSize: 11 }}>
                                {s.room?.roomCode}
                                </div>
                            </div>
                            ))}
                            <div style={{ fontSize: 11, color: '#007bff' }}>
                            Edit
                            </div>
                        </div>
                        ) : (
                        <button onClick={() => onCellClick(day, p.key)}>+</button>
                        )}
                    </td>
                    );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🔹 ADD CLASS MODAL */}
      {showModal && selectedSlot && (
        <AddClassModal
          slot={selectedSlot}
          academicYear={academicYear}
          semester={semester}
          section={section}
          onClose={() => setShowModal(false)}
          onSaved={loadTimetable}
        />
      )}
    </div>
  );
};

export default Timetable;
