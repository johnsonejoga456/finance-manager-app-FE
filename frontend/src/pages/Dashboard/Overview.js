import React from "react";
import GoalsWidget from "../../components/DashboardWidgets.js/GoalsWidget";

const Overview = () => {
    return (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoalsWidget /> {/* Goals Widget */}
        </div>
    );
};

export default Overview;