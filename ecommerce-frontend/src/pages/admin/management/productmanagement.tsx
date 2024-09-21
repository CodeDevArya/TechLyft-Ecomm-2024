import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useProductStore } from "../../../store/productStore";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/admin/Loader";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";
import { server } from "../../../App";

const Productmanagement = () => {
  const { getProductById, isLoading, updateProduct, deleteProduct } =
    useProductStore();
  const { user } = useAuthStore();
  const { id } = useParams();

  const navigate = useNavigate();

  const [price, setPrice] = useState<number>(2000);
  const [stock, setStock] = useState<number>(10);
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [photos, setPhotos] = useState<any[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductById(id!);
      setCategory(res.category);
      setName(res.name);
      setPrice(res.price);
      setStock(res.stock);
      setDescription(res.description);
      setNameUpdate(res.name);
      setPriceUpdate(res.price);
      setStockUpdate(res.stock);
      setCategoryUpdate(res.category);
      setDescriptionUpdate(res.description);

      // Append server URL to each photo and set the state
      // setPhotos(res.photos);
      const photosWithServerUrl = res.photos.map(
        (photo: string) => `${server}/${photo}`
      );
      setPhotos(photosWithServerUrl);
    };
    fetchProduct();
  }, [getProductById, id]);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewPhotos((prev) => [...prev, ...filesArray]);
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const confirmAns = confirm("Are you sure you want to 'update' product?");
    if (!confirmAns) {
      return;
    }

    const formData = new FormData();

    if (nameUpdate !== name) formData.set("name", nameUpdate);
    if (stockUpdate !== stock) formData.set("stock", String(stockUpdate));
    if (priceUpdate !== price) formData.set("price", String(priceUpdate));
    if (categoryUpdate !== category) formData.set("category", categoryUpdate);
    if (descriptionUpdate !== description)
      formData.set("description", descriptionUpdate);

    let isPhoto = false;
    newPhotos.forEach((photo) => {
      formData.append("photos", photo);
      isPhoto = true;
    });

    const res = await updateProduct(id!, user?._id!, formData);

    if (res.success) {
      toast.success("Success - Product updated successfully");
      if(isPhoto) {
        const UpdatedphotosToShow = newPhotos.map((photo: File) =>
          URL.createObjectURL(photo)
        );
        setPhotos(UpdatedphotosToShow);
      }
      
      setNewPhotos([]);
      setPrice(priceUpdate);
      setStock(stockUpdate);
      setName(nameUpdate);
      setDescription(descriptionUpdate);
    } else {
      toast.error("Error updating Product");
    }
  };

  const deleteProductHandler = async () => {
    const confirmAns = confirm(
      "Are you sure you want to 'delete' the product?"
    );
    if (!confirmAns) {
      return;
    }
    const res = await deleteProduct({ ProductId: id!, adminId: user?._id! });

    if (res.success) {
      toast.success("Success - Product deleted successfully");
      navigate("/admin/product");
    } else {
      toast.error("Error deleting Product");
    }
  };

  return (
    <div className="admin-container container">
      <AdminSidebar />
      {isLoading ? (
        <Loader />
      ) : (
        <main className="product-management">
          <section>
            <strong>ID - {id}</strong>
            <div>
              {photos.length > 0 &&
                photos.map((img, index) => (
                  <img key={index} src={img} alt="Product" />
                ))}
            </div>
            <p>{name}</p>
            {stock > 0 ? (
              <span className="green">{stock} Available</span>
            ) : (
              <span className="red"> Not Available</span>
            )}
            <h3>₹{price}</h3>
            <p>{description}</p>
          </section>
          <article>
            <button
              className="product-delete-btn"
              onClick={deleteProductHandler}
            >
              <FaTrash />
            </button>
            <form onSubmit={submitHandler}>
              <h2>Manage</h2>
              <div>
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={nameUpdate}
                  onChange={(e) => setNameUpdate(e.target.value)}
                />
              </div>
              <div>
                <label>Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={priceUpdate}
                  onChange={(e) => setPriceUpdate(Number(e.target.value))}
                />
              </div>
              <div>
                <label>Stock</label>
                <input
                  type="number"
                  placeholder="Stock"
                  value={stockUpdate}
                  onChange={(e) => setStockUpdate(Number(e.target.value))}
                />
              </div>

              <div>
                <label>Category</label>
                <input
                  type="text"
                  placeholder="eg. laptop, camera etc"
                  value={categoryUpdate}
                  onChange={(e) => setCategoryUpdate(e.target.value)}
                />
              </div>
              <div>
                <label>Description</label>
                <textarea
                  value={descriptionUpdate}
                  rows={10}
                  onChange={(e) => setDescriptionUpdate(e.target.value)}
                  style={{ width: "100%", padding: "1rem" }}
                ></textarea>
              </div>

              <div>
                <label>Photos</label>
                <input type="file" multiple onChange={changeImageHandler} />
                <div>
                  {newPhotos.length > 0 &&
                    newPhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          marginRight: "10px",
                        }}
                      />
                    ))}
                </div>
              </div>

              <button type="submit">Update</button>
            </form>
          </article>
        </main>
      )}
    </div>
  );
};

export default Productmanagement;