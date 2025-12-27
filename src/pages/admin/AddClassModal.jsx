import { useEffect, useState } from 'react';
import api from '../../services/api';

const AddClassModal = ({ slot, academicYear, semester, section, onClose, onSaved }) => {

  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [resources, setResources] = useState([]);
  const isEdit = !!slot.entry;


  const [form, setForm] = useState({
    subject: '',
    faculty: '',
    room: '',
    section: 'A'
  });

  useEffect(() => {
    const loadData = async () => {
      const [s, f, r] = await Promise.all([
        api.get('/admin/subjects'),
        api.get('/admin/faculty'),
        api.get('/admin/resources')
      ]);

      setSubjects(s.data);
      setFaculty(f.data);
      setResources(r.data);
    };

    loadData();
  }, []);

//   useEffect(() => {
//   if (isEdit) {
//     setForm({
//       subject: slot.entry.subject?._id,
//       faculty: slot.entry.faculty?._id,
//       room: slot.entry.room?._id
//     });
//   }
// }, [isEdit, slot]);


//   const submit = async () => {
//     try {
//       await api.post('/admin/timetable', {
//         academicYear,
//         semester,
//         day: slot.day,
//         period: slot.period,
//         subject: form.subject,
//         faculty: form.faculty,
//         room: form.room,
//         section,
//         type: 'CORE'
//         });


//       onSaved();
//       onClose();
//     } catch (err) {
//       alert(err.response?.data?.message || 'Error adding class');
//     }
//   };

const submit = async () => {
  try {
    const payload = {
      academicYear,
      semester,
      section,
      day: slot.day,
      period: slot.period,
      sessions: [
        {
          subject: form.subject,
          faculty: form.faculty,
          room: form.room,
          batch: null   // theory class
        }
      ]
    };

    await api.post('/admin/timetable/slot', payload);

    onSaved();
    onClose();
  } catch (err) {
    alert(err.response?.data?.message || 'Error saving class');
  }
};


  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', padding: 20, width: 400 }}>
        <h3>Add Class</h3>
        <p>{slot.day} – Period {slot.period}</p>

        <select onChange={e => setForm({ ...form, subject: e.target.value })}>
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s._id} value={s._id}>
              {s.subjectCode} - {s.name}
            </option>
          ))}
        </select>

        <br /><br />

        <select onChange={e => setForm({ ...form, faculty: e.target.value })}>
          <option value="">Select Faculty</option>
          {faculty.map(f => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
        </select>

        <br /><br />

        <select onChange={e => setForm({ ...form, room: e.target.value })}>
          <option value="">Select Room</option>
          {resources.map(r => (
            <option key={r._id} value={r._id}>
              {r.roomCode} ({r.type})
            </option>
          ))}
        </select>

        <br /><br />

        {/* <select onChange={e => setForm({ ...form, section: e.target.value })}>
          <option>A</option>
          <option>B</option>
        </select> */}

        {/* <br /><br /> */}

        <button onClick={submit}>Save</button>
        {' '}
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddClassModal;
