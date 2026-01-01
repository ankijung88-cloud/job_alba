import React from "react";
import { Outlet } from "react-router-dom";
import GlobalFloatingButtons from "../components/GlobalFloatingButtons";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
      <GlobalFloatingButtons />
    </div>
  );
};

export default MainLayout;
