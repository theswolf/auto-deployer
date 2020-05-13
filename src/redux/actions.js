import ActionTypes from './actionTypes'

export const toggleCommit = () => ({
     type: ActionTypes.TOGGLE_COMMIT
})

export const setValue = (evt) => ({
     type: ActionTypes.SET_VALUE,
     payload: evt
})


export const importFrom = (evt) => ({
     type: ActionTypes.IMPORT,
     payload: evt
})