import { useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInvoices } from '../hooks/UseInvoices'
import { generateId, calcPaymentDue, calcTotal } from '../utils/helpers'

// ─── Field component OUTSIDE InvoiceForm ────────────────
function Field({ label, id, error, children }) {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <div className="form-field__header">
        <label htmlFor={id}>{label}</label>
        {error && (
          <span className="form-field__error" role="alert">{error}</span>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── Initial empty form state ────────────────────────────
const emptyForm = {
  senderStreet: '', senderCity: '', senderPostCode: '', senderCountry: '',
  clientName: '', clientEmail: '',
  clientStreet: '', clientCity: '', clientPostCode: '', clientCountry: '',
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: 30,
  description: '',
  items: [{ name: '', quantity: 1, price: 0, total: 0 }]
}

// ─── Reducer ─────────────────────────────────────────────
function formReducer(state, action) {
  switch (action.type) {

    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }

    case 'SET_ITEM_FIELD': {
      const updatedItems = state.items.map((item, i) => {
        if (i !== action.index) return item
        const updated = { ...item, [action.field]: action.value }
        updated.total = Number(updated.quantity) * Number(updated.price)
        return updated
      })
      return { ...state, items: updatedItems }
    }

    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, { name: '', quantity: 1, price: 0, total: 0 }]
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((_, i) => i !== action.index)
      }

    case 'RESET':
      return emptyForm

    default:
      return state
  }
}

