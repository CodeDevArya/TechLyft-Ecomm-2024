import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useProductStore } from "../../../store/productStore";
import { useAuthStore } from "../../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const { addProduct, error } = useProductStore();
  const { user } = useAuthStore();

  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photosPrev, setPhotosPrev] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);

  const changeImagesHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e.target.files;

    if (files) {
      const newPhotos: File[] = Array.from(files);
      const newPhotosPrev: string[] = [];

      newPhotos.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            newPhotosPrev.push(reader.result);
            setPhotos((prev) => [...prev, file]);
            setPhotosPrev((prev) => [...prev, reader.result as string]);
          }
        };
      });
    }
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?._id || !name || !price || !stock || !category || photos.length === 0 || !description) {
      return toast.error("Please provide all fields");
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", String(price));
    formData.set("stock", String(stock));
    formData.set("category", category);
    formData.set("description", description);

    photos.forEach((photo) => {
      formData.append('photos', photo); // 'photos' should match the field name used in multer configuration
    });

    const res = await addProduct(user?._id!, formData);
    if (res.success === true) {
      navigate("/admin/product");
      toast.success("Success - Product added successfully");
    }
    if (res.success === false) {
      toast.error("Error adding Product");
    }

    if (error) {
      toast.error(error);
    }
  };

  return (
    <div className="admin-container container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={onSubmitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                required
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                cols={30}
                rows={5}
                style={{ width: "100%", padding: "0.8rem" }}
                required
                placeholder="Description here ..."
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                required
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                required
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photos</label>
              <input
                type="file"
                multiple
                required
                onChange={changeImagesHandler}
              />
            </div>

            {photosPrev.length > 0 && (
              <div className="photo-preview-grid">
                {photosPrev.map((photo, index) => (
                  <img key={index} src={photo} alt={`Preview ${index}`} style={{ width: "100px", height: "100px", margin: "10px" }} />
                ))}
              </div>
            )}

            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
