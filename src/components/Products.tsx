import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import type { RootState, Product, ProductFormData } from '../types';
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    clearToast,
} from '../store/actions';


const productSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().positive('Price must be a positive number').required('Price is required'),
});


interface ToastProps {
    toast: { type: 'success' | 'error'; message: string } | null;
    onClear: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClear }) => {
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(onClear, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast, onClear]);

    if (!toast) return null;

    return (
        <div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
        >
            <div className="flex items-center justify-between">
                <span>{toast.message}</span>
                <button onClick={onClear} className="ml-2 text-white hover:text-gray-200">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};


const Spinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
);


interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit: (values: ProductFormData) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSubmit }) => {
    if (!isOpen) return null;

    const initialValues: ProductFormData = {
        title: product?.title || '',
        image: product?.image || '',
        description: product?.description || '',
        price: product?.price || '',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-bold mb-4">
                    {product ? 'Edit Product' : 'Add Product'}
                </h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={productSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        onSubmit(values);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting, handleSubmit }) => (
                        <div className="space-y-4">
                            <div>
                                <Field
                                    name="title"
                                    placeholder="Product Title"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <Field
                                    name="image"
                                    placeholder="Image URL"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                                <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <Field
                                    as="textarea"
                                    name="description"
                                    placeholder="Product Description"
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <Field
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="Price"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                                />
                                <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit()}
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                >
                                    {product ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    )}
                </Formik>
            </div>
        </div>
    );
};


interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
        />
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">${product.price}</span>
                <div className="space-x-2">
                    <button
                        onClick={() => onEdit(product)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 inline-flex items-center"
                    >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 inline-flex items-center"
                    >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
);


const Products: React.FC = () => {
    const dispatch = useDispatch();
    const { products, loading, toast } = useSelector((state: RootState) => state.products);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        dispatch(fetchProducts() as any);
    }, [dispatch]);

    const handleCreateProduct = async (values: ProductFormData) => {
        dispatch(createProduct(values) as any);
        setModalOpen(false);
    };

    const handleEditProduct = async (values: ProductFormData) => {
        if (editingProduct) {
            dispatch(updateProduct(editingProduct.id, values) as any);
            setModalOpen(false);
            setEditingProduct(null);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(productId) as any);
        }
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Product Manager</h1>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-flex items-center"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Product
                    </button>
                </div>

                {loading && <Spinner />}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onEdit={openEditModal}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>

                {products.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No products found. Add your first product!</p>
                    </div>
                )}

                <ProductModal
                    isOpen={modalOpen}
                    onClose={closeModal}
                    product={editingProduct}
                    onSubmit={editingProduct ? handleEditProduct : handleCreateProduct}
                />

                <Toast toast={toast} onClear={() => dispatch(clearToast())} />
            </div>
        </div>
    );
};

export default Products;