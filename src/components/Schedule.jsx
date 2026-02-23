import React, { useState } from 'react'
import { Calendar, Search, Clock, BarChart2, List, Settings, Filter } from 'lucide-react'

const Schedule = () => {
    const [activeSubTab, setActiveSubTab] = useState('Gantt Chart')
    const scheduleTabs = ['Gantt Chart', 'Daily View', 'By Order', 'By Process', 'By Workstation', 'By Shift', 'Search Order']

    const renderScheduleContent = () => {
        switch (activeSubTab) {
            case 'Gantt Chart':
                return (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div className="timeline-header" style={{ background: '#fafafa' }}>
                            <div style={{ width: '150px', borderRight: '1px solid #e2e8f0' }}></div>
                            <div style={{ flex: 1, display: 'flex' }}>
                                <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #e2e8f0', padding: '0.5rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Sat, Feb 21</div>
                                    <div style={{ display: 'flex', fontSize: '0.65rem', color: '#64748b' }}>
                                        <span style={{ flex: 1 }}>00:00</span> <span style={{ flex: 1 }}>04:00</span> <span style={{ flex: 1 }}>08:00</span> <span style={{ flex: 1 }}>12:00</span> <span style={{ flex: 1 }}>16:00</span> <span style={{ flex: 1 }}>20:00</span>
                                    </div>
                                </div>
                                <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #e2e8f0', padding: '0.5rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Sun, Feb 22</div>
                                    <div style={{ display: 'flex', fontSize: '0.65rem', color: '#64748b' }}>
                                        <span style={{ flex: 1 }}>00:00</span> <span style={{ flex: 1 }}>04:00</span> <span style={{ flex: 1 }}>08:00</span> <span style={{ flex: 1 }}>12:00</span> <span style={{ flex: 1 }}>16:00</span> <span style={{ flex: 1 }}>20:00</span>
                                    </div>
                                </div>
                                <div style={{ flex: 1, textAlign: 'center', padding: '0.5rem' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Mon, Feb 23</div>
                                    <div style={{ display: 'flex', fontSize: '0.65rem', color: '#64748b' }}>
                                        <span style={{ flex: 1 }}>00:00</span> <span style={{ flex: 1 }}>04:00</span> <span style={{ flex: 1 }}>08:00</span> <span style={{ flex: 1 }}>12:00</span> <span style={{ flex: 1 }}>16:00</span> <span style={{ flex: 1 }}>20:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {['AOI', 'DRILLING', 'BBT'].map((ws) => (
                            <div key={ws} className="workstation-row" style={{ borderLeft: `4px solid ${ws === 'AOI' ? '#a855f7' : '#22c55e'}` }}>
                                <div className="workstation-name">{ws}</div>
                                <div className="blocks-container">
                                    {ws === 'DRILLING' && (
                                        <>
                                            <div style={{ position: 'absolute', left: '10%', width: '15%', height: '60px', top: '30px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                                            <div className="job-block late" style={{ left: '35%', width: '12%', background: '#3b82f6' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 600 }}>ORD-2024-001</span>
                                                    <span style={{ background: '#ef4444', padding: '1px 4px', borderRadius: '4px', fontSize: '0.6rem' }}>LATE</span>
                                                </div>
                                                <div>Standard PCB</div>
                                                <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>DRILL TOOLING HOLES</div>
                                            </div>
                                            <div style={{ position: 'absolute', left: '60%', width: '15%', height: '60px', top: '30px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                                        </>
                                    )}
                                    {ws !== 'DRILLING' && (
                                        <>
                                            <div style={{ position: 'absolute', left: '15%', width: '15%', height: '60px', top: '30px', background: '#eff6ff', borderRadius: '4px' }}></div>
                                            <div style={{ position: 'absolute', left: '45%', width: '10%', height: '60px', top: '30px', background: '#eff6ff', borderRadius: '4px' }}></div>
                                            <div style={{ position: 'absolute', left: '75%', width: '15%', height: '60px', top: '30px', background: '#eff6ff', borderRadius: '4px' }}></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            default:
                return (
                    <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                        <BarChart2 size={48} style={{ opacity: 0.2, margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.25rem', color: '#1e293b' }}>{activeSubTab} View</h3>
                        <p style={{ maxWidth: '400px', margin: '1rem auto' }}>
                            Detailed analysis for this view is currently being processed by the optimization engine.
                        </p>
                    </div>
                )
        }
    }

    return (
        <div className="schedule-view">
            {/* Schedule Header Card */}
            <div className="card" style={{ borderLeft: '4px solid #3b82f6', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Calendar color="#3b82f6" />
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Production Schedule - Multi-View</h3>
                            <p className="card-desc">Comprehensive schedule analysis with multiple view modes</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select className="nav-tab" style={{ padding: '0.25rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                            <option>All Workstations</option>
                            <option>AOI Section</option>
                            <option>Drilling Section</option>
                        </select>
                        <select className="nav-tab" style={{ padding: '0.25rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                            <option>3 Days</option>
                            <option>7 Days</option>
                            <option>Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Internal Tabs */}
            <div className="nav-tabs" style={{ background: 'transparent', padding: '0 0 1.5rem 0', border: 'none', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                {scheduleTabs.map((tab) => (
                    <button
                        key={tab}
                        className={`nav-tab ${activeSubTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveSubTab(tab)}
                        style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}
                    >
                        {tab === 'Search Order' && <Search size={14} style={{ marginRight: '4px' }} />}
                        {tab}
                    </button>
                ))}
            </div>

            {renderScheduleContent()}
        </div>
    )
}

export default Schedule

