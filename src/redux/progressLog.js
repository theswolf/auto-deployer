import ActionTypes from './actionTypes'


export default function progressLog (
state = {
    log:[]
},
action
)
{
    switch(action.type) {
        case ActionTypes.PROGRESS_LOG:
            return {...state,log: state.log.concat([action.payload])}   
        case ActionTypes.CLEAR_LOG:
                return {...state,log:[]}
        default:
            return state
    }

}
