import React, { useState } from 'react'
import { category } from '../Utils/Category';
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useAuthStore } from '../Store/authStore';
import { sizes } from '../Utils/Size';

const CreateProductForm = () => {

    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const { createProduct, loading } = useAuthStore();


    return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Product</h2>

			<form 
            // onSubmit={handleSubmit} 
            className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Product Name
					</label>
					<input
						type='text'
						id='name'
						name='name'
						// value={newProduct.name}
						// onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Description
					</label>
					<textarea
						id='description'
						name='description'
						// value={newProduct.description}
						// onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
						required
					/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						// value={newProduct.price}
						// onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
    <label className="block text-lg font-semibold text-emerald-400 mb-2">
        Select Category
    </label>
    <div className="grid grid-cols-3 gap-3">
        {category.map((category) => (
            <label
                key={category}
                className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg cursor-pointer transition duration-300 hover:bg-emerald-500 hover:text-white"
            >
                <input
                    type="checkbox"
                    value={category}
                    checked={selectedCategory.includes(category)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedCategory([...selectedCategory, category]);
                        } else {
                            setSelectedCategory(selectedCategory.filter((c) => c !== category));
                        }
                    }}
                    className="w-5 h-5 text-emerald-500 bg-gray-900 border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-400"
                />
                <span className="text-white">{category}</span>
            </label>
        ))}
    </div>
</div>


                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
    <label className="block text-lg font-semibold text-emerald-400 mb-2">
        Select Size
    </label>
    <div className="grid grid-cols-3 gap-3">
        {sizes.map((size) => (
            <label
                key={size}
                className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg cursor-pointer transition duration-300 hover:bg-emerald-500 hover:text-white"
            >
                <input
                    type="checkbox"
                    value={size}
                    checked={selectedSizes.includes(size)}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedSizes([...selectedSizes, size]);
                        } else {
                            setSelectedSizes(selectedSizes.filter((s) => s !== size));
                        }
                    }}
                    className="w-5 h-5 text-emerald-500 bg-gray-900 border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-400"
                />
                <span className="text-white">{size}</span>
            </label>
        ))}
    </div>
</div>

				<div className='mt-1 flex items-center'>
					{/* <input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} /> */}
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Upload Image
					</label>
					{/* {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image uploaded </span>} */}
				</div>

				<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					// disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>
			</form>
		</motion.div>
	);

}

export default CreateProductForm
