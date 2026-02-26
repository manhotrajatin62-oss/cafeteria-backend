import { useState } from "react";
import type { Product } from "./types.ts";
import food from "../../../assets/food.jpg";
import BackButton from "../../../ui/BackButton.tsx";

const STATUS_OPTIONS: Product["status"][] = ["In Stock", "Out of Stock"];

export default function ProductForm({
  initial,
  onSubmit,
  onBack,
  title,
}: any) {

  // states
  const [name, setName] = useState(initial?.name ?? "");
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [status, setStatus] = useState<Product["status"]>(
    initial?.status ?? "In Stock",
  );
  const [productId, setProductId] = useState(initial?.productId ?? "");
  const [quantity, setQuantity] = useState(initial?.quantity?.toString() ?? "");

  function handleSubmit(e: any) {
    e.preventDefault();
    onSubmit({
      name,
      unit,
      category,
      price: Number.parseFloat(price) || 0,
      status,
      productId,
      quantity: Number.parseInt(quantity) || 0,
      image: initial?.image ?? food,
    });
  }

  // input and label classes
  const inputClass =
    "w-full border border-gray-300 mt-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition";

  const labelClass = "block text-sm font-semibold text-black mb-1.5";

  return (

    <div className="flex min-h-screen items-center justify-center">

      {/* product form container */}
      <div className="w-full bg-white px-6 pb-6 ">

        {/* Heading */}
        <h1 className="mb-6 text-xl font-bold text-gray-800">{title}</h1>

      {/* form container */}
       <div className="flex flex-col gap-6 border border-gray-300 rounded-lg p-6">

         {/* Image Upload Area */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4 rounded-xl ">

          <div className="self-start">
            <BackButton  onClick={onBack}/>
          </div>

          <div className="flex h-40 w-40 overflow-hidden items-center justify-center rounded-xl bg-red-100">
            <img className="object-cover w-full h-full" src={food} alt="food-img" />
          </div>
          <span className="text-xl font-semibold text-black">
            Upload Image
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="name" className={labelClass}>
                Product Name :
              </label>
              <input
                className={inputClass}
                placeholder="Product Name"
                value={name}
                id="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="unit" className={labelClass}>
                Product Unit :
              </label>
              <input
                className={inputClass}
                placeholder="Enter Unit"
                value={unit}
                id="unit"
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category" className={labelClass}>
                Category :
              </label>
              <input
                className={inputClass}
                placeholder="Enter Category"
                value={category}
                id="category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="price" className={labelClass}>
                Price :
              </label>
              <input
                className={inputClass}
                placeholder="Enter Price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                id="price"
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>
                Status :
              </label>
              <select
                className={inputClass}
                value={status}
                id="status"
                onChange={(e) => setStatus(e.target.value as Product["status"])}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="productId" className={labelClass}>
                Product ID :
              </label>
              <input
                className={inputClass}
                placeholder="123456789"
                value={productId}
                id="productId"
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-8">
            <label htmlFor="quantity" className={labelClass}>
              Quantity / Stock :
            </label>
            <input
              className={`${inputClass} max-w-xs`}
              placeholder="Enter quantity"
              type="number"
              min="0"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

              {/* submit form button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="rounded-lg bg-orange px-10 py-3 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:bg-dark-orange cursor-pointer active:scale-95"
            >
              Save Product
            </button>
          </div>
        </form>
       </div>
      </div>
    </div>
  );
}
