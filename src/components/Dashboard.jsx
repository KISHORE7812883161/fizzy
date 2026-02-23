import React from 'react'
import { Clock, AlertTriangle, TrendingUp, Activity } from 'lucide-react'

const Dashboard = () => {
    return (
        <div className="dashboard-view">
            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="card card-accent-blue">
                    <div className="card-header">
                        <span className="card-title">Active Orders</span>
                        <Clock className="card-icon" size={20} color="#3b82f6" />
                    </div>
                    <div className="card-value" style={{ color: '#3b82f6' }}>1</div>
                    <div className="card-desc">Currently in production</div>
                </div>

                <div className="card card-accent-red">
                    <div className="card-header">
                        <span className="card-title">Delayed Orders</span>
                        <AlertTriangle className="card-icon" size={20} color="#ef4444" />
                    </div>
                    <div className="card-value" style={{ color: '#ef4444' }}>1</div>
                    <div className="card-desc">Behind schedule</div>
                </div>

                <div className="card card-accent-purple">
                    <div className="card-header">
                        <span className="card-title">Total Jobs</span>
                        <TrendingUp className="card-icon" size={20} color="#a855f7" />
                    </div>
                    <div className="card-value" style={{ color: '#a855f7' }}>20</div>
                    <div className="card-desc">Scheduled operations</div>
                </div>

                <div className="card card-accent-green">
                    <div className="card-header">
                        <span className="card-title">Avg Utilization</span>
                        <Activity className="card-icon" size={20} color="#10b981" />
                    </div>
                    <div className="card-value" style={{ color: '#10b981' }}>27.7%</div>
                    <div className="card-desc">Workstation capacity used</div>
                </div>
            </div>

            {/* Order Schedule Summary */}
            <div className="card table-card" style={{ borderLeft: '4px solid #3b82f6' }}>
                <h2 className="table-title">Order Schedule Summary</h2>
                <p className="table-subtitle">Completion dates and delivery status</p>
                <table>
                    <thead>
                        <tr>
                            <th>Order Number</th>
                            <th>Products</th>
                            <th>Delivery Date</th>
                            <th>Completion Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: 600 }}>ORD-2024-001</td>
                            <td>
                                <span className="nav-tab active" style={{ display: 'inline-flex', padding: '2px 8px', fontSize: '0.75rem', marginRight: '4px' }}>Standard PCB (50)</span>
                                <span className="nav-tab active" style={{ display: 'inline-flex', padding: '2px 8px', fontSize: '0.75rem' }}>HDI PCB (30)</span>
                            </td>
                            <td>Dec 26, 2024</td>
                            <td style={{ color: '#ef4444' }}>Mar 02, 2026 10:47</td>
                            <td>
                                <span className="status-badge status-delayed">Delayed</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Workstation Capacity Utilization */}
            <div className="card">
                <h2 className="table-title">Workstation Capacity Utilization</h2>
                <p className="table-subtitle">Resource usage and idle time analysis</p>

                <div className="utilization-item">
                    <div className="utilization-info">
                        <div>
                            <div className="utilization-label">AOI</div>
                            <div className="card-desc">0 / 960 minutes</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="utilization-percentage">0.0%</div>
                            <div className="card-desc">Idle: 960 min</div>
                        </div>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '0%' }}></div>
                    </div>
                </div>

                <div className="utilization-item">
                    <div className="utilization-info">
                        <div>
                            <div className="utilization-label">DRILLING</div>
                            <div className="card-desc">520 / 1440 minutes</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="utilization-percentage" style={{ color: '#10b981' }}>36.1%</div>
                            <div className="card-desc">Idle: 920 min</div>
                        </div>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '36.1%' }}></div>
                    </div>
                </div>

                <div className="utilization-item">
                    <div className="utilization-info">
                        <div>
                            <div className="utilization-label">BBT</div>
                            <div className="card-desc">0 / 960 minutes</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="utilization-percentage">0.0%</div>
                            <div className="card-desc">Idle: 960 min</div>
                        </div>
                    </div>
                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: '0%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
