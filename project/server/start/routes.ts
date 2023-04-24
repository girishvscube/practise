import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
    return { hello: 'Welcome to ATD API' }
})

// Auth APIS Include Login,Forgot password,Update Password,Reset Password
Route.group(() => {
    Route.post('login', 'AuthController.login')
    Route.post('forgot-password', 'AuthController.forgotPassword')
    Route.post('reset-password', 'AuthController.resetPassword')
    Route.post('update-password', 'AuthController.updatePassword').middleware('auth')
})

Route.group(() => {
    Route.post('logout', 'AuthController.logout')

    // USER
    Route.get('users/logs/:id', 'UserController.getLogs').middleware('find:User')
    Route.patch('users/update-status/:id', 'UserController.updateStatus').middleware('find:User')
    Route.put('users/profile/change-password', 'UserController.changePassword')
    Route.put('users/profile/update-profile', 'UserController.updateProfile')
    Route.get('users/profile/info', 'UserController.getAuthProfile')
    Route.get('users/dropdown', 'UserController.usersDropdown')
    Route.resource('users', 'UserController')
        .middleware({
            show: ['find:User'],
            update: ['find:User'],
        })
        .only(['index', 'show', 'store', 'update'])

    /**DROPDOWNS START */
    Route.get('roles/dropdown', 'RoleController.rolesDropdown')
    Route.get('equipments/dropdown', 'EquipmentController.dropdown')
    Route.get('industries/dropdown', 'IndustryController.dropdown')
    Route.get('states', 'StateController.dropdown')
    Route.get('credit-net-due/dropdown', 'CreditNetDuesController.dropdown')
    Route.get('customers/dropdown', 'CustomerController.dropdown')
    Route.get('customers/poc/dropdown/:id', 'CustomerPocController.dropdown')
    Route.get('customers/delivery-address/dropdown/:id', 'CustomerDeliveryInfoController.dropdown')
    Route.get('order-type/dropdown', 'OrdersController.orderType')
    Route.get('order-status/dropdown', 'OrdersController.orderStatus')
    Route.get('supplier/type/dropdown', 'SuppliersController.type')
    Route.get('parking-station/dropdown', 'ParkingStationsController.dropdown')
    Route.get('supplier/dropdown', 'SuppliersController.dropdown')
    Route.get('bowser/dropdown', 'BowsersController.dropdown')
    Route.get('bowser/status/dropdown', 'BowsersController.type')
    Route.get('trips/status/dropdown', 'TripsController.dropdown')
    Route.get('support-tickets/status/dropdown', 'SupportTicketsController.statusDropdown')
    Route.get('support-tickets/issue-type/dropdown', 'SupportTicketsController.issueTypeDropdown')
    Route.get('support-tickets/priority/dropdown', 'SupportTicketsController.priorityDropdown')
    Route.get('cash-in-hand/type/dropdown', 'CashInHandsController.dropdown')
    Route.get('purchase-order/status/dropdown', 'PurchaseOrdersController.statusDropdown')
    Route.get('bank-account/bank/list', 'BankAccountsController.bankListDropdown')
    /**DROPDOWNS END */

    //SETTINGS
    Route.group(() => {
        // ROLES
        Route.resource('roles', 'RoleController')
            .middleware({
                show: ['find:Role'],
                update: ['find:Role'],
            })
            .only(['index', 'show', 'store', 'update', 'destroy'])
        // EQUIPMENTS
        Route.resource('equipments', 'EquipmentController')
            .middleware({
                show: ['find:Equipment'],
                update: ['find:Equipment'],
                destroy: ['find:Equipment'],
            })
            .only(['index', 'show', 'store', 'update', 'destroy'])

        // INDUSTRIES
        Route.resource('industries', 'IndustryController')
            .middleware({
                show: ['find:IndustryType'],
                update: ['find:IndustryType'],
                destroy: ['find:IndustryType'],
            })
            .only(['index', 'show', 'store', 'update', 'destroy'])
        /**INDUSTRY TYPE END*/
        /** PAYMENT TERM START*/
        Route.resource('payment-term', 'PaymentTermsController')
            .middleware({
                update: ['find:PaymentTerm'],
                show: ['find:PaymentTerm'],
            })
            .only(['index', 'store', 'update', 'show'])

        /** PAYMENT TERM END*/
        /** TIME SLOT START*/
        Route.resource('time-slot', 'TimeSlotsController')
            .middleware({
                update: ['find:TimeSlot'],
                show: ['find:TimeSlot'],
                destroy: ['find:TimeSlot'],
            })
            /** TIME SLOT END*/
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** BANK ACCOUNT START */
        Route.patch(
            'bank-acount/update-status/:id',
            'BankAccountsController.updateStatus'
        ).middleware('find:BankAccount')
        Route.resource('bank-account', 'BankAccountsController')
            .middleware({
                update: ['find:BankAccount'],
                show: ['find:BankAccount'],
            })
            .only(['index', 'store', 'update', 'show'])
        /** BANK ACCOUNT END */
        /** CUSTOMER TYPE START */
        Route.resource('customers/type', 'CustomerTypesController')
            .middleware({
                update: ['find:CustomerType'],
                show: ['find:CustomerType'],
                destroy: ['find:CustomerType'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** CUSTOMER TYPE END */
        /** CUSTOMER ADDRESS TYPE START */
        Route.resource('customers/address-type', 'CustomerAddressTypesController')
            .middleware({
                update: ['find:CustomerAddressType'],
                show: ['find:CustomerAddressType'],
                destroy: ['find:CustomerAddressType'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** CUSTOMER ADDRESS TYPE END */
        /** SUPPLIER TYPE START */
        Route.resource('suppliers/type', 'SupplierTypesController')
            .middleware({
                update: ['find:SupplierType'],
                show: ['find:SupplierType'],
                destroy: ['find:SupplierType'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** SUPPLIER TYPE END */
        /** LEAD STATUS START */
        Route.resource('leads/status', 'LeadStatusesController')
            .middleware({
                update: ['find:LeadStatus'],
                show: ['find:LeadStatus'],
                destroy: ['find:LeadStatus'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** LEAD STATUS END */
        /** LEAD SOURCE START */
        Route.resource('leads/source', 'LeadSourcesController')
            .middleware({
                update: ['find:LeadSource'],
                show: ['find:LeadSource'],
                destroy: ['find:LeadSource'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** LEAD SOURCE END */
        /** BOWSER STATUS START */

        Route.resource('bowsers/status', 'BowserStatusesController')
            .middleware({
                update: ['find:BowserStatus'],
                show: ['find:BowserStatus'],
                destroy: ['find:BowserStatus'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** BOWSER STATUS END */
        /** FUEL CAPACITY START */
        Route.resource('bowsers/fuel-capacity', 'FuelCapacitiesController')
            .middleware({
                update: ['find:FuelCapacity'],
                show: ['find:FuelCapacity'],
                destroy: ['find:FuelCapacity'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** FUEL CAPACITY END */
        /** MESSAGE TEMPLATE START */
        Route.resource('message-template', 'MessageTemplatesController')
            .middleware({
                update: ['find:MessageTemplate'],
                show: ['find:MessageTemplate'],
                destroy: ['find:MessageTemplate'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** MESSAGE TEMPLATE END */
        /** ORDER STATUS START */
        Route.resource('orders/status', 'OrderStatusesController')
            .middleware({
                update: ['find:OrderStatus'],
                show: ['find:OrderStatus'],
                destroy: ['find:OrderStatus'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** ORDER STATUS END */
        /** PO STATUS START */
        Route.resource('po/status', 'PoStatusesController')
            .middleware({
                update: ['find:PoStatus'],
                show: ['find:PoStatus'],
                destroy: ['find:PoStatus'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** PO STATUS END */
        /** TICKET ISSUE START */
        Route.resource('support-tickets/issues', 'TicketIssuesController')
            .middleware({
                update: ['find:TicketIssue'],
                show: ['find:TicketIssue'],
                destroy: ['find:TicketIssue'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** TICKET ISSUE END */
        /** TRIP STATUS START */
        Route.resource('trips/status', 'TripStatusesController')
            .middleware({
                update: ['find:TripStatus'],
                show: ['find:TripStatus'],
                destroy: ['find:TripStatus'],
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** TRIP STATUS END */
        /** EXPENSE CATEGORY START */

        Route.get('expense-category/:name', 'ExpenseCategoriesController.index')
        Route.resource('expense-category', 'ExpenseCategoriesController')
            .middleware({
                update: 'find:ExpenseCategory',
                destroy: 'find:ExpenseCategory',
            })
            .only(['index', 'store', 'update', 'destroy'])
        /** EXPENSE CATEGORY END */
        /** PAYMENT TYPE START */
        Route.resource('payment-type', 'PaymentTypesController')
            .middleware({
                update: 'find:PaymentType',
                show: 'find:PaymentType',
                destroy: 'find:PaymentType',
            })
            .only(['index', 'store', 'update', 'show', 'destroy'])
        /** PAYMENT TYPE END */
    }).prefix('settings')

    /**CUSTOMERS START */
    Route.get('customers/view/payments/:id', 'CustomerController.getPaymentList').middleware(
        'find:Customer'
    )
    Route.get('customers/orders/:id', 'CustomerController.getCustomerOrders')
    Route.resource('customers', 'CustomerController')
        .middleware({
            show: ['find:Customer'],
            update: ['find:Customer'],
        })
        .only(['index', 'show', 'store', 'update'])

    Route.group(() => {
        Route.get('orders/all/:id', 'CustomerController.allOrder').middleware('find:Customer')
        Route.get('poc/all/:id', 'CustomerPocController.getAllById')
        Route.resource('poc', 'CustomerPocController')
            .middleware({
                show: ['find:CustomerPoc'],
                update: ['find:CustomerPoc'],
                destroy: ['find:CustomerPoc'],
            })
            .apiOnly()
        Route.get('delivery-address/all/:id', 'CustomerDeliveryInfoController.getAllById')
        Route.resource('delivery-address', 'CustomerDeliveryInfoController')
            .middleware({
                show: ['find:CustomerDeliveryDetail'],
                update: ['find:CustomerDeliveryDetail'],
                destroy: ['find:CustomerDeliveryDetail'],
            })
            .only(['index', 'show', 'store', 'update', 'destroy'])
    }).prefix('customers')
    /**CUSTOMERS END */
    /**LEADS START */
    Route.get('leads/options/dropdown', 'LeadsController.options')
    Route.get('leads/count', 'LeadsController.count')
    Route.patch('leads/update-status/:id', 'LeadsController.updateStatus').middleware('find:Lead')
    Route.patch('leads/reassign-lead/:id', 'LeadsController.reassignLeadRequest').middleware(
        'find:Lead'
    )
    Route.patch('leads/assign-lead/:id', 'LeadsController.assignLead').middleware('find:Lead')
    Route.resource('leads', 'LeadsController')
        .middleware({
            show: ['find:Lead'],
            update: ['find:Lead'],
        })
        .only(['index', 'show', 'store', 'update'])
    /**LEADS END */
    /**ORDER START */

    Route.get('orders/invoices', 'OrdersController.invoiceList')
    Route.get('orders/invoices/count', 'OrdersController.invoiceStats')
    Route.get('orders/confirm/:id', 'OrdersController.confirmOrder').middleware('find:Order')
    Route.put('orders/edit-price/:id', 'OrdersController.updatePrice').middleware('find:Order')
    Route.resource('orders', 'OrdersController')
        .middleware({
            show: ['find:Order'],
            update: ['find:Order'],
        })
        .only(['index', 'show', 'store', 'update'])
    Route.group(() => {
        Route.get('poc/:id', 'OrdersController.getPocByOrderId').middleware('find:Order')
        Route.post('poc/:id', 'OrdersController.addNewPoc').middleware('find:Order')
        Route.delete('poc/:id', 'OrdersController.deletePOC').middleware('find:OrderPoc')
        Route.get('count/all', 'OrdersController.count')
        Route.patch('update-status/:id', 'OrdersController.updateStatus').middleware('find:Order')
    }).prefix('orders')
    Route.get('orders/performa-invoice/:id', 'OrdersController.downloadPerforma').middleware(
        'find:Order'
    )
    Route.get('orders/credit/add/charges', 'OrdersController.addCharges')
    Route.post('orders/invoice/send/:id', 'OrdersController.sendInvoice').middleware('find:Order')
    Route.get('orders/mail/all/:id', 'OrdersController.mailList').middleware('find:Order')
    /**ORDER END */
    /**SUPPLIER START */
    Route.get('supplier/count', 'SuppliersController.count')
    Route.get('supplier/view/purchase/count/:id', 'SuppliersController.poStats')
    Route.get('supplier/view/purchase/:id', 'SuppliersController.getPOListById').middleware(
        'find:Supplier'
    )
    Route.get('supplier/view/poc/:id', 'SupplierPocsController.getBySupplierId').middleware(
        'find:Supplier'
    )
    Route.resource('supplier', 'SuppliersController')
        .middleware({
            show: ['find:Supplier'],
            update: ['find:Supplier'],
        })
        .only(['show', 'store', 'update', 'index'])
    Route.resource('supplier-poc', 'SupplierPocsController')
        .middleware({
            show: ['find:SupplierPoc'],
            update: ['find:SupplierPoc'],
            destroy: ['find:SupplierPoc'],
        })
        .only(['index', 'show', 'store', 'update', 'destroy'])
    /**SUPPLIER END */
    /**PARKING STATION START */
    Route.patch(
        'parking-station/update-status/:id',
        'ParkingStationsController.updateStatus'
    ).middleware('find:ParkingStation')
    Route.resource('parking-station', 'ParkingStationsController')
        .middleware({
            update: ['find:ParkingStation'],
        })
        .only(['show', 'index', 'update', 'store'])
    /**PARKING STATION END */
    /**BOWSER START */

    Route.get(
        'bowser/trip/odometer/details/:id',
        'TripScheduleLogsController.odometerDetailByTripId'
    ).middleware('find:Trip')
    Route.get('bowser/trip/details/:id', 'BowsersController.tripDetails').middleware('find:Bowser')
    Route.get('bowser/count/all', 'BowsersController.count')
    Route.get('bowser/view/driver-detail/:id', 'BowsersController.getDriverLogs').middleware(
        'find:Bowser'
    )
    Route.put('bowser/view/assign-driver/:id', 'BowsersController.assignDriver').middleware(
        'find:Bowser'
    )
    Route.patch('bowser/update-status/:id', 'BowsersController.updateStatus').middleware(
        'find:Bowser'
    )
    Route.resource('bowser', 'BowsersController')
        .middleware({
            update: ['find:Bowser'],
        })
        .only(['show', 'index', 'update', 'store'])
    /**BOWSER END */
    /**PURCHASE ORDER START */
    Route.get(
        'purchase-order/supplier/confirmation/:id',
        'PurchaseOrdersController.supplierConfirmation'
    ).middleware('find:PurchaseOrder')
    Route.get('purchase-order/dashboard/count', 'PurchaseOrdersController.count')
    Route.patch(
        'purchase-order/update-status/:id',
        'PurchaseOrdersController.updateStatus'
    ).middleware('find:PurchaseOrder')
    Route.resource('purchase-order', 'PurchaseOrdersController')
        .middleware({
            update: ['find:PurchaseOrder'],
            show: ['find:PurchaseOrder'],
        })
        .only(['show', 'index', 'update', 'store'])
    /**PURCHASE ORDER END */
    /**TRIP START */
    Route.get('trips', 'TripsController.index')
    Route.get('trips/associated/:id', 'TripScheduleLogsController.tripDetails').middleware(
        'find:Trip'
    )
    Route.get('trips/count', 'TripsController.count')
    Route.patch('trips/update-status/:id', 'TripsController.updateStatus').middleware('find:Trip')
    Route.get('trip-orders/all/:id', 'TripSoOrdersController.index').middleware('find:Trip')
    Route.get('trip-orders/:id', 'TripSoOrdersController.show').middleware('find:Trip')
    Route.put('trip-orders/:id', 'TripSoOrdersController.update').middleware('find:Trip')
    Route.get(
        'trips/orders/confirmed/:id',
        'TripSoOrdersController.getAllConfirmedOrders'
    ).middleware('find:Trip')
    Route.delete('trip-orders/:id', 'TripSoOrdersController.destroy').middleware('find:TripSoOrder')
    // Route.put('trip-orders/:id', 'TripSoOrdersController.scheduleTrip').middleware('find:Trip')
    Route.get('trips/schedule/:id', 'TripScheduleLogsController.listingByTripId').middleware(
        'find:Trip'
    ) //by trip id
    Route.get('trips/schedule/bowser/:id', 'TripScheduleLogsController.listingByBowserId') // by bowser id
    Route.put(
        'trips/schedule/update-status/:id',
        'TripScheduleLogsController.updateStatus'
    ).middleware('find:TripScheduleLog')
    /**TRIP END */
    /**SUPPORT TICKET START */
    Route.put(
        'support-tickets/reassign/:id',
        'SupportTicketsController.reassignTicketRequest'
    ).middleware('find:SupportTIcket')
    Route.get('support-tickets/count/all', 'SupportTicketsController.count')
    Route.get('support-tickets/orders/tracking/:id', 'OrdersController.orderTracking').middleware(
        'find:Order'
    )
    Route.patch(
        'support-tickets/update-status/:id',
        'SupportTicketsController.updateStatus'
    ).middleware('find:SupportTicket')
    Route.resource('support-tickets', 'SupportTicketsController')
        .middleware({
            update: ['find:SupportTicket'],
            show: ['find:SupportTicket'],
        })
        .only(['store', 'update', 'index', 'show'])
    /**SUPPORT TICKET END */
    /** EXPENSE START */
    Route.get('expense/count', 'ExpensesController.count')
    Route.resource('expense', 'ExpensesController')
        .middleware({
            update: 'find:Expense',
            show: 'find:Expense',
        })
        .only(['index', 'store', 'update', 'show'])
    /** EXPENSE END */
    /** VALUES AND CHARGES START */
    Route.group(() => {
        Route.get('customers/late-charges', 'CustomerController.getLateCharges')
        Route.put('customers/late-charges/:id', 'CustomerController.updateLateCharges').middleware(
            'find:Customer'
        )
        Route.get('delivery-charges', 'ValueAndChargesController.deliveryChargesList')
        Route.post('delivery-charges', 'ValueAndChargesController.saveDeliveryCharges')
        Route.put(
            'delivery-charges/:id',
            'ValueAndChargesController.updateDeliveryCharges'
        ).middleware('find:DeliveryCharge')
        Route.get('purchase-price', 'ValueAndChargesController.purhasePriceList')
        Route.put(
            'purchase-price/:id',
            'ValueAndChargesController.updatePriceBySupplierId'
        ).middleware('find:Supplier')
        Route.get('selling-price', 'ValueAndChargesController.sellPriceList')
        Route.get('selling-price/current', 'ValueAndChargesController.sellPriceList')
        Route.post('selling-price', 'ValueAndChargesController.updateSellingPrice')
        Route.get('logs', 'ValueAndChargesController.logs')
    }).prefix('values-charges')
    /** VALUES AND CHARGES END */
    /** CASH IN HAND START */
    Route.get('cash-in-hand/count', 'CashInHandsController.count')
    Route.resource('cash-in-hand', 'CashInHandsController')
        .middleware({
            update: 'find:CashInHand',
            show: 'find:CashInHand',
        })
        .only(['index', 'store', 'show', 'update'])
    /** CASH IN HAND END */
    /** PAY IN START */
    Route.get(
        'pay-in/customers/pending-invoices/:id',
        'PayInsController.getInvoiceByCustId'
    ).middleware('find:Customer')
    Route.resource('pay-in', 'PayInsController')
        .middleware({
            update: 'find:PayIn',
            show: 'find:PayIn',
        })
        .only(['index', 'show', 'update', 'store'])
    /** PAY IN END */
    /** PAY OUT HAND START */
    Route.get(
        'pay-out/suppliers/pending-invoices/:id',
        'PayOutsController.getInvoiceBySupplierId'
    ).middleware('find:Supplier')
    Route.resource('pay-out', 'PayOutsController')
        .middleware({
            update: 'find:PayOut',
            show: 'find:PayOut',
        })
        .only(['index', 'show', 'update', 'store'])
    /** PAY OUT HAND END */
    /** PURCHASE BILL START */
    Route.get('purchase-bill', 'PurchaseBillsController.index')
    Route.get(
        'purchase-bill/download/:id',
        'PurchaseBillsController.downloadPurchaseBill'
    ).middleware('find:PurchaseOrder')
    Route.get('purchase-bill/count', 'PurchaseBillsController.count')
    Route.post('purchase-bill/send/:id', 'PurchaseBillsController.sendPurchaseBill').middleware(
        'find:PurchaseOrder'
    )
    Route.get('purchase-bill/mail/all/:id', 'PurchaseBillsController.mailList').middleware(
        'find:PurchaseOrder'
    )
    /** PURCHASE BILL END */
    /** PURCHASE SALES ORDER START */
    Route.get(
        'purchase-sales-order/:id',
        'PurchaseOrdersController.listOfAssossiatedOrdersByPoId'
    ).middleware('find:PurchaseOrder')
    Route.put('purchase-sales-order/:id', 'PurchaseOrdersController.assosiateSO').middleware(
        'find:PurchaseOrder'
    )
    Route.get('purchase-sales-order/orders/confirmed', 'PurchaseOrdersController.listOfConfirmedSO')
    Route.delete('purchase-sales-order/:id', 'PurchaseOrdersController.deletePOS').middleware(
        'find:PurchaseSalesOrder'
    )

    Route.get('dashboard/cust-vs-leads', 'DashboardController.custVsLead')
    Route.get('dashboard/trip-stats', 'DashboardController.tripStats')
    Route.get('dashboard/fuel-stats', 'DashboardController.fuelStats')
    Route.get('dashboard/account-stats', 'DashboardController.accountStats')
    Route.get('dashboard/unpaid-stats', 'DashboardController.unpaidStats')
    /** PURCHASE SALES ORDER END */

    Route.get('notifications/all/unread', 'NotificationsController.getUnreadByUserId')
    Route.get('notifications/all/read', 'NotificationsController.getReadByUserId')
    Route.get('notifications/all/clear', 'NotificationsController.clearAll')
    Route.get('notifications/clear/:id', 'NotificationsController.clear').middleware(
        'find:Notification'
    )
})
    .prefix('admin')
    .middleware('auth')

Route.get('notify', 'NotificationsController.firebaseNotification')
