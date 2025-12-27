import { Link } from 'react-router-dom';

const AdminDashboard = () => (
  <>
    <h1>Admin Dashboard</h1>
    <ul>
      <li><Link to="/admin/students">Manage Students</Link></li>
      <li><Link to="/admin/faculty">Manage Faculty</Link></li>
      <li><Link to="/admin/subjects">Manage Subjects</Link></li>
      <li><Link to="/admin/timetable">Timetable</Link></li>
      <li><Link to="/admin/resources">Manage Resources</Link></li>
      <li><Link to="/admin/batches">Manage Batches</Link></li>


    </ul>
  </>
);

export default AdminDashboard;
