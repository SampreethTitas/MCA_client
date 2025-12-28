import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  return (
    <div>
      <h1>Faculty Dashboard</h1>

      <ul>
        <li>
          <Link to="/faculty/timetable">My Timetable</Link>
        </li>
      </ul>
    </div>
  );
};

export default FacultyDashboard;
