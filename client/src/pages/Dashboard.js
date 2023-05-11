import Sidebar from "../components/Sidebar";

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <main className="h-full overflow-y-auto">
          {/* Content goes here */}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
