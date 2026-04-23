import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useInvoices } from '../hooks/useInvoices'
import StatusBadge from '../components/StatusBadge'
import InvoiceForm from '../components/InvoiceForm'
import DeleteModal from '../components/DeleteModal'

function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { invoices, deleteInvoice, markAsPaid } = useInvoices()
  const [showForm, setShowForm] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const invoice = invoices.find(inv => inv.id === id)

  // Guard — invalid URL
  if (!invoice) {
    return (
      <div className="not-found">
        <p>Invoice not found.</p>
        <button
          className="btn btn--secondary"
          onClick={() => navigate('/')}
        >
          Go Back
        </button>
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency', currency: 'GBP'
    }).format(amount)
  }

  const handleDelete = () => {
    deleteInvoice(id)
    navigate('/')
  }

  return (
    <div className="invoice-detail">

      {/* Back button */}
      <button
        className="back-btn"
        onClick={() => navigate('/')}
      >
        <svg width="7" height="10" viewBox="0 0 7 10"
          fill="none" aria-hidden="true">
          <path d="M6 1L2 5l4 4"
            stroke="#7C5DFA" strokeWidth="2" />
        </svg>
        Go back
      </button>

      {/* Status bar */}
      <div className="invoice-detail__status-bar">
        <span className="invoice-detail__status-label">Status</span>
        <StatusBadge status={invoice.status} />

        {/* Actions — hidden on mobile, shown on tablet+ */}
        <div className="invoice-detail__actions">
          {invoice.status !== 'paid' && (
            <button
              className="btn btn--secondary"
              onClick={() => setShowForm(true)}
            >
              Edit
            </button>
          )}
          <button
            className="btn btn--danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
          {invoice.status === 'pending' && (
            <button
              className="btn btn--primary"
              onClick={() => markAsPaid(id)}
            >
              Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Main invoice card */}
      <div className="invoice-detail__card">

        {/* Top — ID, description, sender address */}
        <div className="invoice-detail__top">
          <div>
            <h2 className="invoice-detail__id">
              <span className="invoice-card__hash">#</span>{invoice.id}
            </h2>
            <p className="invoice-detail__desc">{invoice.description}</p>
          </div>
          <address className="invoice-detail__sender">
            <span>{invoice.senderAddress.street}</span>
            <span>{invoice.senderAddress.city}</span>
            <span>{invoice.senderAddress.postCode}</span>
            <span>{invoice.senderAddress.country}</span>
          </address>
        </div>

        {/* Middle — dates, client info, email */}
        <div className="invoice-detail__meta">
          <div>
            <p className="invoice-detail__label">Invoice Date</p>
            <p className="invoice-detail__value">
              {formatDate(invoice.createdAt)}
            </p>
          </div>
          <div>
            <p className="invoice-detail__label">Payment Due</p>
            <p className="invoice-detail__value">
              {formatDate(invoice.paymentDue)}
            </p>
          </div>
          <div>
            <p className="invoice-detail__label">Bill To</p>
            <p className="invoice-detail__value">{invoice.clientName}</p>
            <address className="invoice-detail__client-address">
              <span>{invoice.clientAddress.street}</span>
              <span>{invoice.clientAddress.city}</span>
              <span>{invoice.clientAddress.postCode}</span>
              <span>{invoice.clientAddress.country}</span>
            </address>
          </div>
          <div>
            <p className="invoice-detail__label">Sent to</p>
            <p className="invoice-detail__value">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items table */}
        <div className="invoice-detail__items">
          <table>
            <thead>
              <tr>
                <th scope="col">Item Name</th>
                <th scope="col">QTY.</th>
                <th scope="col">Price</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td data-label="Item Name">{item.name}</td>
                  <td data-label="QTY.">{item.quantity}</td>
                  <td data-label="Price">{formatCurrency(item.price)}</td>
                  <td data-label="Total">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grand total */}
          <div className="invoice-detail__total">
            <span>Amount Due</span>
            <span className="invoice-detail__total-amount">
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>

      </div>

      {/* Mobile action bar — fixed at bottom */}
      <div className="invoice-detail__mobile-actions">
        {invoice.status !== 'paid' && (
          <button
            className="btn btn--secondary"
            onClick={() => setShowForm(true)}
          >
            Edit
          </button>
        )}
        <button
          className="btn btn--danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete
        </button>
        {invoice.status === 'pending' && (
          <button
            className="btn btn--primary"
            onClick={() => markAsPaid(id)}
          >
            Mark as Paid
          </button>
        )}
      </div>

      {/* Edit form */}
      {showForm && (
        <InvoiceForm
          existingInvoice={invoice}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

    </div>
  )
}

export default InvoiceDetail