const fields = {
    name: '',
    registration_no: '',
    fuel_capacity: '',
    image: '',
    registration: '',
    pollution_cert: '',
    vehicle_fitness: '',
    heavy_vehicle: '',
    other_doc: '',
    heavy_vehicle_validity: null,
    registration_validity: null,
    pollution_cert_validity: null,
    vehicle_fitness_validity: null,
    other_doc_validity: null,
    registration_validity_check: false,
    pollution_cert_validity_check: false,
    vehicle_fitness_validity_check: false,
    heavy_vehicle_validity_check: false,
    other_doc_validity_check: false,
    parking_station_id: '',
}

const rules = {
    name: 'required|max:20',
    registration_no: 'required|max:30',
    fuel_capacity: 'required',
    parking_station_id: 'required',
}

module.exports = { fields, rules }
