import React, { useState, useEffect } from 'react'
import { Database, Plus, Search, Trash2, Edit2, Clock, Activity, Layers, Zap, X, Palette, Settings, Cpu, GitBranch, Box, Navigation, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:8000/api"

// --- Helper Components ---

const HeaderSection = ({ title, desc, icon: Icon, color, onAdd, count, itemName, showFilters = false, totalCount, searchTerm, setSearchTerm, routeFilter, setRouteFilter }) => (
    <div className="card" style={{ borderLeft: `6px solid ${color}`, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ color }}>
                    {Icon && <Icon size={24} />}
                </div>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
                    <p className="card-desc" style={{ fontSize: '0.875rem' }}>{desc}</p>
                </div>
            </div>
            <button
                className="btn-modal btn-create"
                style={{ background: color, display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', fontSize: '0.875rem' }}
                onClick={onAdd}
            >
                <Plus size={18} />
                Add {itemName}
            </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                    className="form-input"
                    placeholder={`Search ${itemName.toLowerCase()}s...`}
                    style={{ paddingLeft: '2.5rem', background: '#f8fafc', height: '40px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap' }}>Page size:</span>
                    <select className="form-input" style={{ width: '70px', height: '35px', padding: '0 8px', fontSize: '0.75rem' }}>
                        <option>6</option>
                        <option>10</option>
                        <option>20</option>
                    </select>
                </div>
            </div>
        </div>

        {showFilters && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                {['All Routes', 'Main Routes', 'Sub Routes'].map(f => (
                    <button
                        key={f}
                        onClick={() => setRouteFilter(f)}
                        className="status-badge"
                        style={{
                            background: routeFilter === f ? '#f1f5f9' : 'transparent',
                            color: routeFilter === f ? '#1e293b' : '#64748b',
                            border: `1px solid ${routeFilter === f ? '#e2e8f0' : 'transparent'}`,
                            padding: '6px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        {f === 'Main Routes' && <Layers size={14} />}
                        {f === 'Sub Routes' && <Navigation size={14} />}
                        {f}
                    </button>
                ))}
            </div>
        )}

        <div className="card-desc" style={{ marginTop: '1rem' }}>
            Showing {count} of {totalCount} {itemName.toLowerCase()}s
        </div>
    </div>
)

const PaginationFooter = ({ page, totalPages }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', padding: '0 0.5rem' }}>
        <span className="card-desc">Page {page} of {totalPages}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="nav-tab" style={{ padding: '0.5rem', minWidth: 'auto', background: 'white', border: '1px solid #e2e8f0' }}>
                <ChevronLeft size={18} />
            </button>
            <button className="nav-tab" style={{ padding: '0.5rem', minWidth: 'auto', background: 'white', border: '1px solid #e2e8f0' }}>
                <ChevronRight size={18} />
            </button>
        </div>
    </div>
)

// --- Modals ---

const UnitModal = ({ onClose, onAdd, editData }) => {
    const [name, setName] = useState(editData?.name || '')
    const [symbol, setSymbol] = useState(editData?.symbol || '')
    const [description, setDescription] = useState(editData?.description || '')

    const handleSave = () => {
        if (!name || !symbol) return
        onAdd({ name, symbol, description })
    }

    return (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ maxWidth: '450px' }}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{editData ? 'Edit Unit' : 'Add New Unit'}</h2>
                        <p className="card-desc">Enter unit details for measurement.</p>
                    </div>
                    <button className="card-icon" onClick={onClose} style={{ color: '#64748b' }}><X size={20} /></button>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Unit Name</label>
                    <input className="form-input" placeholder="e.g., 20 min" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Symbol</label>
                    <input className="form-input" placeholder="e.g., %" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" placeholder="Enter description" style={{ minHeight: '80px', paddingTop: '0.5rem' }} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-modal btn-create" onClick={handleSave}>{editData ? 'Update Unit' : 'Add Unit'}</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const ShiftModal = ({ onClose, onAdd, editData }) => {
    const [name, setName] = useState(editData?.title || '')
    const [beginTime, setBeginTime] = useState(editData?.start || '')
    const [endTime, setEndTime] = useState(editData?.end || '')
    const [selectedColor, setSelectedColor] = useState(editData?.color || '#3b82f6')
    const colors = ['#3b82f6', '#a855f7', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#64748b', '#ef4444']

    const handleSave = () => {
        if (!name || !beginTime || !endTime) return
        onAdd({ title: name, start: beginTime, end: endTime, color: selectedColor })
    }

    return (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title" style={{ marginBottom: '4px' }}>{editData ? 'Edit Shift' : 'Add New Shift'}</h2>
                        <p className="card-desc">{editData ? 'Modify existing shift details.' : 'Create a new work shift with timing and color.'}</p>
                    </div>
                    <button className="card-icon" onClick={onClose} style={{ color: '#64748b' }}><X size={20} /></button>
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Shift Name</label>
                    <input className="form-input" placeholder="e.g., Morning Shift" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label className="form-label">Begin Time</label>
                        <div style={{ position: 'relative' }}>
                            <input className="form-input" placeholder="--:--" value={beginTime} onChange={(e) => setBeginTime(e.target.value)} />
                            <Clock size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8', opacity: 0.5 }} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Time</label>
                        <div style={{ position: 'relative' }}>
                            <input className="form-input" placeholder="--:--" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                            <Clock size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8', opacity: 0.5 }} />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Palette size={16} /> Color Code</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
                        {colors.map(color => (
                            <button key={color} onClick={() => setSelectedColor(color)} style={{ height: '50px', background: color, borderRadius: '10px', border: selectedColor === color ? '2px solid #000' : 'none', transition: 'transform 0.2s' }} />
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-modal btn-create" onClick={handleSave}>{editData ? 'Update Shift' : 'Add Shift'}</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const WorkstationModal = ({ onClose, onAdd, shifts, editData }) => {
    const [name, setName] = useState(editData?.name || '')
    const [description, setDescription] = useState(editData?.description || '')
    const [assignments, setAssignments] = useState(editData?.shift_assignments || [])

    const handleSave = () => {
        if (!name) return
        onAdd({
            name,
            description,
            shift_assignments: assignments.map(a => ({
                ...a,
                shift_id: parseInt(a.shift_id)
            })).filter(a => !isNaN(a.shift_id))
        })
    }

    return (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{editData ? 'Edit Workstation' : 'Add New Workstation'}</h2>
                        <p className="card-desc">Create/Update workstation and assign shifts with date ranges.</p>
                    </div>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Workstation Name</label>
                    <input className="form-input" placeholder="e.g., CNC Machine 1" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Description</label>
                    <input className="form-input" placeholder="e.g., High precision CNC machine" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="items-container">
                    <div className="form-label" style={{ marginBottom: '1rem' }}>Shift Assignments</div>
                    {assignments.map((a, i) => (
                        <div key={i} className="form-grid" style={{ marginBottom: '0.5rem' }}>
                            <select className="form-input" value={a.shift_id} onChange={e => {
                                const newA = [...assignments]; newA[i].shift_id = parseInt(e.target.value); setAssignments(newA);
                            }}>
                                <option value="">Select shift</option>
                                {shifts.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                            </select>
                            <input type="date" className="form-input" value={a.start_date} onChange={e => {
                                const newA = [...assignments]; newA[i].start_date = e.target.value; setAssignments(newA);
                            }} />
                            <input type="date" className="form-input" value={a.end_date} onChange={e => {
                                const newA = [...assignments]; newA[i].end_date = e.target.value; setAssignments(newA);
                            }} />
                        </div>
                    ))}
                    <button className="nav-tab" style={{ border: '1px dashed #cbd5e1', width: '100%', justifyContent: 'center' }}
                        onClick={() => setAssignments([...assignments, { shift_id: '', start_date: '', end_date: '' }])}>
                        <Plus size={16} /> Add Shift Assignment
                    </button>
                </div>
                <div className="modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-modal btn-create" onClick={handleSave}>{editData ? 'Update Workstation' : 'Add Workstation'}</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const ProcessModal = ({ onClose, onAdd, workstations, units, editData }) => {
    const [name, setName] = useState(editData?.name || '')
    const [description, setDescription] = useState(editData?.description || '')
    const [workstationId, setWorkstationId] = useState(editData?.workstation_id || '')
    const [processTime, setProcessTime] = useState(editData?.process_time || 0)
    const [setupTime, setSetupTime] = useState(editData?.setup_time || 0)
    const [techValues, setTechValues] = useState(editData?.technical_values || [])

    const handleSave = () => {
        if (!name || !workstationId) return
        onAdd({
            name,
            description,
            workstation_id: parseInt(workstationId),
            process_time: parseFloat(processTime),
            setup_time: parseFloat(setupTime),
            technical_values: techValues
        })
    }

    return (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{editData ? 'Edit Process' : 'Add New Process'}</h2>
                        <p className="card-desc">Create/Update a manufacturing operation with technical parameters.</p>
                    </div>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Process Name</label>
                    <input className="form-input" placeholder="e.g., CNC Machining" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Description</label>
                    <input className="form-input" placeholder="Detailed description..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Workstation</label>
                    <select className="form-input" value={workstationId} onChange={e => setWorkstationId(e.target.value)}>
                        <option value="">Select workstation</option>
                        {workstations.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Process Time (min/piece)</label>
                        <input type="number" className="form-input" value={processTime} onChange={e => setProcessTime(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Setup Time (min)</label>
                        <input type="number" className="form-input" value={setupTime} onChange={e => setSetupTime(e.target.value)} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-modal btn-create" onClick={handleSave}>{editData ? 'Update Process' : 'Add Process'}</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const RouteModal = ({ onClose, onAdd, processes, editData }) => {
    const [name, setName] = useState(editData?.name || '')
    const [description, setDescription] = useState(editData?.description || '')
    const [type, setType] = useState(editData?.type || 'Main')
    const [sequence, setSequence] = useState(editData?.process_sequence || [])

    const handleSave = () => {
        if (!name) return
        onAdd({
            name,
            description,
            type,
            process_sequence: sequence.map(id => parseInt(id)).filter(id => !isNaN(id))
        })
    }

    return (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{editData ? 'Edit Route' : 'Add New Route'}</h2>
                        <p className="card-desc">Create/Update a main route or sub-route with a sequence of processes.</p>
                    </div>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Route Name</label>
                    <input className="form-input" placeholder="e.g., Standard 4-Layer PCB Route" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Route Type</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className={`nav-tab ${type === 'Main' ? 'active' : ''}`} onClick={() => setType('Main')} style={{ background: type === 'Main' ? '#f97316' : '#f1f5f9', color: type === 'Main' ? 'white' : '#64748b' }}>Main Route</button>
                        <button className={`nav-tab ${type === 'Sub' ? 'active' : ''}`} onClick={() => setType('Sub')} style={{ background: type === 'Sub' ? '#8b5cf6' : '#f1f5f9', color: type === 'Sub' ? 'white' : '#64748b' }}>Sub Route</button>
                    </div>
                </div>
                <div className="items-container">
                    <div className="form-label" style={{ marginBottom: '1rem' }}>Process Sequence</div>
                    {sequence.map((pid, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                            <span style={{ minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.7rem', color: '#64748b' }}>{i + 1}</span>
                            <select className="form-input" value={pid} onChange={e => {
                                const newS = [...sequence]; newS[i] = e.target.value; setSequence(newS);
                            }}>
                                <option value="">Select process</option>
                                {processes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <button onClick={() => setSequence(sequence.filter((_, idx) => idx !== i))} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                    ))}
                    <button className="nav-tab" style={{ border: '1px dashed #cbd5e1', width: '100%', justifyContent: 'center' }}
                        onClick={() => setSequence([...sequence, ''])}>
                        <Plus size={16} /> Add Process to Sequence
                    </button>
                </div>
                <div className="modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-modal btn-create" onClick={handleSave}>{editData ? 'Update Route' : 'Add Route'}</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

const ProductModal = ({ onClose, onAdd, routes, editData }) => {
    const [name, setName] = useState(editData?.name || '')
    const [description, setDescription] = useState(editData?.description || '')
    const [routeId, setRouteId] = useState(editData?.main_route_id || '')

    const handleSave = () => {
        if (!name) return
        onAdd({
            name,
            description,
            main_route_id: routeId ? parseInt(routeId) : null
        })
    }

    return (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-content" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">{editData ? 'Edit Product' : 'Add New Product'}</h2>
                        <p className="card-desc">Create/Update a product by selecting a main route.</p>
                    </div>
                    <button onClick={onClose}><X /></button>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Product Name</label>
                    <input className="form-input" placeholder="e.g., PCB 4-Layer HDI" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-input" placeholder="Specifications..." value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Main Route</label>
                    <select className="form-input" value={routeId} onChange={e => setRouteId(e.target.value)}>
                        <option value="">Select main route</option>
                        {routes.filter(r => r.type === 'Main').map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
                <div className="modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-modal btn-create" onClick={handleSave}>{editData ? 'Update Product' : 'Add Product'}</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

// --- Cards ---

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
        </div>
        <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', marginTop: '1.5rem', paddingTop: '0.5rem' }}>
            <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0.5rem', fontSize: '0.875rem', color: '#1e293b' }} onClick={onEdit}><Edit2 size={14} /> Edit</button>
            <div style={{ width: '1px', background: '#f1f5f9' }}></div>
            <button style={{ padding: '0.5rem 1rem', color: '#ef4444' }} onClick={onDelete}><Trash2 size={14} /></button>
        </div>
    </div>
)

const WorkstationCard = ({ workstation, shifts, onEdit, onDelete }) => (
    <div className="card" style={{ borderLeft: '4px solid #d946ef', minHeight: '220px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>{workstation.name}</h3>
            <Settings size={20} color="#d946ef" style={{ opacity: 0.8 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
            <Clock size={14} />
            <span>{workstation.shift_assignments?.length || 0} shift assignments</span>
        </div>

        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 500 }}>Assigned Shifts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {workstation.shift_assignments?.length > 0 ? workstation.shift_assignments.map((a, i) => {
                    const shift = shifts.find(s => s.id === parseInt(a.shift_id));
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: shift?.color || '#94a3b8' }} />
                            <span style={{ fontSize: '0.8125rem', color: '#334155', fontWeight: 500 }}>
                                {shift?.title || 'Unknown Shift'}
                            </span>
                        </div>
                    );
                }) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8 italic' }}>No shifts assigned</span>
                )}
            </div>
        </div>

        <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', marginTop: '1rem' }}>
            <button style={{ flex: 1, color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600 }} onClick={onEdit}>
                <Edit2 size={14} /> Edit
            </button>
            <button style={{ padding: '0.5rem', color: '#ef4444' }} onClick={onDelete}>
                <Trash2 size={14} />
            </button>
        </div>
    </div>
)

const ProcessCard = ({ process, workstationName, onEdit, onDelete }) => (
    <div className="card" style={{ borderLeft: '4px solid #f97316', minHeight: '200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>{process.name}</h3>
                <div className="card-desc" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{workstationName}</div>
            </div>
            <Settings size={18} color="#f97316" style={{ opacity: 0.8 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem' }}>
                    <Clock size={14} /> Process Time
                </div>
                <span className="status-badge" style={{ background: '#eff6ff', color: '#3b82f6', fontSize: '0.75rem' }}>{process.process_time} min/pc</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem' }}>
                    <Settings size={14} /> Setup Time
                </div>
                <span className="status-badge" style={{ background: '#f5f3ff', color: '#a855f7', fontSize: '0.75rem' }}>{process.setup_time} min</span>
            </div>
        </div>

        <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
            <button style={{ flex: 1, color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600 }} onClick={onEdit}>
                <Edit2 size={14} /> Edit
            </button>
            <button style={{ padding: '0.5rem', color: '#ef4444' }} onClick={onDelete}>
                <Trash2 size={14} />
            </button>
        </div>
    </div>
)

const RouteCard = ({ route, processes, onEdit, onDelete }) => (
    <div className="card" style={{ borderLeft: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>{route.name}</h3>
                {route.type === 'Main' && <span className="status-badge" style={{ background: '#fff7ed', color: '#f97316', border: '1px solid #ffedd5', fontSize: '0.65rem' }}>Main</span>}
            </div>
            <Layers size={20} color="#8b5cf6" style={{ opacity: 0.8 }} />
        </div>
        <div className="card-desc" style={{ marginBottom: '1.5rem', fontSize: '0.75rem' }}>{route.description}</div>

        <div style={{ flex: 1, marginBottom: '1.5rem' }}>
            <div className="card-desc" style={{ marginBottom: '0.75rem', fontWeight: 500 }}>Process Sequence ({route.process_sequence?.length || 0} steps)</div>
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.75rem', maxHeight: '180px', overflowY: 'auto', border: '1px solid #f1f5f9' }}>
                {route.process_sequence?.length > 0 ? route.process_sequence.map((pid, idx) => {
                    const proc = processes.find(p => p.id === pid);
                    return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.6rem 0', borderBottom: idx === route.process_sequence.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                            <span style={{ minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.7rem', color: '#64748b' }}>{idx + 1}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ChevronRight size={12} color="#94a3b8" />
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>{proc?.name || 'Unknown Process'}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Operation</div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem' }}>No processes in sequence</div>
                )}
            </div>
        </div>

        <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
            <button style={{ flex: 1, color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600 }} onClick={onEdit}>
                <Edit2 size={14} /> Edit
            </button>
            <button style={{ padding: '0.5rem', color: '#ef4444' }} onClick={onDelete}>
                <Trash2 size={14} />
            </button>
        </div>
    </div>
)

// --- Main Component ---

const MasterData = () => {
    const [activeSubTab, setActiveSubTab] = useState('Units')
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false)
    const [isWorkstationModalOpen, setIsWorkstationModalOpen] = useState(false)
    const [isProcessModalOpen, setIsProcessModalOpen] = useState(false)
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)

    const [editingShift, setEditingShift] = useState(null)
    const [editingUnit, setEditingUnit] = useState(null)
    const [editingWorkstation, setEditingWorkstation] = useState(null)
    const [editingProcess, setEditingProcess] = useState(null)
    const [editingRoute, setEditingRoute] = useState(null)
    const [editingProduct, setEditingProduct] = useState(null)

    const [shifts, setShifts] = useState([])
    const [units, setUnits] = useState([])
    const [workstations, setWorkstations] = useState([])
    const [processes, setProcesses] = useState([])
    const [routes, setRoutes] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [routeFilter, setRouteFilter] = useState('All Routes')
    const subTabs = ['Units', 'Shifts', 'Workstations', 'Processes', 'Routes', 'Products']

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        setLoading(true)
        try {
            await Promise.all([
                fetchShifts(),
                fetchUnits(),
                fetchWorkstations(),
                fetchProcesses(),
                fetchRoutes(),
                fetchProducts()
            ])
        } catch (error) {
            console.error("Error fetching all data:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchShifts = async () => {
        const res = await fetch(`${API_URL}/shifts`); const data = await res.json(); setShifts(data);
    }
    const fetchUnits = async () => {
        const res = await fetch(`${API_URL}/units`); const data = await res.json(); setUnits(data);
    }
    const fetchWorkstations = async () => {
        const res = await fetch(`${API_URL}/workstations`); const data = await res.json(); setWorkstations(data);
    }
    const fetchProcesses = async () => {
        const res = await fetch(`${API_URL}/processes`); const data = await res.json(); setProcesses(data);
    }
    const fetchRoutes = async () => {
        const res = await fetch(`${API_URL}/routes`); const data = await res.json(); setRoutes(data);
    }
    const fetchProducts = async () => {
        const res = await fetch(`${API_URL}/products`); const data = await res.json(); setProducts(data);
    }

    const handleAddShift = async (s) => {
        const method = editingShift ? 'PUT' : 'POST'
        const url = editingShift ? `${API_URL}/shifts/${editingShift.id}` : `${API_URL}/shifts`
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) })
        fetchShifts(); setIsShiftModalOpen(false); setEditingShift(null);
    }

    const handleAddUnit = async (u) => {
        const method = editingUnit ? 'PUT' : 'POST'
        const url = editingUnit ? `${API_URL}/units/${editingUnit.id}` : `${API_URL}/units`
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(u) })
        fetchUnits(); setIsUnitModalOpen(false); setEditingUnit(null);
    }

    const handleAddWorkstation = async (ws) => {
        const method = editingWorkstation ? 'PUT' : 'POST'
        const url = editingWorkstation ? `${API_URL}/workstations/${editingWorkstation.id}` : `${API_URL}/workstations`
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ws) })
        fetchWorkstations(); setIsWorkstationModalOpen(false); setEditingWorkstation(null);
    }

    const handleAddProcess = async (p) => {
        const method = editingProcess ? 'PUT' : 'POST'
        const url = editingProcess ? `${API_URL}/processes/${editingProcess.id}` : `${API_URL}/processes`
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
        fetchProcesses(); setIsProcessModalOpen(false); setEditingProcess(null);
    }

    const handleAddRoute = async (r) => {
        const method = editingRoute ? 'PUT' : 'POST'
        const url = editingRoute ? `${API_URL}/routes/${editingRoute.id}` : `${API_URL}/routes`
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(r) })
        fetchRoutes(); setIsRouteModalOpen(false); setEditingRoute(null);
    }

    const handleAddProduct = async (p) => {
        const method = editingProduct ? 'PUT' : 'POST'
        const url = editingProduct ? `${API_URL}/products/${editingProduct.id}` : `${API_URL}/products`
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) })
        fetchProducts(); setIsProductModalOpen(false); setEditingProduct(null);
    }

    const handleDeleteShift = async (id) => { await fetch(`${API_URL}/shifts/${id}`, { method: 'DELETE' }); fetchShifts(); }
    const handleDeleteUnit = async (id) => { await fetch(`${API_URL}/units/${id}`, { method: 'DELETE' }); fetchUnits(); }
    const handleDeleteWorkstation = async (id) => { await fetch(`${API_URL}/workstations/${id}`, { method: 'DELETE' }); fetchWorkstations(); }
    const handleDeleteProcess = async (id) => { await fetch(`${API_URL}/processes/${id}`, { method: 'DELETE' }); fetchProcesses(); }
    const handleDeleteRoute = async (id) => { await fetch(`${API_URL}/routes/${id}`, { method: 'DELETE' }); fetchRoutes(); }
    const handleDeleteProduct = async (id) => { await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' }); fetchProducts(); }

    const renderMasterContent = () => {
        const filteredShifts = shifts.filter(s => s.title?.toLowerCase().includes(searchTerm.toLowerCase()))
        const filteredUnits = units.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.symbol?.toLowerCase().includes(searchTerm.toLowerCase()))
        const filteredWorkstations = workstations.filter(w => w.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        const filteredProcesses = processes.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        const filteredRoutes = routes.filter(r => {
            const matchesSearch = r.name?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesFilter = routeFilter === 'All Routes' || (routeFilter === 'Main Routes' && r.type === 'Main') || (routeFilter === 'Sub Routes' && r.type === 'Sub')
            return matchesSearch && matchesFilter
        })
        const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))

        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <div className="loading-spinner"></div>
                </div>
            )
        }

        switch (activeSubTab) {
            case 'Units':
                return (
                    <>
                        <HeaderSection
                            title="Unit Master"
                            desc="Define measurement units for process technical values"
                            icon={Layers}
                            color="#4f46e5"
                            itemName="Unit"
                            onAdd={() => { setEditingUnit(null); setIsUnitModalOpen(true); }}
                            count={filteredUnits.length}
                            totalCount={units.length}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <div className="card" style={{ padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Unit Name</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Symbol</th>
                                        <th style={{ textAlign: 'left', padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Description</th>
                                        <th style={{ textAlign: 'right', padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUnits.length > 0 ? filteredUnits.map((u) => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 500 }}>{u.name}</td>
                                            <td style={{ padding: '1rem' }}><span className="status-badge" style={{ background: '#f1f5f9', color: '#4f46e5', fontSize: '0.75rem' }}>{u.symbol}</span></td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{u.description}</td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button className="card-icon" onClick={() => { setEditingUnit(u); setIsUnitModalOpen(true); }}><Edit2 size={16} /></button>
                                                    <button className="card-icon" style={{ color: '#ef4444' }} onClick={() => handleDeleteUnit(u.id)}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No units found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )
            case 'Shifts':
                return (
                    <>
                        <HeaderSection
                            title="Shift Master"
                            desc="Define shift timings and working hours"
                            icon={Clock}
                            color="#3b82f6"
                            itemName="Shift"
                            onAdd={() => { setEditingShift(null); setIsShiftModalOpen(true); }}
                            count={filteredShifts.length}
                            totalCount={shifts.length}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <div className="orders-grid">
                            {filteredShifts.map(s => (
                                <ShiftCard key={s.id} {...s} onEdit={() => { setEditingShift(s); setIsShiftModalOpen(true); }} onDelete={() => handleDeleteShift(s.id)} />
                            ))}
                        </div>
                    </>
                )
            case 'Workstations':
                return (
                    <>
                        <HeaderSection
                            title="Workstation Master"
                            desc="Manage machines and work centers with shift schedules"
                            icon={Settings}
                            color="#d946ef"
                            itemName="Workstation"
                            onAdd={() => { setEditingWorkstation(null); setIsWorkstationModalOpen(true); }}
                            count={filteredWorkstations.length}
                            totalCount={workstations.length}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        {/* Shift Legend */}
                        {shifts.length > 0 && (
                            <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                    {shifts.map(s => (
                                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: s.color }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>{s.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="orders-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                            {filteredWorkstations.map(ws => (
                                <WorkstationCard key={ws.id} workstation={ws} shifts={shifts} onEdit={() => { setEditingWorkstation(ws); setIsWorkstationModalOpen(true); }} onDelete={() => handleDeleteWorkstation(ws.id)} />
                            ))}
                        </div>
                    </>
                )
            case 'Processes':
                return (
                    <>
                        <HeaderSection
                            title="Process Master"
                            desc="Define individual manufacturing operations and their timings"
                            icon={Cpu}
                            color="#f97316"
                            itemName="Process"
                            onAdd={() => { setEditingProcess(null); setIsProcessModalOpen(true); }}
                            count={filteredProcesses.length}
                            totalCount={processes.length}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <div className="orders-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                            {filteredProcesses.map(p => (
                                <ProcessCard key={p.id} process={p} workstationName={workstations.find(w => w.id === p.workstation_id)?.name || 'Unknown'} onEdit={() => { setEditingProcess(p); setIsProcessModalOpen(true); }} onDelete={() => handleDeleteProcess(p.id)} />
                            ))}
                        </div>
                    </>
                )
            case 'Routes':
                return (
                    <>
                        <HeaderSection
                            title="Route Master"
                            desc="Define main routes and sub-routes with process sequences"
                            icon={GitBranch}
                            color="#8b5cf6"
                            itemName="Route"
                            onAdd={() => { setEditingRoute(null); setIsRouteModalOpen(true); }}
                            count={filteredRoutes.length}
                            totalCount={routes.length}
                            showFilters={true}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            routeFilter={routeFilter}
                            setRouteFilter={setRouteFilter}
                        />
                        <div className="orders-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
                            {filteredRoutes.map(r => (
                                <RouteCard key={r.id} route={r} processes={processes} onEdit={() => { setEditingRoute(r); setIsRouteModalOpen(true); }} onDelete={() => handleDeleteRoute(r.id)} />
                            ))}
                        </div>
                    </>
                )
            case 'Products':
                return (
                    <>
                        <HeaderSection
                            title="Product Master"
                            desc="Define products with main routes"
                            icon={Box}
                            color="#10b981"
                            itemName="Product"
                            onAdd={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                            count={filteredProducts.length}
                            totalCount={products.length}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <div className="card" style={{ padding: 0 }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600 }}>Product Name</th>
                                        <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600 }}>Main Route</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }} className="table-row-hover">
                                            <td style={{ padding: '1rem', fontWeight: 600 }}>{p.name}</td>
                                            <td style={{ padding: '1rem' }}><span className="status-badge" style={{ background: '#f1f5f9', color: '#3b82f6' }}>{routes.find(r => r.id === p.main_route_id)?.name || 'No route'}</span></td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button className="card-icon" onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }}><Edit2 size={16} /></button>
                                                    <button className="card-icon" style={{ color: '#ef4444' }} onClick={() => handleDeleteProduct(p.id)}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )
            default: return null
        }
    }

    return (
        <div className="master-data-view">
            <div className="nav-tabs" style={{ background: 'transparent', padding: '0 0 1.5rem 0', border: 'none', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                {subTabs.map((tab) => (
                    <button
                        key={tab}
                        className={`nav-tab ${activeSubTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveSubTab(tab)}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem', border: activeSubTab === tab ? 'none' : '1px solid #e2e8f0', background: activeSubTab === tab ? 'white' : 'transparent' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {renderMasterContent()}

            <AnimatePresence>
                {isShiftModalOpen && <ShiftModal onClose={() => { setIsShiftModalOpen(false); setEditingShift(null); }} onAdd={handleAddShift} editData={editingShift} />}
                {isUnitModalOpen && <UnitModal onClose={() => { setIsUnitModalOpen(false); setEditingUnit(null); }} onAdd={handleAddUnit} editData={editingUnit} />}
                {isWorkstationModalOpen && <WorkstationModal onClose={() => { setIsWorkstationModalOpen(false); setEditingWorkstation(null); }} onAdd={handleAddWorkstation} shifts={shifts} editData={editingWorkstation} />}
                {isProcessModalOpen && <ProcessModal onClose={() => { setIsProcessModalOpen(false); setEditingProcess(null); }} onAdd={handleAddProcess} workstations={workstations} units={units} editData={editingProcess} />}
                {isRouteModalOpen && <RouteModal onClose={() => { setIsRouteModalOpen(false); setEditingRoute(null); }} onAdd={handleAddRoute} processes={processes} editData={editingRoute} />}
                {isProductModalOpen && <ProductModal onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }} onAdd={handleAddProduct} routes={routes} editData={editingProduct} />}
            </AnimatePresence>
        </div>
    )
}

export default MasterData
