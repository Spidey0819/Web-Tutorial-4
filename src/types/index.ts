// src/types/index.ts

export interface Product {
    id: string;
    title: string;
    image: string;
    description: string;
    price: number;
    created_at?: string;
    updated_at?: string;
}

export interface ProductFormData {
    title: string;
    image: string;
    description: string;
    price: number | string;
}

export interface Toast {
    type: 'success' | 'error';
    message: string;
}

// Redux State Types
export interface ProductsState {
    products: Product[];
    loading: boolean;
    error: string | null;
    toast: Toast | null;
}

export interface RootState {
    products: ProductsState;
}

// Action Types
export const CREATE_PRODUCT_REQUEST = 'CREATE_PRODUCT_REQUEST';
export const CREATE_PRODUCT_SUCCESS = 'CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'CREATE_PRODUCT_FAILURE';

export const READ_PRODUCTS_REQUEST = 'READ_PRODUCTS_REQUEST';
export const READ_PRODUCTS_SUCCESS = 'READ_PRODUCTS_SUCCESS';
export const READ_PRODUCTS_FAILURE = 'READ_PRODUCTS_FAILURE';

export const UPDATE_PRODUCT_REQUEST = 'UPDATE_PRODUCT_REQUEST';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'UPDATE_PRODUCT_FAILURE';

export const DELETE_PRODUCT_REQUEST = 'DELETE_PRODUCT_REQUEST';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILURE = 'DELETE_PRODUCT_FAILURE';

export const CLEAR_TOAST = 'CLEAR_TOAST';

// Action Interfaces
interface CreateProductRequestAction {
    type: typeof CREATE_PRODUCT_REQUEST;
}

interface CreateProductSuccessAction {
    type: typeof CREATE_PRODUCT_SUCCESS;
    payload: Product;
}

interface CreateProductFailureAction {
    type: typeof CREATE_PRODUCT_FAILURE;
    payload: string;
}

interface ReadProductsRequestAction {
    type: typeof READ_PRODUCTS_REQUEST;
}

interface ReadProductsSuccessAction {
    type: typeof READ_PRODUCTS_SUCCESS;
    payload: Product[];
}

interface ReadProductsFailureAction {
    type: typeof READ_PRODUCTS_FAILURE;
    payload: string;
}

interface UpdateProductRequestAction {
    type: typeof UPDATE_PRODUCT_REQUEST;
}

interface UpdateProductSuccessAction {
    type: typeof UPDATE_PRODUCT_SUCCESS;
    payload: Product;
}

interface UpdateProductFailureAction {
    type: typeof UPDATE_PRODUCT_FAILURE;
    payload: string;
}

interface DeleteProductRequestAction {
    type: typeof DELETE_PRODUCT_REQUEST;
}

interface DeleteProductSuccessAction {
    type: typeof DELETE_PRODUCT_SUCCESS;
    payload: string;
}

interface DeleteProductFailureAction {
    type: typeof DELETE_PRODUCT_FAILURE;
    payload: string;
}

interface ClearToastAction {
    type: typeof CLEAR_TOAST;
}

export type ProductActionTypes =
    | CreateProductRequestAction
    | CreateProductSuccessAction
    | CreateProductFailureAction
    | ReadProductsRequestAction
    | ReadProductsSuccessAction
    | ReadProductsFailureAction
    | UpdateProductRequestAction
    | UpdateProductSuccessAction
    | UpdateProductFailureAction
    | DeleteProductRequestAction
    | DeleteProductSuccessAction
    | DeleteProductFailureAction
    | ClearToastAction;