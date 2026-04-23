// Generates a random invoice ID like "RT3080"
export function generateId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const nums = Math.floor(1000 + Math.random() * 9000)
  const l1 = letters[Math.floor(Math.random() * letters.length)]
  const l2 = letters[Math.floor(Math.random() * letters.length)]
  return `${l1}${l2}${nums}`
}

// Calculate payment due date from created date + payment terms
export function calcPaymentDue(createdAt, paymentTerms) {
  const date = new Date(createdAt)
  date.setDate(date.getDate() + Number(paymentTerms))
  return date.toISOString().split('T')[0]
}

// Calculate total from items array
export function calcTotal(items) {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0)
}
