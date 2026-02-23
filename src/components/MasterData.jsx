import React, { useState, useEffect } from 'react'
import { Database, Plus, Search, Trash2, Edit2, Clock, Activity, Layers, Zap, X, Palette } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = "http://localhost:8000/api"

const MasterData = () => {
    const [activeSubTab, setActiveSubTab] = useState('Units')
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false)
    const [editingShift, setEditingShift] = useState(null)
    const [editingUnit, setEditingUnit] = useState(null)
    const [shifts, setShifts] = useState([])
    const [units, setUnits] = useState([])
    const subTabs = ['Units', 'Shifts', 'Workstations', 'Processes', 'Routes', 'Products']

    useEffect(() => {
        fetchShifts()
        fetchUnits()
    }, [])

    const fetchShifts = async () => {
        try {
            const response = await fetch(`${API_URL}/shifts`)
            const data = await response.json()
            setShifts(data)
        } catch (error) {
            console.error("Error fetching shifts:", error)
        }
    }

    const fetchUnits = async () => {
        try {
            const response = await fetch(`${API_URL}/units`)
            const data = await response.json()
            setUnits(data)
        } catch (error) {
            console.error("Error fetching units:", error)
        }
    }

    const handleAddShift = async (newShift) => {
        try {
            const method = editingShift ? 'PUT' : 'POST'
            const url = editingShift ? `${API_URL}/shifts/${editingShift.id}` : `${API_URL}/shifts`

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newShift)
            })

            if (response.ok) {
                fetchShifts()
                setIsShiftModalOpen(false)
                setEditingShift(null)
            }
        } catch (error) {
            console.error("Error saving shift:", error)
        }
    }

    const handleAddUnit = async (newUnit) => {
        try {
            const method = editingUnit ? 'PUT' : 'POST'
            const url = editingUnit ? `${API_URL}/units/${editingUnit.id}` : `${API_URL}/units`

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUnit)
            })

            if (response.ok) {
                fetchUnits()
                setIsUnitModalOpen(false)
                setEditingUnit(null)
            }
        } catch (error) {
            console.error("Error saving unit:", error)
        }
    }

    const handleEditClick = (shift) => {
        setEditingShift(shift)
        setIsShiftModalOpen(true)
    }

    const handleEditUnitClick = (unit) => {
        setEditingUnit(unit)
        setIsUnitModalOpen(true)
    }

    const handleDeleteShift = async (id) => {
        try {
            const response = await fetch(`${API_URL}/shifts/${id}`, { method: 'DELETE' })
            if (response.ok) fetchShifts()
        } catch (error) {
            console.error("Error deleting shift:", error)
        }
    }

    const handleDeleteUnit = async (id) => {
        try {
            const response = await fetch(`${API_URL}/units/${id}`, { method: 'DELETE' })
            if (response.ok) fetchUnits()
        } catch (error) {
            console.error("Error deleting unit:", error)
        }
    }

    const renderMasterContent = () => {
        switch (activeSubTab) {
            case 'Units':
                return (
                    <div className="card" style={{ borderLeft: '4px solid #4f46e5', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ color: '#4f46e5' }}>
                                    <Layers size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Unit Master</h3>
                                    <p className="card-desc">Define measurement units for process technical values</p>
                                </div>
                            </div>
                            <button
                                className="nav-tab"
                                style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.2rem' }}
                                onClick={() => {
                                    setEditingUnit(null)
                                    setIsUnitModalOpen(true)
                                }}
                            >
                                <Plus size={18} style={{ marginRight: '6px' }} />
                                Add Unit
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                                <input
                                    className="form-input"
                                    placeholder="Search units..."
                                    style={{ paddingLeft: '2.5rem', background: '#f8fafc' }}
                                />
                            </div>
                            <span className="status-badge" style={{ background: '#eff6ff', color: '#3b82f6', fontWeight: 500 }}>
                                {units.length} unit{units.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Unit Name</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Symbol</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Description</th>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map((unit) => (
                                        <tr key={unit.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{unit.name}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className="status-badge" style={{ background: '#f1f5f9', color: '#4f46e5', fontSize: '0.75rem' }}>
                                                    {unit.symbol}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{unit.description}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        className="card-icon"
                                                        style={{ color: '#64748b' }}
                                                        onClick={() => handleEditUnitClick(unit)}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        className="card-icon"
                                                        style={{ color: '#ef4444' }}
                                                        onClick={() => handleDeleteUnit(unit.id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            case 'Shifts':
                return (
                    <>
                        <div className="card" style={{ borderLeft: '4px solid #3b82f6', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Clock color="#3b82f6" />
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Shift Master</h3>
                                        <p className="card-desc">Define shift timings and working hours</p>
                                    </div>
                                </div>
                                <button
                                    className="nav-tab"
                                    style={{ background: '#4f46e5', color: 'white' }}
                                    onClick={() => {
                                        setEditingShift(null)
                                        setIsShiftModalOpen(true)
                                    }}
                                >
                                    <Plus size={16} style={{ marginRight: '6px' }} />
                                    Add Shift
                                </button>
                            </div>

                            <div style={{ marginTop: '1.5rem', position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                                <input
                                    type="text"
                                    placeholder="Search shifts by name or time..."
                                    className="card"
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                />
                            </div>
                            <div className="card-desc" style={{ marginTop: '0.5rem' }}>Showing 3 of 3 shifts</div>
                        </div>

                        <div className="orders-grid">
                            {shifts.map(shift => (
                                <ShiftCard
                                    key={shift.id}
                                    title={shift.title}
                                    start={shift.start}
                                    end={shift.end}
                                    color={shift.color}
                                    onEdit={() => handleEditClick(shift)}
                                    onDelete={() => handleDeleteShift(shift.id)}
                                />
                            ))}
                        </div>
                    </>
                )
            case 'Processes':
                return (
                    <>
                        <div className="card" style={{ borderLeft: '4px solid #a855f7', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Activity color="#a855f7" />
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Process Master</h3>
                                        <p className="card-desc">Define manufacturing steps and standard cycle times</p>
                                    </div>
                                </div>
                                <button className="nav-tab" style={{ background: '#4f46e5', color: 'white' }}>
                                    <Plus size={16} style={{ marginRight: '6px' }} />
                                    Add Process
                                </button>
                            </div>
                        </div>

                        <div className="orders-grid">
                            <ProcessCard title="Drilling" code="PR-SH-001" category="Mechanical" duration="45 min" color="#3b82f6" icon={<Zap size={18} />} />
                            <ProcessCard title="AOI Inspection" code="PR-QC-012" category="Quality" duration="15 min" color="#10b981" icon={<Layers size={18} />} />
                            <ProcessCard title="Screen Printing" code="PR-PR-005" category="Printing" duration="30 min" color="#f97316" icon={<Activity size={18} />} />
                            <ProcessCard title="Lamination" code="PR-SH-008" category="Assembly" duration="120 min" color="#a855f7" icon={<Database size={18} />} />
                        </div>
                    </>
                )
            default:
                return (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                        <Database size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                        <h3>{activeSubTab} management coming soon</h3>
                        <p className="card-desc">This module is currently under development.</p>
                    </div>
                )
        }
    }

    return (
        <div className="master-data-view">
            {/* Sub Tabs */}
            <div className="nav-tabs" style={{ background: 'transparent', padding: '0 0 1.5rem 0', border: 'none', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                {subTabs.map((tab) => (
                    <button
                        key={tab}
                        className={`nav-tab ${activeSubTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveSubTab(tab)}
                        style={{ fontSize: '0.8125rem' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {renderMasterContent()}

            <AnimatePresence>
                {isShiftModalOpen && (
                    <ShiftModal
                        onClose={() => {
                            setIsShiftModalOpen(false)
                            setEditingShift(null)
                        }}
                        onAdd={handleAddShift}
                        editData={editingShift}
                    />
                )}
                {isUnitModalOpen && (
                    <UnitModal
                        onClose={() => {
                            setIsUnitModalOpen(false)
                            setEditingUnit(null)
                        }}
                        onAdd={handleAddUnit}
                        editData={editingUnit}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

const UnitModal = ({ onClose, onAdd, editData }) => {
    const [name, setName] = useState(editData ? editData.name : '')
    const [symbol, setSymbol] = useState(editData ? editData.symbol : '')
    const [description, setDescription] = useState(editData ? editData.description : '')

    const handleSave = () => {
        if (!name || !symbol) return
        onAdd({ name, symbol, description })
    }

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                style={{ maxWidth: '450px' }}
            >
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{editData ? 'Edit Unit' : 'Add New Unit'}</h2>
                        <p className="card-desc">Enter unit details for measurement.</p>
                    </div>
                    <button className="card-icon" onClick={onClose} style={{ color: '#64748b' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Unit Name</label>
                    <input
                        className="form-input"
                        placeholder="e.g., 20 min"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Symbol</label>
                    <input
                        className="form-input"
                        placeholder="e.g., %"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-input"
                        placeholder="Enter description"
                        style={{ minHeight: '80px', paddingTop: '0.5rem' }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-modal btn-create"
                        onClick={handleSave}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {editData ? 'Update Unit' : 'Add Unit'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const ShiftModal = ({ onClose, onAdd, editData }) => {
    const [name, setName] = useState(editData ? editData.title : '')
    const [beginTime, setBeginTime] = useState(editData ? editData.start : '')
    const [endTime, setEndTime] = useState(editData ? editData.end : '')
    const [selectedColor, setSelectedColor] = useState(editData ? editData.color : '#3b82f6')
    const colors = ['#3b82f6', '#a855f7', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#64748b', '#ef4444']

    const handleSave = () => {
        if (!name || !beginTime || !endTime) return
        onAdd({ title: name, start: beginTime, end: endTime, color: selectedColor })
    }

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                style={{ maxWidth: '500px' }}
            >
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title" style={{ marginBottom: '4px' }}>
                            {editData ? 'Edit Shift' : 'Add New Shift'}
                        </h2>
                        <p className="card-desc">
                            {editData ? 'Modify existing shift details.' : 'Create a new work shift with timing and color.'}
                        </p>
                    </div>
                    <button className="card-icon" onClick={onClose} style={{ color: '#64748b' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Shift Name</label>
                    <input
                        className="form-input"
                        placeholder="e.g., Morning Shift"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label className="form-label">Begin Time</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="form-input"
                                placeholder="--:--"
                                value={beginTime}
                                onChange={(e) => setBeginTime(e.target.value)}
                            />
                            <Clock size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8', opacity: 0.5 }} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Time</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="form-input"
                                placeholder="--:--"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                            <Clock size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8', opacity: 0.5 }} />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Palette size={16} /> Color Code
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
                        {colors.map(color => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                style={{
                                    height: '50px',
                                    background: color,
                                    borderRadius: '10px',
                                    border: selectedColor === color ? '2px solid #000' : 'none',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="card-desc">Or pick custom:</span>
                    <div style={{
                        width: '60px',
                        height: '30px',
                        background: selectedColor,
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer'
                    }}></div>
                </div>

                <div className="modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose}>Cancel</button>
                    <button
                        className="btn-modal btn-create"
                        onClick={handleSave}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {editData ? 'Update Shift' : 'Add Shift'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const ShiftCard = ({ title, start, end, color, onEdit, onDelete }) => (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{title}</h3>
            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: color }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Start:</span>
                <span style={{ fontWeight: 600 }}>{start}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>End:</span>
                <span style={{ fontWeight: 600 }}>{end}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Duration:</span>
                <span className="nav-tab active" style={{ color: '#3b82f6', padding: '2px 8px', fontSize: '0.75rem' }}>8h 0m</span>
            </div>
        </div>

        <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', marginTop: '1.5rem', paddingTop: '0.5rem' }}>
            <button
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.5rem', fontSize: '0.875rem', color: '#1e293b' }}
                onClick={onEdit}
            >
                <Edit2 size={14} /> Edit
            </button>
            <div style={{ width: '1px', background: '#f1f5f9' }}></div>
            <button
                style={{ padding: '0.5rem 1rem', color: '#ef4444' }}
                onClick={onDelete}
            >
                <Trash2 size={14} />
            </button>
        </div>
    </div>
)

const ProcessCard = ({ title, code, category, duration, color, icon }) => (
    <div className="card" style={{ borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', borderRadius: '8px', background: `${color}10`, color: color }}>
                    {icon}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{title}</h3>
                    <div className="card-desc">{code}</div>
                </div>
            </div>
            <span className="status-badge" style={{ background: `${color}10`, color: color }}>{category}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Std. Cycle Time:</span>
                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {duration}
                </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748b' }}>Efficiency Goal:</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>95%</span>
            </div>
        </div>

        <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', marginTop: '1rem', paddingTop: '0.5rem' }}>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.5rem', fontSize: '0.875rem', color: '#1e293b' }}>
                <Edit2 size={14} /> Edit
            </button>
            <div style={{ width: '1px', background: '#f1f5f9' }}></div>
            <button style={{ padding: '0.5rem 1rem', color: '#ef4444' }}>
                <Trash2 size={14} />
            </button>
        </div>
    </div>
)

export default MasterData


