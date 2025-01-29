import { configureStore } from '@reduxjs/toolkit';  // npm install @reduxjs/toolkit

function reducer(state, action) {
    let newState;

    if(state === undefined) {
        return {number:0}
    }

    if(action.type === 'INCREMENT') {
        newState = Object.assign({}, state, {number:state.number + action.size});
    }

    return newState;
}

const store = configureStore({
    reducer
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;