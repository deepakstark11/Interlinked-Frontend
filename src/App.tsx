import React from 'react';
import Sidebar from './components/Sidebar';
import IncidentList from './components/IncidentList';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-content">
                <h1>Location: Los Angeles</h1>
                <IncidentList />
            </div>
        </div>
    );
};

export default App;
