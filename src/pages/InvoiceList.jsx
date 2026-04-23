import { useState, useRef, useEffect } from 'react'  // 👈 add useRef, useEffect
import { useInvoices } from '../hooks/UseInvoices'
import InvoiceCard from '../components/InvoiceCard'
import emailCampaign from '../images/emailCampaign.png'
import InvoiceForm from '../components/InvoiceForm'

function InvoiceList() {
  const { invoices } = useInvoices()
  const [activeFilters, setActiveFilters] = useState([])  // 👈 array now
  const [showForm, setShowForm] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)  // 👈 new
  const dropdownRef = useRef(null)  // 👈 new

  const statuses = ['draft', 'pending', 'paid']  // 👈 removed 'all'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Toggle a filter on/off
  const toggleFilter = (status) => {
    setActiveFilters(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  // No filters selected = show all
  const filteredInvoices = activeFilters.length === 0
    ? invoices
    : invoices.filter(inv => activeFilters.includes(inv.status))

  return (
    <main className="invoice-list">
      {/* Header */}
      <div className="invoice-list__header">
        <div>
          <h1>Invoices</h1>
          <p>{filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Filter Dropdown */}
        <div className="filter-dropdown" ref={dropdownRef}>
          <button
            className="filter-dropdown__trigger"
            onClick={() => setDropdownOpen(prev => !prev)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span>
              Filter by status
              {activeFilters.length > 0 && ` (${activeFilters.length})`}
            </span>
            <svg
              className={`filter-dropdown__chevron ${dropdownOpen ? 'filter-dropdown__chevron--open' : ''}`}
              width="11" height="7" viewBox="0 0 11 7"
              fill="none" aria-hidden="true"
            >
              <path d="M1 1l4.228 4.228L9.456 1"
                stroke="#7C5DFA" strokeWidth="2" />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              className="filter-dropdown__panel"
              role="listbox"
              aria-multiselectable="true"
              aria-label="Filter by status"
            >
              {statuses.map(status => (
                <label
                  key={status}
                  className="filter-dropdown__option"
                >
                  <input
                    type="checkbox"
                    className="filter-dropdown__checkbox"
                    checked={activeFilters.includes(status)}
                    onChange={() => toggleFilter(status)}
                  />
                  <span className="filter-dropdown__checkbox-custom" aria-hidden="true" />
                  <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn--primary add--new" onClick={() => setShowForm(true)}>
          <span className='btn--primary__plus' aria-hidden="true">+</span> New Invoice
        </button>
      </div>

      {/* Invoice list */}
      {filteredInvoices.length === 0 ? (
        <div className="empty-state">
          <img
            src={emailCampaign}
            alt=""
            aria-hidden="true"
          />
          <h2>There is nothing here</h2>
          <p>Create an Invoice by clicking the <strong>New Invoice</strong> button and get started</p>
        </div>
      ) : (
        <ul className="invoice-list__items" role="list">
          {filteredInvoices.map(invoice => (
            <li key={invoice.id}>
              <InvoiceCard invoice={invoice} />
            </li>
          ))}
        </ul>
      )}

      {showForm && (
        <InvoiceForm onClose={() => setShowForm(false)} />
      )}

    </main>
  )
}

export default InvoiceList