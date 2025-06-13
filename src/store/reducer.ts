// src/store/reducer.ts

import type {
    ProductsState,
    ProductActionTypes,
} from '../types';
import {
    CREATE_PRODUCT_REQUEST,
    CREATE_PRODUCT_SUCCESS,
    CREATE_PRODUCT_FAILURE,
    READ_PRODUCTS_REQUEST,
    READ_PRODUCTS_SUCCESS,
    READ_PRODUCTS_FAILURE,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAILURE,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAILURE,
    CLEAR_TOAST,
} from '../types';

const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null,
    toast: null,
};

const productsReducer = (
    state = initialState,
    action: ProductActionTypes
): ProductsState => {
    switch (action.type) {
        case CREATE_PRODUCT_REQUEST:
        case READ_PRODUCTS_REQUEST:
        case UPDATE_PRODUCT_REQUEST:
        case DELETE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case READ_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload,
                toast: { type: 'success', message: 'Products loaded successfully!' },
            };

        case CREATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: [...state.products, action.payload],
                toast: { type: 'success', message: 'Product created successfully!' },
            };

        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: state.products.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                ),
                toast: { type: 'success', message: 'Product updated successfully!' },
            };

        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: state.products.filter((product) => product.id !== action.payload),
                toast: { type: 'success', message: 'Product deleted successfully!' },
            };

        case CREATE_PRODUCT_FAILURE:
        case READ_PRODUCTS_FAILURE:
        case UPDATE_PRODUCT_FAILURE:
        case DELETE_PRODUCT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                toast: { type: 'error', message: action.payload },
            };

        case CLEAR_TOAST:
            return {
                ...state,
                toast: null,
            };

        default:
            return state;
    }
};

export default productsReducer;