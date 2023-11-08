import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();
  async function saveProduct(event) {
    event.preventDefault();
    const data = { title, description, price };

    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }
  async function uploadImages(event){
    const files = event.target?.files;
    if(files?.length > 0){
      const data = new FormData();
      files.forEach(file => data.append('file', file));
      const res = await axios.post('/api/upload', data);
      console.log(res.data);
    }
  }
  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="Product Name"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <label>Photos</label>
      <div>
        <label className="w-24 h-24 flex flex-col items-center justify-center text-sm text-blue-900 rounded-xl bg-gray-300 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages}/>
        </label>
        {!images?.length && (
          <div className="mb-2">No Photos for this Product</div>
        )}
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      ></textarea>

      <label>Price</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />

      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
