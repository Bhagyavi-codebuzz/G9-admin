import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import left from "../../assets/Images/lefticon.png";
import { Editor } from 'primereact/editor';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
import { da } from 'date-fns/locale';

const initialState = {
    title: "",
    images: [],
    description: "",
    stockNumber: "",
    shortDescription: "",
    estimatedTime: "",
    // price:""
    original_price: "",
    selling_price: "",
    productMaterials: [],
    categoryId: '',
    subCategoryId: '',
    metalId: [],
    stoneShapeId: "",
    goldPurityId: [],
    discounted: 0,
    readyToShip: 0,
    topSelling: 0,
    newArrival: 0
};

const AddProducts = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [previews, setPreviews] = useState([]);
    const [category, setCategory] = useState([]);
    const [subcategory, setSubcategory] = useState([]);
    const [metals, setmetals] = useState([]);
    const [stoneShape, setStoneShape] = useState([]);
    const [goldPurity, setGoldPurity] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState("");
    const fileInputRef = useRef(null);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    // // ✅ remove one image
    // const removeImageAt = (index) => {
    //     setFormData((prev) => {
    //         const newImages = [...prev.blogImage];
    //         newImages.splice(index, 1);
    //         return { ...prev, blogImage: newImages };
    //     });

    //     setPreviews((prev) => {
    //         const newPreviews = [...prev];
    //         URL.revokeObjectURL(newPreviews[index]); // cleanup
    //         newPreviews.splice(index, 1);
    //         return newPreviews;
    //     });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "title", "description", "stockNumber", "estimatedTime",
            "original_price", "selling_price", "productMaterials",
            "categoryId", "subCategoryId", "metalId",
            "stoneShapeId", "goldPurityId", "shortDescription"
        ];

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
                (m) => m.name?.trim() && m.value?.trim()
            );

            if (validMaterials.length === 0) {
                toast.error("At least one valid product material (name & value) is required!");
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
                        .filter((m) => m.name?.trim() && m.value?.trim())
                        .reduce((acc, m) => {
                            acc[m.name.trim()] = m.value.trim();
                            return acc;
                        }, {});

                    form.append("productMaterials", JSON.stringify(materialsObj));
                } else {
                    form.append(key, formData[key]);
                }
            });

            if (videoFile) form.append("video", videoFile);

            const res = await Axios.post(
                apiendpoints.addProducts,
                form,
                authorizationHeadersImage()
            );

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                setPreviews([]);
                setVideoFile(null);
                setVideoPreview("");
                navigate("/admin/products");
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, files, value, type } = e.target;

        if (files) {
            // for multiple images
            if (name === "images") {
                const list = Array.from(files);
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ...list],
                }));
                const urls = list.map((f) => URL.createObjectURL(f));
                setPreviews((prev) => [...prev, ...urls]);

                // ✅ clear input value so same file can be re-added if removed
                e.target.value = "";
            }
        } else if (type === "radio") {
            setFormData((prev) => ({
                ...prev,
                [name]: value === "true",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value.trimStart(),
            }));
        }
    };


    useEffect(() => {
        return () => {
            previews.forEach((u) => URL.revokeObjectURL(u));
        };
    }, [previews]);

    // Update a specific name or value
    const handleMaterialChange = (index, field, value) => {
        setFormData(prev => {
            const materials = [...prev.productMaterials];
            materials[index][field] = value; // field is "name" or "value"
            return { ...prev, productMaterials: materials };
        });
    };



    // ✅ Remove image at index
    const handleRemoveImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));

        setPreviews((prev) => {
            const updatedPreviews = [...prev];
            URL.revokeObjectURL(updatedPreviews[index]); // cleanup memory
            updatedPreviews.splice(index, 1);
            return updatedPreviews;
        });

        // ✅ clear input value completely
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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
            productMaterials: [...prev.productMaterials, { name: "", value: "" }]
        }));
    };


    const handleInput = (e) => {
        const { name, value } = e.target;

        if (name === "metalId" || name === "goldPurityId") {
            setFormData((prev) => {
                // use the correct array dynamically
                const currentValues = prev[name] || [];

                // avoid duplicates
                if (currentValues.includes(value)) {
                    return prev;
                }

                return {
                    ...prev,
                    [name]: [...currentValues, value],
                };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
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
                console.log("metals", metals)
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

    const filteredSubcategories = subcategory.filter(
        itm => itm.categoryId === Number(formData?.categoryId)
    );

    const sortedGoldPurity = goldPurity
        ?.slice()
        .sort((a, b) => {
            const numA = parseInt(a.name.replace(/[^0-9]/g, ""), 10);
            const numB = parseInt(b.name.replace(/[^0-9]/g, ""), 10);
            return numA - numB;
        });



    useEffect(() => {
        fetchCategory();
        fetchSubCategory();
        fetchMetals();
        fetchStoneShape();
        fetchgoldPurity();
    }, [])

    return (
        <section className="categorylist-section product mt-4 mt-lg-4 mt-xl-5">
            <div className="edit-user">
                <div className="row">
                    <div className="d-flex align-items-center justify-content-between gap-3">
                        <h2 className="d-flex mb-0 title">
                            <div
                                className="pe-4"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(-1)}
                            >
                                <img src={left} alt="" style={{ height: '30px' }} />
                            </div>
                            <div>Add Product</div>
                        </h2>
                    </div>

                    <form className="row g-3 gx-4" onSubmit={handleSubmit}>

                        <p>1. Basic Product Information</p>

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
                                placeholder="Enter Stock Number"
                                autoComplete="off"
                                value={formData.stockNumber}
                                onChange={handleInput}
                                required
                            />
                        </div>

                        {/* Title */}
                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                            <label htmlFor="title" className="form-label">
                                Name :
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="form-control"
                                placeholder="Enter Name"
                                autoComplete="off"
                                value={formData.title}
                                onChange={handleInput}
                                required
                            />
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
                                onChange={handleInput}
                                required
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
                                onChange={handleInput}
                                disabled={filteredSubcategories.length === 0}
                                required
                            >
                                <option value="">-- Select Sub Category --</option>
                                {filteredSubcategories?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <p>2. Jewellery Specifications</p>

                        {/* metal select */}
                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                            <label htmlFor="metalId" className="form-label">
                                Select Metals:
                            </label>
                            <select
                                name="metalId"
                                id="metalId"
                                className="form-select"
                                onChange={handleInput}
                                required
                            >
                                <option >-- Select Metals --</option>
                                {metals?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                    </option>
                                ))}
                            </select>

                            {/* Show selected metals */}
                            {formData.metalId?.length > 0 && (
                                <div className="mt-2">
                                    {formData.metalId.map((id) => {
                                        const metalName = metals.find((m) => m.id.toString() === id)?.name;
                                        return (
                                            <span key={id} className="badge bg-primary p-2 fs-6 me-2">
                                                {metalName}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-white ms-2"
                                                    style={{ fontSize: '10px' }}
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            metalId: prev.metalId.filter((mid) => mid !== id),
                                                        }))
                                                    }
                                                ></button>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Gold Purity Select */}
                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                            <label htmlFor="goldPurityId" className="form-label">
                                Select Purity:
                            </label>
                            <select
                                name="goldPurityId"
                                id="goldPurityId"
                                className="form-select"
                                onChange={handleInput}   // no value binding, behaves like metals
                                required
                            >
                                <option value="">-- Select Purity --</option>
                                {sortedGoldPurity?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                    </option>
                                ))}
                            </select>

                            {/* Show selected goldPurity */}
                            {formData.goldPurityId?.length > 0 && (
                                <div className="mt-2">
                                    {formData.goldPurityId.map((id) => {
                                        const goldPurityName = goldPurity.find(
                                            (m) => m.id.toString() === id
                                        )?.name;
                                        return (
                                            <span
                                                key={id}
                                                className="badge bg-primary p-2 fs-6 me-2"
                                            >
                                                {goldPurityName}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-white ms-2"
                                                    style={{ fontSize: "10px" }}
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            goldPurityId: prev.goldPurityId.filter(
                                                                (mid) => mid !== id
                                                            ),
                                                        }))
                                                    }
                                                ></button>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
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
                                onChange={handleInput}
                                required
                            >
                                <option value="">-- Select Stone Shape --</option>
                                {stoneShape?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Diamond cut Select */}
                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                            <label htmlFor="stoneShapeId" className="form-label">
                                Select Diamond Cut:
                            </label>
                            <select
                                name="stoneShapeId"
                                id="stoneShapeId"
                                className="form-select"
                                value={formData.stoneShapeId || ""}
                                onChange={handleInput}
                                required
                            >
                                <option value="">-- Select Stone Shape --</option>

                                <option  >

                                </option>

                            </select>
                        </div>

                        <p>3. Pricing & Stock</p>
                        <div className="col-12 mb-2">
                            <label htmlFor="price" className="form-label">
                                Enter Price According to Purity:
                            </label>

                                {/* Show selected goldPurity with price input */}
                                {formData.goldPurityId?.length > 0 && (
                                    <div className="mt-2">
                                        {formData.goldPurityId.map((item) => {
                                            const goldPurityName = goldPurity.find(
                                                (m) => m.id.toString() === item.id
                                            )?.name;

                                            return (
                                                <div key={item.id} className="d-flex align-items-center mb-2">
                                                    <span className="badge bg-primary p-2 fs-6 me-2">
                                                        {goldPurityName}
                                                        <button
                                                            type="button"
                                                            className="btn-close btn-close-white ms-2"
                                                            style={{ fontSize: "10px" }}
                                                            onClick={() =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    goldPurityId: prev.goldPurityId.filter(
                                                                        (p) => p.id !== item.id
                                                                    ),
                                                                }))
                                                            }
                                                        ></button>
                                                    </span>

                                                    {/* Price input */}
                                                    <input
                                                        type="number"
                                                        className="form-control w-50 ms-2"
                                                        placeholder={`Enter price for ${goldPurityName}`}
                                                        value={item.price}
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                goldPurityId: prev.goldPurityId.map((p) =>
                                                                    p.id === item.id ? { ...p, price: e.target.value } : p
                                                                ),
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}



                        </div>



                        {/* Image Upload */}
                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                            <label htmlFor="image" className="form-label">
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
                                ref={fileInputRef}
                            />

                            {/* ✅ Show All Images Below */}
                            {previews.length > 0 && (
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="position-relative">
                                            <img
                                                src={src}
                                                alt={`Preview ${idx + 1}`}
                                                className="img-thumbnail img-fluid"
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                onClick={() => handleRemoveImage(idx)}
                                                style={{
                                                    borderRadius: "50%",
                                                    width: "20px",
                                                    height: "20px",
                                                    padding: 0,
                                                    lineHeight: "15px",
                                                    textAlign: "center"
                                                }}
                                                aria-label="Remove image"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                            <label htmlFor="shortDescription" className="form-label">
                                Short Description :
                            </label>
                            <input
                                type="text"
                                name="shortDescription"
                                id="shortDescription"
                                className="form-control"
                                placeholder="Enter Short Description "
                                autoComplete="off"
                                value={formData.shortDescription}
                                onChange={handleInput}
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
                                onChange={handleInput}
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
                                placeholder="Enter Original Price"
                                autoComplete="off"
                                value={formData.original_price}
                                onChange={handleInput}
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
                                placeholder="Enter Selling Price"
                                autoComplete="off"
                                value={formData.selling_price}
                                onChange={handleInput}
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
                                        placeholder="Name"
                                        className="form-control"
                                        value={item.name}
                                        onChange={(e) => handleMaterialChange(index, "name", e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value"
                                        className="form-control"
                                        value={item.value}
                                        onChange={(e) => handleMaterialChange(index, "value", e.target.value)}
                                    />
                                    <button type="button" className="btn btn-danger" onClick={() => removeMaterial(index)}>Clear</button>
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
                                <div className="mt-3">
                                    <video
                                        width="320"
                                        height="180"
                                        controls
                                        src={videoPreview}
                                        className="rounded border"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Top Seller Boolean */}
                        <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                            <label className="form-label">Is this product a top seller?</label>
                            <div className="d-flex gap-5">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="topSelling"
                                        id="topSellingTrue"
                                        value="1"
                                        checked={formData.topSelling === 1}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, topSelling: 1 }))
                                        }
                                    />
                                    <label className="form-check-label" htmlFor="topSellingTrue">
                                        Yes
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="topSelling"
                                        id="topSellingFalse"
                                        value="0"
                                        checked={formData.topSelling === 0}
                                        onChange={(e) =>
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
                                        value="1"
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
                                        value="0"
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
                                        value="1"
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
                                        value="0"
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
                                        id="newArrivalTrue"
                                        value="1"
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
                                        value="0"
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
                            <label htmlFor="description" className="form-label">
                                Description :
                            </label>
                            <Editor
                                value={formData.description}
                                onTextChange={(e) =>
                                    setFormData({ ...formData, description: e.htmlValue })
                                }
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
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddProducts;
