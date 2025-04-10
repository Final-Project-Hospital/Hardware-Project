import React from "react";
import Header from "../../component/header/index";
import BodyDashboard  from "./body/dashboard";

const Dashboard: React.FC = () => {
  return (
    <section className="main">
      <Header />
      <div className="contentMain flex justify-center">
        <div className="contentRight py-8 px-14 w-full"><BodyDashboard/></div>
      </div>
    </section>
  );
};

export default Dashboard;