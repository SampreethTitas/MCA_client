import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Students from './pages/admin/Students';
import Faculty from './pages/admin/Faculty';
import Subjects from './pages/admin/Subjects';
import Timetable from './pages/admin/Timetable';

import Resources from './pages/admin/Resources';
import Batches from './pages/admin/Batches';
import AssignStudentsToBatch from './pages/admin/AssignStudentsToBatch';

import FacultyTimetable from './pages/faculty/Timetable';










const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin" element={
        <ProtectedRoute role="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/students" element={
        <ProtectedRoute role="ADMIN">
         <Students />
        </ProtectedRoute>
      } />

      <Route path="/faculty" element={
        <ProtectedRoute role="FACULTY">
          <FacultyDashboard />
        </ProtectedRoute>
      } />

      <Route path="/student" element={
        <ProtectedRoute role="STUDENT">
          <StudentDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/faculty" element={
        <ProtectedRoute role="ADMIN">
          <Faculty />
        </ProtectedRoute>
      } />


      <Route path="/admin/subjects" element={
        <ProtectedRoute role="ADMIN">
          <Subjects />
        </ProtectedRoute>
      } />



      <Route
        path="/admin/timetable"
        element={
          <ProtectedRoute role="ADMIN">
            <Timetable />
          </ProtectedRoute>
        }
      />


      <Route
        path="/admin/resources"
        element={
          <ProtectedRoute role="ADMIN">
            <Resources />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/batches"
        element={
          <ProtectedRoute role="ADMIN">
            <Batches />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/assign-batches"
        element={
          <ProtectedRoute role="ADMIN">
            <AssignStudentsToBatch />
          </ProtectedRoute>
        }
      />

      <Route
        path="/faculty/timetable"
        element={
          <ProtectedRoute role="FACULTY">
            <FacultyTimetable />
          </ProtectedRoute>
        }
      />

    </Routes>
  </BrowserRouter>
);

export default App;
