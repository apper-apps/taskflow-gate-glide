import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";
import InboxPage from "@/components/pages/InboxPage";
import TodayPage from "@/components/pages/TodayPage";
import UpcomingPage from "@/components/pages/UpcomingPage";
import ProjectPage from "@/components/pages/ProjectPage";
import ArchivePage from "@/components/pages/ArchivePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/today" replace />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="today" element={<TodayPage />} />
            <Route path="upcoming" element={<UpcomingPage />} />
            <Route path="projects/:projectId" element={<ProjectPage />} />
            <Route path="archive" element={<ArchivePage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="!bg-white !text-gray-900 !rounded-lg !shadow-lg !border !border-gray-200"
          bodyClassName="!text-sm !font-medium"
          progressClassName="!bg-primary"
        />
      </div>
    </Router>
  );
}

export default App;