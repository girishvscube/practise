import React from 'react'
import Index from '../Index'

import Invoice from './Invoice/Invoice'
import PoStatus from './PoStatus/PoStatus'
import Payments from './PaymentTypes/Payments'
import Expense from './ExpenseCategory/Expense'

const constTabs = [
  {
    id: 0,
    name: 'Expense Categories',
  },
]
const Accounts = () => (
  <div>
    <Index constTabs={constTabs} pages={[<Expense />]} cols='grid grid-cols-5' length={4} />
  </div>
)
export default Accounts
