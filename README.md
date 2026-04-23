# Invoice Management App

A fully responsive invoice management application built with React.

## Setup Instructions

1. Clone the repository
   git clone <your-repo-url>

2. Install dependencies
   npm install

3. Start the development server
   npm run dev

4. Open http://localhost:5173

## Architecture

- **React + Vite** — build tool and dev server
- **React Router DOM** — client-side routing
- **Context API** — global state for invoices and theme
- **localStorage** — data persistence across sessions

### Folder Structure

src/
├── components/   # Reusable UI components
├── context/      # InvoiceContext + ThemeContext
├── hooks/        # useInvoices (re-exports from context)
├── pages/        # InvoiceList + InvoiceDetail
└── utils/        # helpers (generateId, calcTotal, calcPaymentDue)

## Trade-offs

- Used localStorage over a backend for simplicity and zero setup
- Used Context API over Redux — sufficient for this app's scale
- Used useReducer for form state — cleaner than multiple useState calls

## Accessibility Notes

- Semantic HTML throughout (nav, main, article, address, fieldset, legend)
- All form inputs have associated labels
- Delete modal traps focus and closes on ESC
- Invoice form closes on ESC
- Skip to content link for keyboard users
- ARIA attributes on modals and interactive elements
- Visible focus indicators on all interactive elements
- Status badges use both colour and text (not colour alone)

## Extra Features Beyond Requirements

- Keyboard navigation on invoice cards (Enter key)
- Dynamic payment due date calculation
- Auto-calculated item totals
- Random invoice ID generation
- Responsive table that converts to card layout on mobile
