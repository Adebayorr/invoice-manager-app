import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function InvoiceCard({ invoice }) {
  const navigate = useNavigate()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

  return (
    <article
      className="invoice-card"
      onClick={() => navigate(`/invoice/${invoice.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/invoice/${invoice.id}`)}
      aria-label={`View invoice ${invoice.id}`}
    >
      <span className="invoice-card__id">
        <span className="invoice-card__hash">#</span>{invoice.id}
      </span>
      <span className="invoice-card__due">Due {formatDate(invoice.paymentDue)}</span>
      <span className="invoice-card__client">{invoice.clientName}</span>
      <span className="invoice-card__amount">{formatCurrency(invoice.total)}</span>
      <StatusBadge status={invoice.status} />
      <span className="invoice-card__arrow" aria-hidden="true">›</span>
    </article>
  )
}

export default InvoiceCard
