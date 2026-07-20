import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import RightSidebar from "./RightSidebar";

function Layout({ children }) {
  return (
    <>
      <Sidebar />

      <div
        style={{
          marginLeft: "280px",
          marginRight: "300px",
          minHeight: "100vh"
        }}
      >
        <Navbar />
        {children}
      </div>

      <RightSidebar />
    </>
  );
}

export default Layout;