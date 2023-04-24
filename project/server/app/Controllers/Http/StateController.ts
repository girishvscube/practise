import { statesList } from 'App/Helpers/utils'

export default class StateController {
    public async dropdown({ response }) {
        return response.json(statesList)
    }
}
