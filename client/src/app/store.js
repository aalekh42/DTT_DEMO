import { applyMiddleware, combineReducers, configureStore, createStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import commonReducer from '../redux/reducers/commonReducer';
import demoReducer from '../redux/reducers/demoReducer';

// export const store = configureStore({
//   reducer: {
//     common: commonReducer
//   },
// });

const rootReducer= combineReducers({
  common:commonReducer,
  demo:demoReducer
})

export const store = createStore(rootReducer,applyMiddleware(thunk));
