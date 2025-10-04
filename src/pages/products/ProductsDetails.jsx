import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
import left from '../../assets/images/lefticon.png';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { Editor } from 'primereact/editor';

const ProductsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [category, setCategory] = useState([]);
    const [subcategory, setSubcategory] = useState([]);
    const [metals, setmetals] = useState([]);
    const [stoneShape, setStoneShape] = useState([]);
    const [goldPurity, setGoldPurity] = useState([]);

    const handleClose = () => setShow(false);
    const handleOpen = (img) => {
        setSelectedImage(img);
        setShow(true);
    };

    const getProductsDetails = async (id) => {
        setLoader(true);
        try {
            const res = await Axios.get(
                apiendpoints.detailsProducts.replace(":id", id),
                authorizationHeaders()
            );

            if (res.data?.status) {
                let data = res.data.data;

                // ✅ Parse productMaterials if stringified
                if (data.productMaterials && typeof data.productMaterials === "string") {
                    try {
                        const parsed = JSON.parse(data.productMaterials); // convert string → object
                        data.productMaterials = Object.entries(parsed).map(([key, value]) => ({
                            key,
                            value,
                        }));
                    } catch (err) {
                        console.error("Failed to parse productMaterials:", err);
                        data.productMaterials = [];
                    }
                }

                setFormData(data);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            if (err?.message === "Network Error") {
                toast.error(err.message);
            } else if (err.response?.status === 404) {
                toast.error(err.response.data.message);
            } else if (err.response?.status === 500) {
                toast.error(err.response.data.message);
            }
        } finally {
            setLoader(false);
        }
    };


    useEffect(() => {
        getProductsDetails(id);
    }, [id]);

    const fetchCategory = async () => {

        try {
            const res = await Axios.get(apiendpoints.category, authorizationHeaders());

            if (res.data?.status) {
                setCategory(res.data?.data || []);
            }
            else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            }
            else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        } finally {
            // setLoader(false);
        }
    }

    const fetchSubCategory = async () => {

        try {
            const res = await Axios.get(`${apiendpoints.subCategory}`, authorizationHeaders());

            if (res.data?.status) {
                setSubcategory(res.data?.data || []);
            }
            else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            }
            else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        } finally {
        }
    }

    const fetchMetals = async () => {

        try {
            const res = await Axios.get(`${apiendpoints.metal}`, authorizationHeaders());

            if (res.data?.status) {
                setmetals(res.data?.data || []);
            }
            else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            }
            else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        } finally {
        }
    }

    const fetchStoneShape = async () => {

        try {
            const res = await Axios.get(`${apiendpoints.StoneShape}`, authorizationHeaders());

            if (res.data?.status) {
                setStoneShape(res.data?.data || []);
            }
            else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            }
            else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        } finally {
        }
    }

    const fetchgoldPurity = async () => {

        try {
            const res = await Axios.get(`${apiendpoints.goldPurity}`, authorizationHeaders());

            if (res.data?.status) {
                setGoldPurity(res.data?.data || []);
            }
            else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            }
            else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        } finally {
        }
    }
    useEffect(() => {
        fetchCategory();
        fetchSubCategory();
        fetchMetals();
        fetchStoneShape();
        fetchgoldPurity();
    }, [])
    return (
        <>
            <section className="categorylist-section mt-4 mt-lg-4 mt-xl-5">
                <div className="edit-user">
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <h2 className="d-flex mb-0 title">
                                <div className='pe-4' style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
                                    <img src={left} alt="" style={{ height: '30px' }} />
                                </div>
                                <div>Product Detail</div>
                            </h2>
                        </div>

                        {/* ✅ Show loader while fetching */}
                        {loader ? (
                            <div className="d-flex justify-content-center align-items-center py-5 w-100">
                                <div className="spinner-border text-black" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <form className="form row g-3">
                                {/* Photo Preview Buttons */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2 d-flex flex-column">
                                    <label className="form-label">Photos :</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {(formData?.images || []).length > 0 ? (
                                            formData.images.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt={`Preview ${i + 1}`}
                                                    onClick={() => handleOpen(img)}
                                                    className="img-thumbnail"
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        objectFit: "cover",
                                                        cursor: "pointer"
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <span className="text-muted">No images available</span>
                                        )}
                                    </div>
                                </div>

                                {/* Title */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="title" className="form-label">Title :</label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="form-control"
                                        placeholder="Enter Title"
                                        autoComplete='off'
                                        value={formData.title || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* stockNumber */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="stockNumber" className="form-label">Stock Number :</label>
                                    <input
                                        type="text"
                                        id="stockNumber"
                                        className="form-control"
                                        value={formData?.stockNumber || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* shortDescription */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="shortDescription" className="form-label">Short Description  :</label>
                                    <input
                                        type="text"
                                        id="shortDescription "
                                        className="form-control"
                                        value={formData?.shortDescription || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* Estimated Time */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="estimatedTime" className="form-label">
                                        Estimated Time :
                                    </label>
                                    <input
                                        type="text"
                                        name="estimatedTime"
                                        id="estimatedTime"
                                        className="form-control"
                                        placeholder="Enter Estimated Time "
                                        autoComplete="off"
                                        value={formData.estimatedTime || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* Original Price */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="original_price" className="form-label">
                                        Original Price:
                                    </label>
                                    <input
                                        type="text"
                                        name="original_price"
                                        id="original_price"
                                        className="form-control"
                                        placeholder="Enter original price"
                                        autoComplete="off"
                                        value={formData.original_price || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* Selling Price */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="selling_price" className="form-label">
                                        Selling Price:
                                    </label>
                                    <input
                                        type="text"
                                        name="selling_price"
                                        id="selling_price"
                                        className="form-control"
                                        placeholder="Enter selling price"
                                        autoComplete="off"
                                        value={formData.selling_price || "-"}
                                        readOnly
                                    />
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label className="form-label">Product Materials :</label>
                                    {Array.isArray(formData?.productMaterials) && formData.productMaterials.length > 0 ? (
                                        formData.productMaterials.map((item, index) => (
                                            <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Key"
                                                    className="form-control"
                                                    value={item.key || "-"}
                                                    readOnly
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Value"
                                                    className="form-control"
                                                    value={item.value || "-"}
                                                    readOnly
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted">No product materials available</div>
                                    )}

                                </div>

                                {/* category Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="categoryId" className="form-label">
                                        Select Category :
                                    </label>
                                    <select
                                        name="categoryId"
                                        id="categoryId"
                                        className="form-select"
                                        value={formData.categoryId || ""}
                                        disabled
                                    >
                                        <option value="">-- Select Category --</option>
                                        {category?.map((item) => (
                                            <option key={item._id} value={item.id}>
                                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sub-category Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="subCategoryId" className="form-label">
                                        Select Sub Category :
                                    </label>
                                    <select
                                        name="subCategoryId"
                                        id="subCategoryId"
                                        className="form-select"
                                        value={formData.subCategoryId || ""}
                                        disabled
                                    >
                                        <option value="">-- Select Sub Category --</option>
                                        {subcategory?.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Metals Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="metalId" className="form-label">
                                        Select Metals:
                                    </label>
                                    <select
                                        name="metalId"
                                        id="metalId"
                                        className="form-select"
                                        value={formData.metalId || ""}
                                        disabled
                                    >
                                        <option value="">-- Select Metals --</option>
                                        {metals?.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* stoneShape Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="stoneShapeId" className="form-label">
                                        Select Stone Shape:
                                    </label>
                                    <select
                                        name="stoneShapeId"
                                        id="stoneShapeId"
                                        className="form-select"
                                        value={formData.stoneShapeId || ""}
                                        disabled
                                    >
                                        <option value="">-- Select Stone Shape --</option>
                                        {stoneShape?.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Gold Purity Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="goldPurityId" className="form-label">
                                        Select Gold Purity:
                                    </label>
                                    <select
                                        name="goldPurityId"
                                        id="goldPurityId"
                                        className="form-select"
                                        value={formData.goldPurityId || ""}
                                        disabled
                                    >
                                        <option value="">-- Select Gold Purity --</option>
                                        {goldPurity?.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Video Preview */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label className="form-label">Video:</label>
                                    {formData.video ? (
                                        <div className="mt-2 position-relative" style={{ width: "320px" }}>
                                            <video
                                                width="320"
                                                height="180"
                                                controls
                                                src={formData.video}
                                                className="rounded border"
                                            />
                                        </div>
                                    ) : (
                                        <input
                                            type="file"
                                            accept="video/mp4,video/webm,video/ogg"
                                            className="form-control"
                                            disabled
                                        />
                                    )}
                                </div>


                                {/* Boolean Fields */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label ms-3">Is this product a top seller?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="topSelling"
                                                value="1"
                                                checked={formData.topSelling === 1}
                                                disabled

                                            />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="topSelling"
                                                value="0"
                                                checked={formData.topSelling === 0}
                                                disabled
                                            />
                                            <label className="form-check-label">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label ms-3">Is this product currently discounted?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="discounted"
                                                value="1"
                                                checked={formData.discounted === 1}
                                                disabled
                                            />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="discounted"
                                                value="0"
                                                checked={formData.discounted === 0}
                                                disabled
                                            />
                                            <label className="form-check-label">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label ms-3">Is this product ready to ship immediately?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="readyToShip"
                                                value="1"
                                                checked={formData.readyToShip === 1}
                                                disabled
                                            />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="readyToShip"
                                                value="0"
                                                checked={formData.readyToShip === 0}
                                                disabled
                                            />
                                            <label className="form-check-label">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label ms-3">Is this product newArrival?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="newArrival"
                                                value="1"
                                                checked={formData.newArrival === 1}
                                                disabled
                                            />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="newArrival"
                                                value="0"
                                                checked={formData.newArrival === 0}
                                                disabled
                                            />
                                            <label className="form-check-label">No</label>
                                        </div>
                                    </div>
                                </div>


                                {/* Description */}
                                <div className="col-12 mb-2">
                                    <label htmlFor="description" className="form-label">Description :</label>
                                    <Editor
                                        value={formData.description || ""}
                                        readOnly
                                        style={{ height: '320px' }}
                                    />
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: "500px", objectFit: "contain" }}
                        />
                    ) : (
                        <span className="text-muted">No image selected</span>
                    )}
                </Modal.Body>
            </Modal>


        </>
    )
}

export default ProductsDetails