// ─── Main Component ───────────────────────────────────────
function InvoiceForm({ existingInvoice, onClose }) {
  const navigate = useNavigate()
  const { addInvoice, updateInvoice } = useInvoices()
  const isEditing = Boolean(existingInvoice)

  const initialState = isEditing ? {
    senderStreet: existingInvoice.senderAddress.street,
    senderCity: existingInvoice.senderAddress.city,
    senderPostCode: existingInvoice.senderAddress.postCode,
    senderCountry: existingInvoice.senderAddress.country,
    clientName: existingInvoice.clientName,
    clientEmail: existingInvoice.clientEmail,
    clientStreet: existingInvoice.clientAddress.street,
    clientCity: existingInvoice.clientAddress.city,
    clientPostCode: existingInvoice.clientAddress.postCode,
    clientCountry: existingInvoice.clientAddress.country,
    createdAt: existingInvoice.createdAt,
    paymentTerms: existingInvoice.paymentTerms,
    description: existingInvoice.description,
    items: existingInvoice.items
  } : emptyForm

  const [form, dispatch] = useReducer(formReducer, initialState)
  const [errors, setErrors] = useReducer(
    (state, action) => ({ ...state, ...action }), {}
  )

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // ── Helpers ───────────────────────────────────────────
  const setField = (field, value) =>
    dispatch({ type: 'SET_FIELD', field, value })

  const setItemField = (index, field, value) =>
    dispatch({ type: 'SET_ITEM_FIELD', index, field, value })

  // ── Validation ────────────────────────────────────────
  function validate() {
    const newErrors = {}

    if (!form.senderStreet.trim()) newErrors.senderStreet = 'Required'
    if (!form.senderCity.trim()) newErrors.senderCity = 'Required'
    if (!form.senderPostCode.trim()) newErrors.senderPostCode = 'Required'
    if (!form.senderCountry.trim()) newErrors.senderCountry = 'Required'
    if (!form.clientName.trim()) newErrors.clientName = 'Client name required'
    if (!form.clientEmail.trim()) {
      newErrors.clientEmail = 'Email required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) {
      newErrors.clientEmail = 'Must be a valid email'
    }
    if (!form.clientStreet.trim()) newErrors.clientStreet = 'Required'
    if (!form.clientCity.trim()) newErrors.clientCity = 'Required'
    if (!form.clientPostCode.trim()) newErrors.clientPostCode = 'Required'
    if (!form.clientCountry.trim()) newErrors.clientCountry = 'Required'
    if (!form.description.trim()) newErrors.description = 'Required'
    if (form.items.length === 0) newErrors.items = 'Add at least one item'
    form.items.forEach((item, i) => {
      if (!item.name.trim()) newErrors[`item_name_${i}`] = 'Required'
      if (item.quantity < 1) newErrors[`item_qty_${i}`] = 'Min 1'
      if (item.price < 0) newErrors[`item_price_${i}`] = 'Invalid'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Build invoice object ──────────────────────────────
  function buildInvoice(status) {
    return {
      id: isEditing ? existingInvoice.id : generateId(),
      createdAt: form.createdAt,
      paymentDue: calcPaymentDue(form.createdAt, form.paymentTerms),
      description: form.description,
      paymentTerms: Number(form.paymentTerms),
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      status,
      senderAddress: {
        street: form.senderStreet, city: form.senderCity,
        postCode: form.senderPostCode, country: form.senderCountry
      },
      clientAddress: {
        street: form.clientStreet, city: form.clientCity,
        postCode: form.clientPostCode, country: form.clientCountry
      },
      items: form.items.map(item => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: Number(item.quantity) * Number(item.price)
      })),
      total: calcTotal(form.items)
    }
  }

  // ── Submit handlers ───────────────────────────────────
  function handleSaveDraft() {
    const invoice = buildInvoice('draft')
    addInvoice(invoice)
    onClose()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    const invoice = buildInvoice(isEditing ? existingInvoice.status : 'pending')
    isEditing ? updateInvoice(existingInvoice.id, invoice) : addInvoice(invoice)
    onClose()
    if (isEditing) navigate(`/invoice/${existingInvoice.id}`)
  }

  // ── Render ────────────────────────────────────────────
  return (
    <>
      <div className="form-overlay" onClick={onClose} aria-hidden="true" />

      <div
        className="invoice-form"
        role="dialog"
        aria-modal="true"
        aria-label={isEditing
          ? `Edit Invoice #${existingInvoice.id}`
          : 'Create Invoice'
        }
      >
        <h2 className="invoice-form__title">
          {isEditing
            ? <>Edit <span>#</span>{existingInvoice.id}</>
            : 'New Invoice'
          }
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="invoice-form__body">

            {/* ── Bill From ── */}
            <fieldset>
              <legend>Bill From</legend>
              <Field label="Street Address" id="senderStreet"
                error={errors.senderStreet}>
                <input id="senderStreet" type="text"
                  value={form.senderStreet}
                  onChange={e => setField('senderStreet', e.target.value)} />
              </Field>
              <div className="form-row">
                <Field label="City" id="senderCity"
                  error={errors.senderCity}>
                  <input id="senderCity" type="text"
                    value={form.senderCity}
                    onChange={e => setField('senderCity', e.target.value)} />
                </Field>
                <Field label="Post Code" id="senderPostCode"
                  error={errors.senderPostCode}>
                  <input id="senderPostCode" type="text"
                    value={form.senderPostCode}
                    onChange={e => setField('senderPostCode', e.target.value)} />
                </Field>
                <Field label="Country" id="senderCountry"
                  error={errors.senderCountry}>
                  <input id="senderCountry" type="text"
                    value={form.senderCountry}
                    onChange={e => setField('senderCountry', e.target.value)} />
                </Field>
              </div>
            </fieldset>

            {/* ── Bill To ── */}
            <fieldset>
              <legend>Bill To</legend>
              <Field label="Client's Name" id="clientName"
                error={errors.clientName}>
                <input id="clientName" type="text"
                  value={form.clientName}
                  onChange={e => setField('clientName', e.target.value)} />
              </Field>
              <Field label="Client's Email" id="clientEmail"
                error={errors.clientEmail}>
                <input id="clientEmail" type="email"
                  value={form.clientEmail}
                  placeholder="e.g. email@example.com"
                  onChange={e => setField('clientEmail', e.target.value)} />
              </Field>
              <Field label="Street Address" id="clientStreet"
                error={errors.clientStreet}>
                <input id="clientStreet" type="text"
                  value={form.clientStreet}
                  onChange={e => setField('clientStreet', e.target.value)} />
              </Field>
              <div className="form-row">
                <Field label="City" id="clientCity"
                  error={errors.clientCity}>
                  <input id="clientCity" type="text"
                    value={form.clientCity}
                    onChange={e => setField('clientCity', e.target.value)} />
                </Field>
                <Field label="Post Code" id="clientPostCode"
                  error={errors.clientPostCode}>
                  <input id="clientPostCode" type="text"
                    value={form.clientPostCode}
                    onChange={e => setField('clientPostCode', e.target.value)} />
                </Field>
                <Field label="Country" id="clientCountry"
                  error={errors.clientCountry}>
                  <input id="clientCountry" type="text"
                    value={form.clientCountry}
                    onChange={e => setField('clientCountry', e.target.value)} />
                </Field>
              </div>
            </fieldset>

            {/* ── Invoice Details ── */}
            <fieldset>
              <legend>Invoice Details</legend>
              <div className="form-row">
                <Field label="Invoice Date" id="createdAt">
                  <input id="createdAt" type="date"
                    value={form.createdAt}
                    onChange={e => setField('createdAt', e.target.value)} />
                </Field>
                <Field label="Payment Terms" id="paymentTerms">
                  <select id="paymentTerms" value={form.paymentTerms}
                    onChange={e => setField('paymentTerms', e.target.value)}>
                    <option value={1}>Net 1 Day</option>
                    <option value={7}>Net 7 Days</option>
                    <option value={14}>Net 14 Days</option>
                    <option value={30}>Net 30 Days</option>
                  </select>
                </Field>
              </div>
              <Field label="Project Description" id="description"
                error={errors.description}>
                <input id="description" type="text"
                  value={form.description}
                  placeholder="e.g. Graphic Design Service"
                  onChange={e => setField('description', e.target.value)} />
              </Field>
            </fieldset>

            {/* ── Item List ── */}
            <div className="form-items">
              <h3>Item List</h3>
              {errors.items && (
                <p className="form-items__error" role="alert">
                  {errors.items}
                </p>
              )}

              {/* Header row — visible tablet+ */}
              <div className="form-item__header" aria-hidden="true">
                <span>Item Name</span>
                <span>Qty.</span>
                <span>Price</span>
                <span>Total</span>
                <span></span>
              </div>

              {form.items.map((item, index) => (
                <div key={index} className="form-item">
                  <Field
                    label="Item Name"
                    id={`item-name-${index}`}
                    error={errors[`item_name_${index}`]}
                  >
                    <input
                      id={`item-name-${index}`}
                      type="text"
                      value={item.name}
                      onChange={e =>
                        setItemField(index, 'name', e.target.value)
                      }
                    />
                  </Field>

                  <Field
                    label="Qty."
                    id={`item-qty-${index}`}
                    error={errors[`item_qty_${index}`]}
                  >
                    <input
                      id={`item-qty-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e =>
                        setItemField(index, 'quantity', e.target.value)
                      }
                    />
                  </Field>

                  <Field
                    label="Price"
                    id={`item-price-${index}`}
                    error={errors[`item_price_${index}`]}
                  >
                    <input
                      id={`item-price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={e =>
                        setItemField(index, 'price', e.target.value)
                      }
                    />
                  </Field>

                  <div className="form-item__total">
                    <span className="form-field__label">Total</span>
                    <span className="form-item__total-value">
                      {(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="form-item__delete"
                    onClick={() =>
                      dispatch({ type: 'REMOVE_ITEM', index })
                    }
                    aria-label={`Remove item ${item.name || index + 1}`}
                  >
                    🗑
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn form-items__add"
                onClick={() => dispatch({ type: 'ADD_ITEM' })}
              >
                + Add New Item
              </button>
            </div>

          </div>{/* end form body */}

          {/* ── Footer ── */}
          <div className="invoice-form__footer">
            {isEditing ? (
              <button type="button" className="btn btn--secondary"
                onClick={onClose}>
                Cancel
              </button>
            ) : (
              <button type="button" className="btn btn--secondary"
                onClick={onClose}>
                Discard
              </button>
            )}

            <div className="invoice-form__footer-right">
              {!isEditing && (
                <button type="button" className="btn btn--dark"
                  onClick={handleSaveDraft}>
                  Save as Draft
                </button>
              )}
              <button type="submit" className="btn btn--primary">
                {isEditing ? 'Save Changes' : 'Save & Send'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </>
  )
}

export default InvoiceForm