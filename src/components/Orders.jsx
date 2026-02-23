import React, { useState } from 'react'
import { Package, Plus, RefreshCcw, Trash2, Clock, Calendar, Activity, AlertCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Orders = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [orders, setOrders] = useState([
        {
            id: 'ORD-2024-001',
            client: 'Acme Corporation',
            status: 'LAUNCHED',
            date: 'Dec 20, 2024',
            priority: 'MEDIUM',
            items: [
                { name: 'Standard PCB', qty: 50, date: 'Dec 26' },
                { name: 'HDI PCB', qty: 30, date: 'Dec 28' }
            ]
        }
    ])

    const addNewOrder = (newOrder) => {
        setOrders([newOrder, ...orders])
        setIsModalOpen(false)
    }

    const deleteOrder = (id) => {
        setOrders(orders.filter(order => order.id !== id))
    }

    return (
        <div className="orders-view">
            {/* Search and Action Bar */}
            <div className="card" style={{ borderLeft: '4px solid #3b82f6', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Package color="#3b82f6" />
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Order Management</h3>
                            <p className="card-desc">Create and manage customer orders for production</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="nav-tab" style={{ background: '#fff7ed', color: '#f97316', border: '1px solid #ffedd5' }}>
                            <RefreshCcw size={16} style={{ marginRight: '6px' }} />
                            Reschedule All ({orders.length})
                        </button>
                        <button
                            className="nav-tab"
                            style={{ background: '#4f46e5', color: 'white' }}
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus size={16} style={{ marginRight: '6px' }} />
                            Create New Order
                        </button>
                    </div>
                </div>
            </div>

            <div className="orders-grid">
                {orders.map((order) => (
                    <div key={order.id} className="card order-card" style={{ borderLeft: `4px solid ${order.priority === 'HIGH' ? '#ef4444' : '#3b82f6'}` }}>
                        <div className="order-header">
                            <div>
                                <div className="order-id">{order.id}</div>
                                <div className="card-desc" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Activity size={12} /> {order.client}
                                </div>
                            </div>
                            <span className={`status-badge ${order.status === 'LAUNCHED' ? 'status-launched' : ''}`} style={{ background: order.status === 'PENDING' ? '#fef3c7' : '#eff6ff', color: order.status === 'PENDING' ? '#d97706' : '#3b82f6' }}>
                                {order.status}
                            </span>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '1rem' }}>
                            <div className="card-desc" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={14} /> Order Date: <strong>{order.date}</strong>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Package size={14} /> Order Items ({order.items.length})
                                </div>

                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: idx === 0 ? '0.5rem' : 0, fontSize: '0.8125rem' }}>
                                        <span>{item.name}</span>
                                        <span style={{ color: '#64748b' }}>Qty: {item.qty} <Clock size={12} style={{ marginLeft: '8px' }} /> {item.date}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="card-desc">Priority:</span>
                                    <span
                                        className="status-badge"
                                        style={{
                                            background: order.priority === 'HIGH' ? '#fef2f2' : '#eff6ff',
                                            color: order.priority === 'HIGH' ? '#ef4444' : '#3b82f6',
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        {order.priority}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        className="card-icon"
                                        style={{ padding: '4px', color: '#ef4444' }}
                                        onClick={() => deleteOrder(order.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                        <AlertCircle size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                        <h3>No orders found</h3>
                        <p>Click "Create New Order" to get started.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <OrderModal
                        onClose={() => setIsModalOpen(false)}
                        onCreate={addNewOrder}
                        orderCount={orders.length}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

const OrderModal = ({ onClose, onCreate, orderCount }) => {
    const [customer, setCustomer] = useState('')
    const [items, setItems] = useState([])

    const handleCreate = () => {
        if (!customer) return;

        onCreate({
            id: `ORD-2024-${String(orderCount + 1).padStart(3, '0')}`,
            client: customer,
            status: 'PENDING',
            date: 'Feb 20, 2026',
            priority: 'MEDIUM',
            items: items.length > 0 ? items : [{ name: 'Sample Item', qty: 10, date: 'TBD' }]
        })
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
            >
                <div className="modal-header">
                    <h2 className="modal-title">Create New Order</h2>
                    <button className="close-btn" onClick={onClose} style={{ color: '#64748b' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Order Number</label>
                        <input className="form-input" value={`ORD-2024-${String(orderCount + 1).padStart(3, '0')}`} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Order Date</label>
                        <div style={{ position: 'relative' }}>
                            <input className="form-input" value="20-02-2026" readOnly />
                            <Calendar size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8' }} />
                        </div>
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label">Customer Name</label>
                    <input
                        className="form-input"
                        placeholder="Enter customer name"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                    />
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.5rem 0 1.5rem 0' }}></div>

                <h3 className="form-label" style={{ marginBottom: '0.75rem' }}>Order Items</h3>
                <div className="items-container" style={{ background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div className="add-item-row">
                        <select className="form-input" style={{ flex: 2, background: 'white' }}>
                            <option>Select product</option>
                            <option>Standard PCB</option>
                            <option>HDI PCB</option>
                        </select>
                        <input className="form-input" placeholder="Qty" style={{ flex: 0.8, background: 'white' }} />
                        <div style={{ flex: 1.5, position: 'relative' }}>
                            <input className="form-input" placeholder="dd-mm-yyyy" style={{ background: 'white' }} />
                            <Calendar size={16} style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8' }} />
                        </div>
                        <button className="add-btn">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                        No items added yet. Select a product above to add items.
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-modal btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-modal btn-create" onClick={handleCreate}>Create Order</button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default Orders


