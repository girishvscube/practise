"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.get('/', async () => {
    return { hello: 'Welcome to ATD API' };
});
Route_1.default.group(() => {
    Route_1.default.post('login', 'AuthController.login');
    Route_1.default.post('forgot-password', 'AuthController.forgotPassword');
    Route_1.default.post('reset-password', 'AuthController.resetPassword');
    Route_1.default.post('update-password', 'AuthController.updatePassword').middleware('auth');
});
Route_1.default.group(() => {
    Route_1.default.post('logout', 'AuthController.logout');
    Route_1.default.get('users/logs/:id', 'UserController.getLogs').middleware('find:User');
    Route_1.default.patch('users/update-status/:id', 'UserController.updateStatus').middleware('find:User');
    Route_1.default.put('users/profile/change-password', 'UserController.changePassword');
    Route_1.default.put('users/profile/update-profile', 'UserController.updateProfile');
    Route_1.default.get('users/profile/info', 'UserController.getAuthProfile');
    Route_1.default.get('users/dropdown', 'UserController.usersDropdown');
    Route_1.default.resource('users', 'UserController')
        .middleware({
        show: ['find:User'],
        update: ['find:User'],
    })
        .only(['index', 'show', 'store', 'update']);
    Route_1.default.get('roles/dropdown', 'RoleController.rolesDropdown');
    Route_1.default.get('equipments/dropdown', 'EquipmentController.dropdown');
    Route_1.default.get('industries/dropdown', 'IndustryController.dropdown');
    Route_1.default.get('states', 'StateController.dropdown');
    Route_1.default.get('credit-net-due/dropdown', 'CreditNetDuesController.dropdown');
    Route_1.default.get('customers/dropdown', 'CustomerController.dropdown');
    Route_1.default.get('customers/poc/dropdown/:id', 'CustomerPocController.dropdown');
    Route_1.default.get('customers/delivery-address/dropdown/:id', 'CustomerDeliveryInfoController.dropdown');
    Route_1.default.get('order-type/dropdown', 'OrdersController.orderType');
    Route_1.default.get('order-status/dropdown', 'OrdersController.orderStatus');
    Route_1.default.get('supplier/type/dropdown', 'SuppliersController.type');
    Route_1.default.get('parking-station/dropdown', 'ParkingStationsController.dropdown');
    Route_1.default.get('supplier/dropdown', 'SuppliersController.dropdown');
    Route_1.default.get('bowser/dropdown', 'BowsersController.dropdown');
    Route_1.default.get('bowser/status/dropdown', 'BowsersController.type');
    Route_1.default.get('trips/status/dropdown', 'TripsController.dropdown');
    Route_1.default.get('support-tickets/status/dropdown', 'SupportTicketsController.statusDropdown');
    Route_1.default.get('support-tickets/issue-type/dropdown', 'SupportTicketsController.issueTypeDropdown');
    Route_1.default.get('support-tickets/priority/dropdown', 'SupportTicketsController.priorityDropdown');
    Route_1.default.get('cash-in-hand/type/dropdown', 'CashInHandsController.dropdown');
    Route_1.default.get('purchase-order/status/dropdown', 'PurchaseOrdersController.statusDropdown');
    Route_1.default.get('bank-account/bank/list', 'BankAccountsController.bankListDropdown');
    Route_1.default.group(() => {
        Route_1.default.resource('roles', 'RoleController')
            .middleware({
            show: ['find:Role'],
            update: ['find:Role'],
        })
            .only(['index', 'show', 'store', 'update', 'destroy']);
        Route_1.default.resource('equipments', 'EquipmentController')
            .middleware({
            show: ['find:Equipment'],
            update: ['find:Equipment'],
            destroy: ['find:Equipment'],
        })
            .only(['index', 'show', 'store', 'update', 'destroy']);
        Route_1.default.resource('industries', 'IndustryController')
            .middleware({
            show: ['find:IndustryType'],
            update: ['find:IndustryType'],
            destroy: ['find:IndustryType'],
        })
            .only(['index', 'show', 'store', 'update', 'destroy']);
        Route_1.default.resource('payment-term', 'PaymentTermsController')
            .middleware({
            update: ['find:PaymentTerm'],
            show: ['find:PaymentTerm'],
        })
            .only(['index', 'store', 'update', 'show']);
        Route_1.default.resource('time-slot', 'TimeSlotsController')
            .middleware({
            update: ['find:TimeSlot'],
            show: ['find:TimeSlot'],
            destroy: ['find:TimeSlot'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.patch('bank-acount/update-status/:id', 'BankAccountsController.updateStatus').middleware('find:BankAccount');
        Route_1.default.resource('bank-account', 'BankAccountsController')
            .middleware({
            update: ['find:BankAccount'],
            show: ['find:BankAccount'],
        })
            .only(['index', 'store', 'update', 'show']);
        Route_1.default.resource('customers/type', 'CustomerTypesController')
            .middleware({
            update: ['find:CustomerType'],
            show: ['find:CustomerType'],
            destroy: ['find:CustomerType'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('customers/address-type', 'CustomerAddressTypesController')
            .middleware({
            update: ['find:CustomerAddressType'],
            show: ['find:CustomerAddressType'],
            destroy: ['find:CustomerAddressType'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('suppliers/type', 'SupplierTypesController')
            .middleware({
            update: ['find:SupplierType'],
            show: ['find:SupplierType'],
            destroy: ['find:SupplierType'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('leads/status', 'LeadStatusesController')
            .middleware({
            update: ['find:LeadStatus'],
            show: ['find:LeadStatus'],
            destroy: ['find:LeadStatus'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('leads/source', 'LeadSourcesController')
            .middleware({
            update: ['find:LeadSource'],
            show: ['find:LeadSource'],
            destroy: ['find:LeadSource'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('bowsers/status', 'BowserStatusesController')
            .middleware({
            update: ['find:BowserStatus'],
            show: ['find:BowserStatus'],
            destroy: ['find:BowserStatus'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('bowsers/fuel-capacity', 'FuelCapacitiesController')
            .middleware({
            update: ['find:FuelCapacity'],
            show: ['find:FuelCapacity'],
            destroy: ['find:FuelCapacity'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('message-template', 'MessageTemplatesController')
            .middleware({
            update: ['find:MessageTemplate'],
            show: ['find:MessageTemplate'],
            destroy: ['find:MessageTemplate'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('orders/status', 'OrderStatusesController')
            .middleware({
            update: ['find:OrderStatus'],
            show: ['find:OrderStatus'],
            destroy: ['find:OrderStatus'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('po/status', 'PoStatusesController')
            .middleware({
            update: ['find:PoStatus'],
            show: ['find:PoStatus'],
            destroy: ['find:PoStatus'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('support-tickets/issues', 'TicketIssuesController')
            .middleware({
            update: ['find:TicketIssue'],
            show: ['find:TicketIssue'],
            destroy: ['find:TicketIssue'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.resource('trips/status', 'TripStatusesController')
            .middleware({
            update: ['find:TripStatus'],
            show: ['find:TripStatus'],
            destroy: ['find:TripStatus'],
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
        Route_1.default.get('expense-category/:name', 'ExpenseCategoriesController.index');
        Route_1.default.resource('expense-category', 'ExpenseCategoriesController')
            .middleware({
            update: 'find:ExpenseCategory',
            destroy: 'find:ExpenseCategory',
        })
            .only(['index', 'store', 'update', 'destroy']);
        Route_1.default.resource('payment-type', 'PaymentTypesController')
            .middleware({
            update: 'find:PaymentType',
            show: 'find:PaymentType',
            destroy: 'find:PaymentType',
        })
            .only(['index', 'store', 'update', 'show', 'destroy']);
    }).prefix('settings');
    Route_1.default.get('customers/view/payments/:id', 'CustomerController.getPaymentList').middleware('find:Customer');
    Route_1.default.get('customers/orders/:id', 'CustomerController.getCustomerOrders');
    Route_1.default.resource('customers', 'CustomerController')
        .middleware({
        show: ['find:Customer'],
        update: ['find:Customer'],
    })
        .only(['index', 'show', 'store', 'update']);
    Route_1.default.group(() => {
        Route_1.default.get('orders/all/:id', 'CustomerController.allOrder').middleware('find:Customer');
        Route_1.default.get('poc/all/:id', 'CustomerPocController.getAllById');
        Route_1.default.resource('poc', 'CustomerPocController')
            .middleware({
            show: ['find:CustomerPoc'],
            update: ['find:CustomerPoc'],
            destroy: ['find:CustomerPoc'],
        })
            .apiOnly();
        Route_1.default.get('delivery-address/all/:id', 'CustomerDeliveryInfoController.getAllById');
        Route_1.default.resource('delivery-address', 'CustomerDeliveryInfoController')
            .middleware({
            show: ['find:CustomerDeliveryDetail'],
            update: ['find:CustomerDeliveryDetail'],
            destroy: ['find:CustomerDeliveryDetail'],
        })
            .only(['index', 'show', 'store', 'update', 'destroy']);
    }).prefix('customers');
    Route_1.default.get('leads/options/dropdown', 'LeadsController.options');
    Route_1.default.get('leads/count', 'LeadsController.count');
    Route_1.default.patch('leads/update-status/:id', 'LeadsController.updateStatus').middleware('find:Lead');
    Route_1.default.patch('leads/reassign-lead/:id', 'LeadsController.reassignLeadRequest').middleware('find:Lead');
    Route_1.default.patch('leads/assign-lead/:id', 'LeadsController.assignLead').middleware('find:Lead');
    Route_1.default.resource('leads', 'LeadsController')
        .middleware({
        show: ['find:Lead'],
        update: ['find:Lead'],
    })
        .only(['index', 'show', 'store', 'update']);
    Route_1.default.get('orders/invoices', 'OrdersController.invoiceList');
    Route_1.default.get('orders/invoices/count', 'OrdersController.invoiceStats');
    Route_1.default.get('orders/confirm/:id', 'OrdersController.confirmOrder').middleware('find:Order');
    Route_1.default.put('orders/edit-price/:id', 'OrdersController.updatePrice').middleware('find:Order');
    Route_1.default.resource('orders', 'OrdersController')
        .middleware({
        show: ['find:Order'],
        update: ['find:Order'],
    })
        .only(['index', 'show', 'store', 'update']);
    Route_1.default.group(() => {
        Route_1.default.get('poc/:id', 'OrdersController.getPocByOrderId').middleware('find:Order');
        Route_1.default.post('poc/:id', 'OrdersController.addNewPoc').middleware('find:Order');
        Route_1.default.delete('poc/:id', 'OrdersController.deletePOC').middleware('find:OrderPoc');
        Route_1.default.get('count/all', 'OrdersController.count');
        Route_1.default.patch('update-status/:id', 'OrdersController.updateStatus').middleware('find:Order');
    }).prefix('orders');
    Route_1.default.get('orders/performa-invoice/:id', 'OrdersController.downloadPerforma').middleware('find:Order');
    Route_1.default.get('orders/credit/add/charges', 'OrdersController.addCharges');
    Route_1.default.post('orders/invoice/send/:id', 'OrdersController.sendInvoice').middleware('find:Order');
    Route_1.default.get('orders/mail/all/:id', 'OrdersController.mailList').middleware('find:Order');
    Route_1.default.get('supplier/count', 'SuppliersController.count');
    Route_1.default.get('supplier/view/purchase/count/:id', 'SuppliersController.poStats');
    Route_1.default.get('supplier/view/purchase/:id', 'SuppliersController.getPOListById').middleware('find:Supplier');
    Route_1.default.get('supplier/view/poc/:id', 'SupplierPocsController.getBySupplierId').middleware('find:Supplier');
    Route_1.default.resource('supplier', 'SuppliersController')
        .middleware({
        show: ['find:Supplier'],
        update: ['find:Supplier'],
    })
        .only(['show', 'store', 'update', 'index']);
    Route_1.default.resource('supplier-poc', 'SupplierPocsController')
        .middleware({
        show: ['find:SupplierPoc'],
        update: ['find:SupplierPoc'],
        destroy: ['find:SupplierPoc'],
    })
        .only(['index', 'show', 'store', 'update', 'destroy']);
    Route_1.default.patch('parking-station/update-status/:id', 'ParkingStationsController.updateStatus').middleware('find:ParkingStation');
    Route_1.default.resource('parking-station', 'ParkingStationsController')
        .middleware({
        update: ['find:ParkingStation'],
    })
        .only(['show', 'index', 'update', 'store']);
    Route_1.default.get('bowser/trip/odometer/details/:id', 'TripScheduleLogsController.odometerDetailByTripId').middleware('find:Trip');
    Route_1.default.get('bowser/trip/details/:id', 'BowsersController.tripDetails').middleware('find:Bowser');
    Route_1.default.get('bowser/count/all', 'BowsersController.count');
    Route_1.default.get('bowser/view/driver-detail/:id', 'BowsersController.getDriverLogs').middleware('find:Bowser');
    Route_1.default.put('bowser/view/assign-driver/:id', 'BowsersController.assignDriver').middleware('find:Bowser');
    Route_1.default.patch('bowser/update-status/:id', 'BowsersController.updateStatus').middleware('find:Bowser');
    Route_1.default.resource('bowser', 'BowsersController')
        .middleware({
        update: ['find:Bowser'],
    })
        .only(['show', 'index', 'update', 'store']);
    Route_1.default.get('purchase-order/supplier/confirmation/:id', 'PurchaseOrdersController.supplierConfirmation').middleware('find:PurchaseOrder');
    Route_1.default.get('purchase-order/dashboard/count', 'PurchaseOrdersController.count');
    Route_1.default.patch('purchase-order/update-status/:id', 'PurchaseOrdersController.updateStatus').middleware('find:PurchaseOrder');
    Route_1.default.resource('purchase-order', 'PurchaseOrdersController')
        .middleware({
        update: ['find:PurchaseOrder'],
        show: ['find:PurchaseOrder'],
    })
        .only(['show', 'index', 'update', 'store']);
    Route_1.default.get('trips', 'TripsController.index');
    Route_1.default.get('trips/associated/:id', 'TripScheduleLogsController.tripDetails').middleware('find:Trip');
    Route_1.default.get('trips/count', 'TripsController.count');
    Route_1.default.patch('trips/update-status/:id', 'TripsController.updateStatus').middleware('find:Trip');
    Route_1.default.get('trip-orders/all/:id', 'TripSoOrdersController.index').middleware('find:Trip');
    Route_1.default.get('trip-orders/:id', 'TripSoOrdersController.show').middleware('find:Trip');
    Route_1.default.put('trip-orders/:id', 'TripSoOrdersController.update').middleware('find:Trip');
    Route_1.default.get('trips/orders/confirmed/:id', 'TripSoOrdersController.getAllConfirmedOrders').middleware('find:Trip');
    Route_1.default.delete('trip-orders/:id', 'TripSoOrdersController.destroy').middleware('find:TripSoOrder');
    Route_1.default.get('trips/schedule/:id', 'TripScheduleLogsController.listingByTripId').middleware('find:Trip');
    Route_1.default.get('trips/schedule/bowser/:id', 'TripScheduleLogsController.listingByBowserId');
    Route_1.default.put('trips/schedule/update-status/:id', 'TripScheduleLogsController.updateStatus').middleware('find:TripScheduleLog');
    Route_1.default.put('support-tickets/reassign/:id', 'SupportTicketsController.reassignTicketRequest').middleware('find:SupportTIcket');
    Route_1.default.get('support-tickets/count/all', 'SupportTicketsController.count');
    Route_1.default.get('support-tickets/orders/tracking/:id', 'OrdersController.orderTracking').middleware('find:Order');
    Route_1.default.patch('support-tickets/update-status/:id', 'SupportTicketsController.updateStatus').middleware('find:SupportTicket');
    Route_1.default.resource('support-tickets', 'SupportTicketsController')
        .middleware({
        update: ['find:SupportTicket'],
        show: ['find:SupportTicket'],
    })
        .only(['store', 'update', 'index', 'show']);
    Route_1.default.get('expense/count', 'ExpensesController.count');
    Route_1.default.resource('expense', 'ExpensesController')
        .middleware({
        update: 'find:Expense',
        show: 'find:Expense',
    })
        .only(['index', 'store', 'update', 'show']);
    Route_1.default.group(() => {
        Route_1.default.get('customers/late-charges', 'CustomerController.getLateCharges');
        Route_1.default.put('customers/late-charges/:id', 'CustomerController.updateLateCharges').middleware('find:Customer');
        Route_1.default.get('delivery-charges', 'ValueAndChargesController.deliveryChargesList');
        Route_1.default.post('delivery-charges', 'ValueAndChargesController.saveDeliveryCharges');
        Route_1.default.put('delivery-charges/:id', 'ValueAndChargesController.updateDeliveryCharges').middleware('find:DeliveryCharge');
        Route_1.default.get('purchase-price', 'ValueAndChargesController.purhasePriceList');
        Route_1.default.put('purchase-price/:id', 'ValueAndChargesController.updatePriceBySupplierId').middleware('find:Supplier');
        Route_1.default.get('selling-price', 'ValueAndChargesController.sellPriceList');
        Route_1.default.get('selling-price/current', 'ValueAndChargesController.sellPriceList');
        Route_1.default.post('selling-price', 'ValueAndChargesController.updateSellingPrice');
        Route_1.default.get('logs', 'ValueAndChargesController.logs');
    }).prefix('values-charges');
    Route_1.default.get('cash-in-hand/count', 'CashInHandsController.count');
    Route_1.default.resource('cash-in-hand', 'CashInHandsController')
        .middleware({
        update: 'find:CashInHand',
        show: 'find:CashInHand',
    })
        .only(['index', 'store', 'show', 'update']);
    Route_1.default.get('pay-in/customers/pending-invoices/:id', 'PayInsController.getInvoiceByCustId').middleware('find:Customer');
    Route_1.default.resource('pay-in', 'PayInsController')
        .middleware({
        update: 'find:PayIn',
        show: 'find:PayIn',
    })
        .only(['index', 'show', 'update', 'store']);
    Route_1.default.get('pay-out/suppliers/pending-invoices/:id', 'PayOutsController.getInvoiceBySupplierId').middleware('find:Supplier');
    Route_1.default.resource('pay-out', 'PayOutsController')
        .middleware({
        update: 'find:PayOut',
        show: 'find:PayOut',
    })
        .only(['index', 'show', 'update', 'store']);
    Route_1.default.get('purchase-bill', 'PurchaseBillsController.index');
    Route_1.default.get('purchase-bill/download/:id', 'PurchaseBillsController.downloadPurchaseBill').middleware('find:PurchaseOrder');
    Route_1.default.get('purchase-bill/count', 'PurchaseBillsController.count');
    Route_1.default.post('purchase-bill/send/:id', 'PurchaseBillsController.sendPurchaseBill').middleware('find:PurchaseOrder');
    Route_1.default.get('purchase-bill/mail/all/:id', 'PurchaseBillsController.mailList').middleware('find:PurchaseOrder');
    Route_1.default.get('purchase-sales-order/:id', 'PurchaseOrdersController.listOfAssossiatedOrdersByPoId').middleware('find:PurchaseOrder');
    Route_1.default.put('purchase-sales-order/:id', 'PurchaseOrdersController.assosiateSO').middleware('find:PurchaseOrder');
    Route_1.default.get('purchase-sales-order/orders/confirmed', 'PurchaseOrdersController.listOfConfirmedSO');
    Route_1.default.delete('purchase-sales-order/:id', 'PurchaseOrdersController.deletePOS').middleware('find:PurchaseSalesOrder');
    Route_1.default.get('dashboard/cust-vs-leads', 'DashboardController.custVsLead');
    Route_1.default.get('dashboard/trip-stats', 'DashboardController.tripStats');
    Route_1.default.get('dashboard/fuel-stats', 'DashboardController.fuelStats');
    Route_1.default.get('dashboard/account-stats', 'DashboardController.accountStats');
    Route_1.default.get('dashboard/unpaid-stats', 'DashboardController.unpaidStats');
    Route_1.default.get('notifications/all/unread', 'NotificationsController.getUnreadByUserId');
    Route_1.default.get('notifications/all/read', 'NotificationsController.getReadByUserId');
    Route_1.default.get('notifications/all/clear', 'NotificationsController.clearAll');
    Route_1.default.get('notifications/clear/:id', 'NotificationsController.clear').middleware('find:Notification');
})
    .prefix('admin')
    .middleware('auth');
Route_1.default.get('notify', 'NotificationsController.firebaseNotification');
//# sourceMappingURL=routes.js.map