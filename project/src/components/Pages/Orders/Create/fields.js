const fields = {
  step_1: {
    customer_id: '',
    customer_delivery_id: '',
    order_type: '',
    delivery_date: '',
    time_slot_id: '',
    fuel_qty: '',
    sales_executive_id: '',
    per_litre_cost: 115.5,
    poc_ids: [],

  },
  step_2: {
    order_id: null,
    discount_type: 'Percentage',
    discount: null,
    per_litre_cost: null,
    delivery_charges: 0,
    payment_type: null,
    payment_rules: '',
    payment_status: 'Pending',
    additional_notes: '',
    total_amount: 0,
    grand_total: 0,
  },
  step_3: {
    address_1: '',
    address_2: '',
    pincode: '',
    address_type: '',
    city: '',
    state: '',
    phone: '',
    landmark: '',
    location: '',
    customer_poc_id: '',
    fuel_price: '',
    is_fuel_price_checked: false,
  },
};

const rules = {
  step_1: {
    customer_id: 'required',
    customer_delivery_id: 'required',
    order_type: 'required',
    delivery_date: 'required',
    time_slot_id: 'required',
    fuel_qty: 'required',
    sales_executive_id: 'required',
   
    poc_ids: 'required',
  },
  step_2: {
    poc_name: 'required',
    designation: 'required',
    phone: 'required|numeric|digits:10',
    email: 'required|email',
    image: 'required',
  },
  step_3: {
    address_1: 'required',
    address_2: 'required',
    address_type: 'required',
    city: 'required',
    pincode: 'required|numeric|digits:6',
    state: 'required',
    phone: 'required|numeric|digits:10',
    customer_poc_id: 'required',
  },
};

module.exports = { fields, rules };
