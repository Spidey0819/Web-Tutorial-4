// src/store/actions.ts

import type { Dispatch } from 'redux';
import type {
    Product,
    ProductFormData,
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

const API_BASE_URL = 'http://localhost:5000/api';

// Action Creators
export const createProductRequest = (): ProductActionTypes => ({
    type: CREATE_PRODUCT_REQUEST,
});

export const createProductSuccess = (product: Product): ProductActionTypes => ({
    type: CREATE_PRODUCT_SUCCESS,
    payload: product,
});

export const createProductFailure = (error: string): ProductActionTypes => ({
    type: CREATE_PRODUCT_FAILURE,
    payload: error,
});

export const readProductsRequest = (): ProductActionTypes => ({
    type: READ_PRODUCTS_REQUEST,
});

export const readProductsSuccess = (products: Product[]): ProductActionTypes => ({
    type: READ_PRODUCTS_SUCCESS,
    payload: products,
});

export const readProductsFailure = (error: string): ProductActionTypes => ({
    type: READ_PRODUCTS_FAILURE,
    payload: error,
});

export const updateProductRequest = (): ProductActionTypes => ({
    type: UPDATE_PRODUCT_REQUEST,
});

export const updateProductSuccess = (product: Product): ProductActionTypes => ({
    type: UPDATE_PRODUCT_SUCCESS,
    payload: product,
});

export const updateProductFailure = (error: string): ProductActionTypes => ({
    type: UPDATE_PRODUCT_FAILURE,
    payload: error,
});

export const deleteProductRequest = (): ProductActionTypes => ({
    type: DELETE_PRODUCT_REQUEST,
});

export const deleteProductSuccess = (productId: string): ProductActionTypes => ({
    type: DELETE_PRODUCT_SUCCESS,
    payload: productId,
});

export const deleteProductFailure = (error: string): ProductActionTypes => ({
    type: DELETE_PRODUCT_FAILURE,
    payload: error,
});

export const clearToast = (): ProductActionTypes => ({
    type: CLEAR_TOAST,
});

// Async Action Creators (Thunks)
export const fetchProducts = () => {
    return async (dispatch: Dispatch<ProductActionTypes>) => {
        dispatch(readProductsRequest());
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            const data = await response.json();
            if (response.ok) {
                dispatch(readProductsSuccess(data.products));
            } else {
                dispatch(readProductsFailure(data.error || 'Failed to fetch products'));
            }
        } catch (error) {
            dispatch(readProductsFailure('Network error: ' + (error as Error).message));
        }
    };
};

export const createProduct = (productData: ProductFormData) => {
    return async (dispatch: Dispatch<ProductActionTypes>) => {
        dispatch(createProductRequest());
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            const data = await response.json();
            if (response.ok) {
                dispatch(createProductSuccess(data.product));
            } else {
                dispatch(createProductFailure(data.error || 'Failed to create product'));
            }
        } catch (error) {
            dispatch(createProductFailure('Network error: ' + (error as Error).message));
        }
    };
};

export const updateProduct = (productId: string, productData: Partial<ProductFormData>) => {
    return async (dispatch: Dispatch<ProductActionTypes>) => {
        dispatch(updateProductRequest());
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });
            const data = await response.json();
            if (response.ok) {
                dispatch(updateProductSuccess(data.product));
            } else {
                dispatch(updateProductFailure(data.error || 'Failed to update product'));
            }
        } catch (error) {
            dispatch(updateProductFailure('Network error: ' + (error as Error).message));
        }
    };
};

export const deleteProduct = (productId: string) => {
    return async (dispatch: Dispatch<ProductActionTypes>) => {
        dispatch(deleteProductRequest());
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                dispatch(deleteProductSuccess(productId));
            } else {
                dispatch(deleteProductFailure(data.error || 'Failed to delete product'));
            }
        } catch (error) {
            dispatch(deleteProductFailure('Network error: ' + (error as Error).message));
        }
    };
};