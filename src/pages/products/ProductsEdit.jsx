import { Editor } from 'primereact/editor';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import left from "../../assets/Images/lefticon.png";
import { loaders } from '../../componet/loader/Loader';
import { apiendpoints } from '../../componet/constants/apiroutes';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { toast } from 'react-toastify';

const initialState = {
    title: "",
    images: [],
    description: "",
    stockNumber: "",
    shortDescription: "",
    estimatedTime: "",
    original_price: "",
    selling_price: "",
    productMaterials: [{}],
    topSelling: "",
    discounted: "",
    readyToShip: "",
    newArrival: ""
};


const ProductsEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [editProducts, setEditProducts] = useState(location.state?.products || {});
    const [imageShow, setImageShow] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [subcategory, setSubcategory] = useState([]);
    const [metals, setmetals] = useState([]);
    const [stoneShape, setStoneShape] = useState([]);
    const [goldPurity, setGoldPurity] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");

    // Load product details
    useEffect(() => {
        let materials = [];

        if (editProducts?.productMaterials) {
            try {
                // If it's a string, parse it
                const parsed = typeof editProducts.productMaterials === "string"
                    ? JSON.parse(editProducts.productMaterials)
                    : editProducts.productMaterials;

                if (Array.isArray(parsed)) {
                    // Case: already array
                    materials = parsed.map(item => ({
                        key: item.key || item.name || "",
                        value: item.value || ""
                    }));
                } else if (typeof parsed === "object" && parsed !== null) {
                    // Case: object (convert to array of key-value pairs)
                    materials = Object.entries(parsed).map(([k, v]) => ({
                        key: k,
                        value: v
                    }));
                }
            } catch (err) {
                console.error("Error parsing productMaterials:", err);
                materials = [];
            }
        }

        setFormData({
            title: editProducts?.title || "",
            description: editProducts?.description || "",
            stockNumber: editProducts?.stockNumber || "",
            shortDescription: editProducts?.shortDescription || "",
            estimatedTime: editProducts?.estimatedTime || "",
            original_price: editProducts?.original_price || "",
            selling_price: editProducts?.selling_price || "",
            productMaterials: materials, // ✅ always flat array of { key, value }
            categoryId: editProducts?.categoryId || "",
            subCategoryId: editProducts?.subCategoryId || "",
            metalId: editProducts?.metalId || "",
            stoneShapeId: editProducts?.stoneShapeId || "",
            goldPurityId: editProducts?.goldPurityId || "",
            topSelling: editProducts?.topSelling === true || editProducts?.topSelling === 1 ? 1 : 0,
            discounted: editProducts?.discounted === true || editProducts?.discounted === 1 ? 1 : 0,
            readyToShip: editProducts?.readyToShip === true || editProducts?.readyToShip === 1 ? 1 : 0,
            newArrival: editProducts?.newArrival === true || editProducts?.newArrival === 1 ? 1 : 0,
            images: editProducts?.images || [],
            video: editProducts?.video || null,
        });

        // Images
        if (Array.isArray(editProducts?.images) && editProducts.images.length > 0) {
            const formattedImages = editProducts.images.map(img =>
                typeof img === "string" && img.startsWith("http")
                    ? img
                    : `${process.env.REACT_APP_BASE_URL}/uploads/${img}`
            );
            setImageShow(formattedImages);
        } else if (typeof editProducts?.images === "string") {
            const isFullUrl = editProducts.images.startsWith("http");
            setImageShow([
                isFullUrl
                    ? editProducts.images
                    : `${process.env.REACT_APP_BASE_URL}/uploads/${editProducts.images}`
            ]);
        } else {
            setImageShow([]);
        }

        // Video
        if (editProducts?.video) {
            const videoUrl =
                editProducts.video.startsWith("http")
                    ? editProducts.video
                    : `${process.env.REACT_APP_BASE_URL}/uploads/${editProducts.video}`;
            setVideoPreview(videoUrl);
        }
    }, [editProducts]);



    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setFormData((prev) => ({
                ...prev,
                video: file,  // save file in formData
            }));
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    // Remove video
    const handleRemoveVideo = () => {
        setVideoFile(null);
        setFormData((prev) => ({
            ...prev,
            video: null,
        }));
        setVideoPreview("");
    };

    // Remove image
    const handleRemoveImage = (index) => {
        setImageShow((prev) => prev.filter((_, i) => i !== index));
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // Update a specific key or value
    const handleMaterialChange = (index, field, value) => {
        setFormData((prev) => {
            const materials = [...prev.productMaterials];
            materials[index][field] = value;
            return { ...prev, productMaterials: materials };
        });
    };

    // Remove a material
    const removeMaterial = (index) => {
        setFormData((prev) => {
            const materials = [...prev.productMaterials];
            materials.splice(index, 1);
            return { ...prev, productMaterials: materials };
        });
    };

    // Add a new empty key-value pair
    const addMaterial = () => {
        setFormData((prev) => ({
            ...prev,
            productMaterials: [...prev.productMaterials, { key: "", value: "" }]
        }));
    };

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

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files.length > 0) {
            const newFiles = Array.from(files);

            setFormData((prev) => ({
                ...prev,
                [name]: [...(prev[name] || []), ...newFiles],
            }));

            const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
            setImageShow((prev) => [...prev, ...newPreviews]);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value.trimStart(),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Before submit:", formData);

        const requiredFields = [
            "title", "description", "stockNumber", "estimatedTime",
            "original_price", "selling_price", "productMaterials"
        ];

        // ✅ Required fields validation
        for (const field of requiredFields) {
            if (!formData[field] ||
                (Array.isArray(formData[field]) && formData[field].length === 0) ||
                (typeof formData[field] === "string" && formData[field].trim() === "")
            ) {
                toast.error(`${field.replace(/([A-Z])/g, " $1")} is required!`);
                return;
            }
        }

        // ✅ Product materials validation
        if (formData.productMaterials) {
            const validMaterials = formData.productMaterials.filter(
                (m) => m.key?.trim() && m.value?.trim()
            );
            if (validMaterials.length === 0) {
                toast.error("At least one valid product material (key & value) is required!");
                return;
            }
        }

        // ✅ Images validation
        if (!formData.images || formData.images.length < 2) {
            toast.error("At least two images are required!");
            return;
        }

        setLoading(true);
        try {
            const form = new FormData();

            Object.keys(formData).forEach((key) => {
                if (key === "images") {
                    formData.images.forEach((file) => form.append("images", file));
                } else if (key === "productMaterials") {
                    const materialsObj = formData.productMaterials
                        .filter((m) => m.key?.trim() && m.value?.trim())
                        .reduce((acc, m) => {
                            acc[m.key.trim()] = m.value.trim();
                            return acc;
                        }, {});
                    form.append("productMaterials", JSON.stringify(materialsObj));
                } else if (
                    ["topSelling", "discounted", "readyToShip", "newArrival"].includes(key)
                ) {
                    // Convert 1 → "true", 0 → "false"
                    form.append(key, formData[key] === 1 ? "true" : "false");
                } else {
                    form.append(key, formData[key]);
                }
            });





            if (videoFile) form.append("video", videoFile);

            const res = await Axios.post(
                apiendpoints.editProducts.replace(":id", editProducts.id),
                form,
                authorizationHeadersImage()
            );

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                navigate("/admin/products");
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 400) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false);
        }
    };


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
                                <div>Product Edit</div>
                            </h2>
                        </div>

                        {/* Loader */}
                        {loader ? (
                            <div className="d-flex justify-content-center align-items-center py-5 w-100">
                                <div className="spinner-border text-black" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <form className="row g-3" onSubmit={handleSubmit}>
                                {/* Images */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="images" className="form-label">
                                        Images :
                                    </label>
                                    <input
                                        type="file"
                                        name="images"
                                        id="images"
                                        className="form-control"
                                        onChange={handleChange}
                                        accept="image/jpeg,image/jpg,image/png,image/gif"
                                        multiple
                                    />

                                    {/* Show all images with close button */}
                                    {Array.isArray(imageShow) && imageShow.length > 0 && (
                                        <div className="mb-2 mt-2 d-flex flex-wrap gap-3">
                                            {imageShow.map((img, i) => (
                                                <div
                                                    key={i}
                                                    className="position-relative"
                                                    style={{ display: "inline-block" }}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`preview-${i}`}
                                                        className="img-thumbnail img-fluid"
                                                        style={{ maxWidth: "80px", width: '100%', height: "100%", maxHeight: "80px" }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(i)}
                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                        style={{
                                                            borderRadius: "50%",
                                                            width: "20px",
                                                            height: "20px",
                                                            padding: 0,
                                                            lineHeight: "15px",
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Stock Number */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="stockNumber " className="form-label">
                                        Stock Number :
                                    </label>
                                    <input
                                        type="text"
                                        name="stockNumber"
                                        id="stockNumber"
                                        className="form-control"
                                        placeholder="Enter stock number"
                                        autoComplete="off"
                                        value={formData.stockNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Short Description */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="shortDescription " className="form-label">
                                        Short Description :
                                    </label>
                                    <input
                                        type="text"
                                        name="shortDescription"
                                        id="shortDescription"
                                        className="form-control"
                                        placeholder="Enter Short Description"
                                        autoComplete="off"
                                        value={formData.shortDescription}
                                        onChange={handleChange}
                                        required
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
                                        value={formData.estimatedTime}
                                        onChange={handleChange}
                                        required
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
                                        value={formData.original_price}
                                        onChange={handleChange}
                                        required
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
                                        value={formData.selling_price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Product Materials */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label className="form-label">Product Materials :</label>
                                    {formData.productMaterials.map((item, index) => (
                                        <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                                            <input
                                                type="text"
                                                placeholder="Key"
                                                className="form-control"
                                                value={item.key}
                                                onChange={(e) => handleMaterialChange(index, "key", e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                className="form-control"
                                                value={item.value}
                                                onChange={(e) => handleMaterialChange(index, "value", e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => removeMaterial(index)}
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={addMaterial}
                                    >
                                        Add New
                                    </button>
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
                                        onChange={handleChange}
                                        required
                                        disabled
                                    >
                                        <option value="">-- Select Category --</option>
                                        {category?.map((item) => (
                                            <option key={item._id} value={item.id}>
                                                {item.name}
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
                                        onChange={handleChange}
                                        required
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
                                        onChange={handleChange}
                                        required
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
                                        onChange={handleChange}
                                        required
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
                                        onChange={handleChange}
                                        required
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

                                {/* Video Upload */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="video" className="form-label">
                                        Upload Video:
                                    </label>
                                    <input
                                        type="file"
                                        accept="video/mp4,video/webm,video/ogg"
                                        id="video"
                                        className="form-control"
                                        onChange={handleVideoChange}
                                    />

                                    {videoPreview && (
                                        <div className="mt-3 position-relative" style={{ width: "320px" }}>
                                            <video
                                                width="320"
                                                height="180"
                                                controls
                                                src={videoPreview}
                                                className="rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveVideo}
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                style={{
                                                    borderRadius: "50%",
                                                    width: "24px",
                                                    height: "24px",
                                                    padding: 0,
                                                    lineHeight: "20px",
                                                    textAlign: "center"
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Top Seller Boolean */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between">
                                    <label className="form-label">Is this product a top seller?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check align-items-start">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="topSelling"
                                                id="topSellingTrue"
                                                value="true"
                                                checked={formData.topSelling === 1}
                                                onChange={() =>
                                                    setFormData((prev) => ({ ...prev, topSelling: 1 }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="topSellingTrue">
                                                Yes
                                            </label>
                                        </div>

                                        <div className="form-check align-items-start">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="topSelling"
                                                id="topSellingFalse"
                                                value="false"
                                                checked={formData.topSelling === 0}
                                                onChange={() =>
                                                    setFormData((prev) => ({ ...prev, topSelling: 0 }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="topSellingFalse">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>


                                {/* discounted Boolean */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label ms-3">Is this product currently discounted?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="discounted"
                                                id="discountedTrue"
                                                value="true"
                                                checked={formData.discounted === 1}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, discounted: 1 }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="discountedTrue">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="discounted"
                                                id="discountedFalse"
                                                value="false"
                                                checked={formData.discounted === 0}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, discounted: 0 }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="discountedFalse">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* readyToShip Boolean */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label">Is this product ready to ship immediately?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="readyToShip"
                                                id="readyToShipTrue"
                                                value="true"
                                                checked={formData.readyToShip === 1}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, readyToShip: 1 }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="readyToShipTrue">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="readyToShip"
                                                id="readyToShipFalse"
                                                value="false"
                                                checked={formData.readyToShip === 0}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, readyToShip: 0 }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="readyToShipFalse">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* newArrival Boolean */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label ms-3">Is this product newArrival?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="newArrival"
                                                id="newArrival"
                                                value="true"
                                                checked={formData.newArrival === 1}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, newArrival: 1 }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="newArrivalTrue">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="newArrival"
                                                id="newArrivalFalse"
                                                value="false"
                                                checked={formData.newArrival === 0}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, newArrival: 0 }))
                                                }
                                            />
                                            <label className="form-check-label" htmlFor="newArrivalFalse">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>


                                {/* Description */}
                                <div className="col-12 mb-2">
                                    <label htmlFor="description" className="form-label">Description :</label>
                                    <Editor
                                        value={formData.description}
                                        onTextChange={(e) => setFormData({ ...formData, description: e.htmlValue })}
                                        style={{ height: '320px' }}
                                    />
                                </div>

                                {/* Submit */}
                                <div className="text-end">
                                    <button
                                        type="submit"
                                        className={`submit-btn ${loading ? 'btn-loading' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading && loaders.small}
                                        {loading ? 'Updating...' : 'Update'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductsEdit;
