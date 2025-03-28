import React from "react";
import Header from "../../component/header/index";
import Sidebar from "../../component/sidebar";
const Dashboard: React.FC = () => {
  return (
    <section className="main">
      <Header />
      <div className="contentMain flex">
        <div className="sidebarWrapper w-[13%]"><Sidebar/></div>
      </div>
    </section>
  );
};

export default Dashboard;