const INITIAL_STATE = {
  signUp: {
    hasError: false,
    errMessage: '',
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'PROPOSAL_APP_ICON_CLICKED':
      return {
        ...state,
        selectedAppIcon: 'PROJECT_PROPOSAL',
      };
    default:
      return state;
  }
};
