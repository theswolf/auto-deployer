import ActionTypes from './actionTypes'

const initialState = {
    isSingleCommit: false,
    fromUrl: "",
    fromUserName:"",
    fromPassword:"",
    fromBranch:"",
    toUrl: "",
    toUserName:"",
    toPassword:"",
    toBranch:"",
    proxyUrl:"",
    proxyPort:""

}

export default function commitReducer (
state = initialState,
action
)
{
    switch(action.type) {
        case ActionTypes.TOGGLE_COMMIT:
            return {...state,isSingleCommit: !state.isSingleCommit}
        case ActionTypes.SET_VALUE:
            debugger;
            let key = action.payload.target.id;
            let value =  action.payload.target.value;
            return {...state,[key]: value}
        case ActionTypes.IMPORT:
            let valueImport =  action.payload
            return {...valueImport}
        default:
            return state
    }

}
