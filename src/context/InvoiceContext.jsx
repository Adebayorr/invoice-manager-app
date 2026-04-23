import { createContext, useContext, useState, useEffect } from 'react'

const InvoiceContext = createContext()

const INVOICES_DATA = [
  {
    id: 'RT3080',
    createdAt: '2025-10-19',
    paymentDue: '2025-11-19',
    description: 'Re-branding',
    paymentTerms: 30,
    clientName: 'Lamine Yamal',
    clientEmail: 'yamine@barca.com',
    status: 'paid',
    senderAddress: { street: '19 Union Terrace', city: 'Seville', postCode: 'S1 3EZ', country: 'Spain' },
    clientAddress: { street: '106 Kendell Street', city: 'Barcelona', postCode: 'B24 5WQ', country: 'Spain' },
    items: [{ name: 'Brand Guidelines', quantity: 1, price: 1800.90, total: 1800.90 }],
    total: 1800.90
  },
  {
    id: 'XM9141',
    createdAt: '2021-08-21',
    paymentDue: '2021-09-20',
    description: 'Graphic Design',
    paymentTerms: 30,
    clientName: 'Fede Valverde',
    clientEmail: 'vefe@realmadrid.com',
    status: 'pending',
    senderAddress: { street: '19 Union Terrace', city: 'Seville', postCode: 'S1 3EZ', country: 'Spain' },
    clientAddress: { street: '84 Church Way', city: 'Valencia', postCode: 'V1 9PB', country: 'Spain' },
    items: [
      { name: 'Banner Design', quantity: 1, price: 156.00, total: 156.00 },
      { name: 'Email Design', quantity: 2, price: 200.00, total: 400.00 }
    ],
    total: 556.00
  },
  {
    id: 'RG0314',
    createdAt: '2021-09-24',
    paymentDue: '2021-10-01',
    description: 'Website Redesign',
    paymentTerms: 7,
    clientName: 'Ilaix Moriba',
    clientEmail: 'morimbo@outlook.com',
    status: 'draft',
    senderAddress: { street: '19 Union Terrace', city: 'Seville', postCode: 'S1 3EZ', country: 'Spain' },
    clientAddress: { street: '79 Dover Road', city: 'Bilbao', postCode: 'BL19 3PF', country: 'Spain' },
    items: [{ name: 'Website Redesign', quantity: 1, price: 14002.33, total: 14002.33 }],
    total: 14002.33
  }
]

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices')
    return saved ? JSON.parse(saved) : INVOICES_DATA
  })

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  const addInvoice = (invoice) => {
    setInvoices(prev => [...prev, invoice])
  }

  const updateInvoice = (id, updatedData) => {
    setInvoices(prev =>
      prev.map(inv => inv.id === id ? { ...inv, ...updatedData } : inv)
    )
  }

  const deleteInvoice = (id) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id))
  }

  const markAsPaid = (id) => {
    updateInvoice(id, { status: 'paid' })
  }

  return (
    <InvoiceContext.Provider
      value={{ invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoices() {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider')
  }
  return context
}
