import { useEffect, useState } from 'react';
import api from '../../services/api';

const AddClassModal = ({
  slot,
  academicYear,
  semester,
  section,
  onClose,
  onSaved
}) => {
  // Master data
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [resources, setResources] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isContinuous, setIsContinuous] = useState(false);


  // Mode
  const [isLab, setIsLab] = useState(false);

  // Theory form
  const [form, setForm] = useState({
    subject: '',
    faculty: '',
    room: ''
  });

  // Lab sessions
  const [sessions, setSessions] = useState([]);

  // Load master data
  useEffect(() => {
    const loadData = async () => {
      const [s, f, r, b] = await Promise.all([
        api.get('/admin/subjects'),
        api.get('/admin/faculty'),
        api.get('/admin/resources'),
        api.get('/admin/batches', {
          params: { academicYear, section }
        })
      ]);

      setSubjects(s.data);
      setFaculty(f.data);
      setResources(r.data);
      setBatches(b.data);
    };

    loadData();
  }, [academicYear, section]);

  // Subject change handler
  const onSubjectChange = (subjectId) => {
    setForm({ ...form, subject: subjectId });

    const subj = subjects.find(s => s._id === subjectId);
    if (subj?.type === 'LAB') {
      setIsLab(true);
      setSessions([]);
    } else {
      setIsLab(false);
      setSessions([]);
    }
  };

  // Submit handler (FINAL)
  const submit = async () => {
    try {
      if (!form.subject) {
        alert('Please select subject');
        return;
      }

      const payload = {
        academicYear,
        semester,
        section,
        day: slot.day,
        period: slot.period,
        isContinuous,
        sessions: isLab
            ? sessions.map(s => ({
                subject: form.subject,
                faculty: s.faculty,
                room: s.room,
                batch: s.batch
            }))
            : [
                {
                subject: form.subject,
                faculty: form.faculty,
                room: form.room,
                batch: null
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
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 20, width: 420 }}>
        <h3>Add Class</h3>
        <p>{slot.day} – Period {slot.period}</p>

        {/* SUBJECT */}
        <select
          value={form.subject}
          onChange={e => onSubjectChange(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s._id} value={s._id}>
              {s.subjectCode} – {s.name}
            </option>
          ))}
        </select>

        <br /><br />

        {/* THEORY MODE */}
        {!isLab && (
          <>
            <select
              value={form.faculty}
              onChange={e => setForm({ ...form, faculty: e.target.value })}
            >
              <option value="">Select Faculty</option>
              {faculty.map(f => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>

            <br /><br />

            <select
              value={form.room}
              onChange={e => setForm({ ...form, room: e.target.value })}
            >
              <option value="">Select Classroom</option>
              {resources
                .filter(r => r.type === 'CLASSROOM')
                .map(r => (
                  <option key={r._id} value={r._id}>
                    {r.roomCode}
                  </option>
                ))}
            </select>
          </>
        )}

        {/* LAB MODE */}
        {isLab && (
          <>
          <label style={{ display: 'block', marginBottom: 10 }}>
            <input
                type="checkbox"
                checked={isContinuous}
                onChange={e => setIsContinuous(e.target.checked)}
            />
            {' '}Continuous Lab (2 periods)
            </label>

            <h4>Lab Sessions</h4>

            {sessions.map((s, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #ccc',
                  padding: 10,
                  marginBottom: 8
                }}
              >
                <select
                  value={s.batch}
                  onChange={e => {
                    const copy = [...sessions];
                    copy[idx].batch = e.target.value;
                    setSessions(copy);
                  }}
                >
                  <option value="">Select Batch</option>
                  {batches.map(b => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <br />

                <select
                  value={s.faculty}
                  onChange={e => {
                    const copy = [...sessions];
                    copy[idx].faculty = e.target.value;
                    setSessions(copy);
                  }}
                >
                  <option value="">Select Faculty</option>
                  {faculty.map(f => (
                    <option key={f._id} value={f._id}>
                      {f.name}
                    </option>
                  ))}
                </select>

                <br />

                <select
                  value={s.room}
                  onChange={e => {
                    const copy = [...sessions];
                    copy[idx].room = e.target.value;
                    setSessions(copy);
                  }}
                >
                  <option value="">Select Lab Room</option>
                  {resources
                    .filter(r => r.type === 'LAB')
                    .map(r => (
                      <option key={r._id} value={r._id}>
                        {r.roomCode}
                      </option>
                    ))}
                </select>

                <br />

                <button
                  onClick={() =>
                    setSessions(sessions.filter((_, i) => i !== idx))
                  }
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setSessions([
                  ...sessions,
                  {
                    batch: '',
                    faculty: '',
                    room: ''
                  }
                ])
              }
            >
              + Add Batch Session
            </button>
          </>
        )}

        <br /><br />

        <button onClick={submit}>Save</button>
        {' '}
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddClassModal;
