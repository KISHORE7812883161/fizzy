import React, { useState } from 'react'
import {
    BarChart3,
    Calendar,
    Package,
    Database,
    Settings,
    Clock,
    AlertTriangle,
    Activity,
    TrendingUp,
    LayoutDashboard,
    Search,
    Plus,
    RefreshCcw,
    Trash2,
    Edit2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

// Page Components
import Dashboard from './components/Dashboard'
import Schedule from './components/Schedule'
import Orders from './components/Orders'
import MasterData from './components/MasterData'

const App = () => {
    const [activeTab, setActiveTab] = useState('Dashboard')

    const tabs = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Schedule', icon: <Calendar size={18} /> },
        { name: 'Orders', icon: <Package size={18} /> },
        { name: 'Master Data', icon: <Database size={18} /> },
    ]

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': return <Dashboard />
            case 'Schedule': return <Schedule />
            case 'Orders': return <Orders />
            case 'Master Data': return <MasterData />
            default: return <Dashboard />
        }
    }

    return (
        <div className="app-container">
            {/* Header */}
            <header className="header">
                <div className="header-logo">
                    <Activity />
                    <div>
                        <div>Manufacturing Production Scheduling</div>
                        <div className="header-subtitle">Intelligent production planning and resource optimization</div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <nav className="nav-container">
                <div className="nav-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            className={`nav-tab ${activeTab === tab.name ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.name)}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content */}
            <main className="main-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer Ticker */}
            <footer className="footer-ticker">
                Manufacturing Production Scheduling System • ERP/MES Integration Ready • Real-time Optimization
            </footer>
        </div>
    )
}

export default App
