// src/store/index.ts

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import productsReducer from './reducer';
import type { RootState } from '../types';

// Root Reducer
const rootReducer = combineReducers({
    products: productsReducer,
});

// Create Store with middleware
const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppDispatch = typeof store.dispatch;
export type AppRootState = RootState;

export default store;