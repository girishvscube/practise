const fields = {
    step_1: {
        name: '',
        phone: '',
        type: '',
        email: '',
        address: '',
        image:'',
        city: '',
        location: '',
        pincode: '',
        state: '',
        account_number: '',
        account_name: '',
        bank_name: '',
        ifsc_code: '',
        cancelled_cheque: '',
        gst: '',
        gst_certificate: '',
    },
    step_2: {
        poc_name: '',
        designation: '',
        contact: '',
        email: '',
        image: '',
        supplier_id: '',
    },
}

const rules = {
    step_1: {
        name: 'required|max:20',
        phone: 'required|min:10|max:10',
        email: 'required|email',
        address: 'required|max:200',
        city: 'required|max:20',
        pincode: 'required|min:6|max:6',
        state: 'required',
        account_number: 'required|max:17',
        account_name: 'required|max:50',
        bank_name: 'required|max:20',
        ifsc_code: 'required|max:11',
        cancelled_cheque: 'required',
        gst: 'required',
        gst_certificate: 'required',
        type: 'required',
        location: 'required|url',
    },
    step_2: {
        poc_name: 'required|max:20',
        designation: 'required|max:20',
        contact: 'required|min:10|max:10',
        email: 'required|email|max:225',
        supplier_id: 'required',
    },
}

module.exports = { fields, rules }
