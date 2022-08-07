const INITIAL_STATE = {
    proposalFrame: null,   
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SUBMITTED_COMMENT':
            return {
                ...state,
                proposalFrame: "LIST"
            };
        case 'PROJECT_PROPOSAL_CREATE_CLICKED':
            return {
                ...state,
                proposalFrame: "CREATE"
            };
        case 'PROJECT_PROPOSAL_EDIT_CLICKED':
            return {
                ...state,
                proposalFrame: "EDIT"
            };
        case 'PROJECT_PROPOSAL_DELETE_CLICKED':
            return {
                ...state,
                proposalFrame: "DELETE"
            };
        default:
            return state;
    }
};