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
    metalsData: {},
    description: "",
    stockNumber: "",
    shortDescription: "",
    estimatedTime: "",
    price: [],
    original_price: "",
    selling_price: "",
    profit: "",
    gst: "",
    productMaterials: [],
    categoryId: '',
    subCategoryId: '',
    metalId: [],
    stoneShapeId: "",
    diamondCut: "",
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
    const [previewsByMetal, setPreviewsByMetal] = useState({});
    const [videoPreview, setVideoPreview] = useState("");
    const [activeGoldPurityId, setActiveGoldPurityId] = useState(null);
    const [activemetalId, setActivemetalId] = useState(null);

    const fileInputRef = useRef(null);

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file || !activemetalId) return;

        // ✅ Store file
        setFormData(prev => ({
            ...prev,
            metalsData: {
                ...prev.metalsData,
                [activemetalId]: {
                    ...(prev.metalsData[activemetalId] || {}),
                    video: file
                }
            }
        }));

        // ✅ Store preview
        setPreviewsByMetal(prev => ({
            ...prev,
            [activemetalId]: {
                ...(prev[activemetalId] || {}),
                videoPreview: URL.createObjectURL(file)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requiredFields = [
            "stockNumber", "estimatedTime",
            "categoryId", "subCategoryId", "metalId", "stoneShapeId", "goldPurityId",
            "selling_price", "profit", "gst", "diamondCut"
        ];

        // ✅ General required fields validation
        for (const field of requiredFields) {
            if (
                !formData[field] ||
                (Array.isArray(formData[field]) && formData[field].length === 0) ||
                (typeof formData[field] === "string" && formData[field].trim() === "")
            ) {
                toast.error(`${field.replace(/([A-Z])/g, " $1")} is required!`);
                return;
            }
        }

        // ✅ Gold Purity validation (at least one selected)
        if (!formData.goldPurityId || formData.goldPurityId.length === 0) {
            toast.error("At least one gold purity must be selected!");
            return;
        }

        if (formData.title) {
            const firstChar = formData.title.charAt(0);
            if (firstChar !== firstChar.toUpperCase()) {
                toast.error("Title must start with a capital letter!");
            }
        }


        // ✅ Gold Purity ID-wise field validation
        for (const id of formData.goldPurityId) {
            const sellingPrice = formData.selling_price?.[id];
            const profitValue = formData.profit?.[id];
            const gstValue = formData.gst?.[id];

            if (
                sellingPrice === "" || sellingPrice == null ||
                profitValue === "" || profitValue == null ||
                gstValue === "" || gstValue == null
            ) {
                toast.error(`Please fill all price, profit, and GST fields for gold purity ID: ${id}`);
                return;
            }
        }

        // ✅ Metal-wise image & video validation
        for (const metalId of formData.metalId) {
            const metalData = formData.metalsData?.[metalId];
            const metalName =
                metals.find(m => m.id.toString() === metalId.toString())?.name ||
                `Metal ID ${metalId}`;

            // ❌ No entry in metalsData
            if (!metalData) {
                toast.error(`Please upload images for ${metalName}`);
                return;
            }

            // ❌ No images
            if (!metalData.images || metalData.images.length === 0) {
                toast.error(`At least one image is required for ${metalName}`);
                return;
            }
            if (metalData.images.length > 5) {
                toast.error(`You can max 5 images add for ${metalName}`)
                return
            }

            console.log(metalData, "==-=-=- metalData ==-=")

            // ✅ Optional: If you want to enforce video per metal
            // if (metalData.video.length >1) {
            //     toast.error(`You can max one video add for ${metalName}`);
            //     return;
            // }
        }



        // ✅ Prepare FormData
        const form = new FormData();
        form.append("title", formData.title);
        form.append("estimatedTime", formData.estimatedTime);
        form.append("description", formData.description);
        form.append("stockNumber", formData.stockNumber);
        form.append("categoryId", formData.categoryId);
        form.append("subCategoryId", formData.subCategoryId);
        form.append("metals", JSON.stringify(formData.metalId));
        form.append("stoneShapeId", formData.stoneShapeId);
        form.append("shortDescription", formData.shortDescription);
        form.append("diamondCut", formData.diamondCut);
        form.append("discounted", formData.discounted);
        form.append("readyToShip", formData.readyToShip);
        form.append("topSelling", formData.topSelling);
        form.append("newArrival", formData.newArrival);

        const materialsObj = formData.productMaterials
            .filter(m => m.name?.trim() && m.value?.trim())
            .reduce((acc, m) => {
                acc[m.name.trim()] = m.value.trim();
                return acc;
            }, {});
        form.append("productMaterials", JSON.stringify(materialsObj));

        if (formData.purity?.length > 0) {
            form.append("purity", JSON.stringify(formData.purity));
        }

        setLoading(true);
        try {
            const res = await Axios.post(apiendpoints.addProducts, form, authorizationHeaders());

            if (res.data?.status) {
                // ✅ Upload metal media
                for (const metalId of Object.keys(formData.metalsData)) {
                    const metalData = formData.metalsData[metalId];
                    if (metalData?.images?.length > 0 || metalData?.video) {
                        const mediaForm = new FormData();
                        mediaForm.append("stockNumber", formData.stockNumber);
                        mediaForm.append("metalId", metalId);

                        if (metalData.images?.length > 0) {
                            metalData.images.forEach(img => mediaForm.append("images", img));
                        }
                        if (metalData.video) {
                            mediaForm.append("video", metalData.video);
                        }

                        try {
                            const mediaRes = await Axios.post(
                                apiendpoints.addProductMedia,
                                mediaForm,
                                {
                                    ...authorizationHeadersImage(),
                                    headers: { "Content-Type": "multipart/form-data" }
                                }
                            );

                            if (mediaRes.data?.status) {
                                navigate("/admin/products");
                                toast.success(mediaRes.data?.message);
                            } else {
                                toast.error(`Failed to upload media for metal ID ${metalId}: ${mediaRes.data?.message || 'Unknown error'}`);
                            }
                        } catch (mediaErr) {
                            console.error(`Error uploading media for metal ID ${metalId}:`, mediaErr.response?.data || mediaErr.message);
                            toast.error(`Failed to upload media for metal ID ${metalId}: ${mediaErr.response?.data?.message || 'Server error'}`);
                        }
                    }
                }

                setFormData(initialState);
                setPreviews([]);
                setVideoFile(null);
                setVideoPreview("");

            } else {
                toast.error(res.data?.message || "Failed to add product");
            }
        } catch (err) {
            console.error("Add product error:", err.response?.data || err.message);
            toast.error("Something went wrong while adding the product!");
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, files } = e.target;
        if (!activemetalId) return;

        if (files && name === "images") {
            const list = Array.from(files);

            setFormData(prev => ({
                ...prev,
                metalsData: {
                    ...prev.metalsData,
                    [activemetalId]: {
                        ...(prev.metalsData[activemetalId] || {}),
                        images: [
                            ...(prev.metalsData[activemetalId]?.images || []),
                            ...list
                        ]
                    }
                }
            }));

            // ✅ Store previews
            const urls = list.map(f => URL.createObjectURL(f));
            setPreviewsByMetal(prev => ({
                ...prev,
                [activemetalId]: {
                    ...(prev[activemetalId] || {}),
                    images: [
                        ...(prev[activemetalId]?.images || []),
                        ...urls
                    ]
                }
            }));

            e.target.value = ""; // reset file input
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
    const handleRemoveImage = (idx) => {
        if (!activemetalId) return;

        setFormData(prev => ({
            ...prev,
            metalsData: {
                ...prev.metalsData,
                [activemetalId]: {
                    ...prev.metalsData[activemetalId],
                    images: prev.metalsData[activemetalId].images.filter((_, i) => i !== idx)
                }
            }
        }));

        setPreviewsByMetal(prev => ({
            ...prev,
            [activemetalId]: {
                ...prev[activemetalId],
                images: prev[activemetalId].images.filter((_, i) => i !== idx)
            }
        }));
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
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            } else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        }
    }

    const fetchSubCategory = async () => {
        try {
            const res = await Axios.get(`${apiendpoints.subCategory}`, authorizationHeaders());
            if (res.data?.status) {
                setSubcategory(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            } else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        }
    }

    const fetchMetals = async () => {
        try {
            const res = await Axios.get(`${apiendpoints.metal}`, authorizationHeaders());
            if (res.data?.status) {
                setmetals(res.data?.data || []);
                console.log("metals", metals)
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            } else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        }
    }

    const fetchStoneShape = async () => {
        try {
            const res = await Axios.get(`${apiendpoints.StoneShape}`, authorizationHeaders());
            if (res.data?.status) {
                setStoneShape(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            } else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        }
    }

    const fetchgoldPurity = async () => {
        try {
            const res = await Axios.get(`${apiendpoints.goldPurity}`, authorizationHeaders());
            if (res.data?.status) {
                setGoldPurity(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            } else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
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

    useEffect(() => {
        if (!formData.goldPurityId?.length) return;

        const purityArray = formData.goldPurityId.map((id) => {
            const name = goldPurity.find((m) => m.id.toString() === id.toString())?.name || "";

            const originalPrice = parseFloat(formData.original_price?.[id] || 0);
            const selling = parseFloat(formData.selling_price?.[id] || 0);
            const profitValue = parseFloat(formData.profit?.[id] || 0);
            const gstValue = parseFloat(formData.gst?.[id] || 0);

            // Calculations
            const profitsellingAmount = (selling * profitValue) / 100;
            const profitoriginalAmount = (originalPrice * profitValue) / 100;
            const profitsellingprice = selling + profitsellingAmount;
            const profitoriginalprice = originalPrice + profitoriginalAmount;
            const totalProfitAmount = selling + profitsellingAmount;
            const gstAmount = (totalProfitAmount * gstValue) / 100;
            const finalTotal = totalProfitAmount + gstAmount;

            return {
                value: Number(id),
                name,
                original_price: originalPrice.toFixed(2) || 0,
                selling_price: selling.toFixed(2),
                profit: profitValue + "%",
                profitoriginalAmount: profitoriginalAmount.toFixed(2),
                profitsellingAmount: profitsellingAmount.toFixed(2),
                profitoriginalprice: profitoriginalprice.toFixed(2) || 0,
                profitsellingprice: profitsellingprice.toFixed(2),
                gst: gstValue + "%",
                gstAmount: gstAmount.toFixed(2),
                gstPrice: finalTotal.toFixed(2),
            };
        });

        setFormData(prev => ({
            ...prev,
            purity: purityArray
        }));

    }, [formData.goldPurityId, formData.original_price, formData.selling_price, formData.profit, formData.gst]);

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
                                Name (Optional) :
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

                        <p className='mt-5'>2. Jewellery Specifications</p>

                        {/* metal select */}
                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                            <label htmlFor="metalId" className="form-label">
                                Select Metals :
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
                                Select Purity :
                            </label>
                            <select
                                name="goldPurityId"
                                id="goldPurityId"
                                className="form-select"
                                onChange={handleInput}
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
                                Select Stone Shape :
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
                            <label htmlFor="diamondCut" className="form-label">
                                Select Diamond Cut :
                            </label>
                            <select
                                name="diamondCut"
                                id="diamondCut"
                                className="form-select"
                                value={formData.diamondCut || ""}
                                onChange={handleInput}
                                required
                            >
                                <option value="">-- Select Diamond Cut --</option>
                                <option value="excellent">
                                    Excellent
                                </option>
                                <option value="verygood">
                                    Very Good
                                </option>
                                <option value="good">
                                    Good
                                </option>
                            </select>
                        </div>

                        <p className='mt-5'>3. Pricing & Stock</p>
                        <div className="col-12 mb-2">
                            <label htmlFor="price" className="form-label">
                                Enter Price According to Purity :
                            </label>

                            {/* Show selected goldPurity with price input */}
                            {formData.goldPurityId?.length > 0 && (
                                <div className="mt-2">
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        {formData.goldPurityId.map((id) => {
                                            const goldPurityName =
                                                goldPurity.find((m) => m.id.toString() === id.toString())?.name || id;

                                            const isActive = activeGoldPurityId === id;

                                            return (
                                                <span
                                                    key={id}
                                                    className={`badge p-2 fs-6 ${isActive ? "bg-success" : "bg-primary"}`}
                                                    style={{ cursor: "pointer", minWidth: "50px", textAlign: "center" }}
                                                    onClick={() => setActiveGoldPurityId(isActive ? null : id)}
                                                >
                                                    {goldPurityName}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {/* Inputs for active tab, full screen width */}
                                    {activeGoldPurityId && (
                                        <div className="row">
                                            <div className="col-lg-3 col-md-6 col-12">
                                                <label className="form-label">Original Price (Optional) :</label>
                                                <input
                                                    type="text"
                                                    className="form-control mb-2"
                                                    placeholder={`Enter original price`}
                                                    value={formData.original_price?.[activeGoldPurityId] || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                original_price: { ...prev.original_price, [activeGoldPurityId]: value },
                                                            }))
                                                        }
                                                    }
                                                    }
                                                />
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-12">
                                                <label className="form-label">Selling Price :</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="form-control mb-2"
                                                    placeholder={`Enter selling price`}
                                                    value={formData.selling_price?.[activeGoldPurityId] || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                selling_price: { ...prev.selling_price, [activeGoldPurityId]: value },
                                                            }))
                                                        }
                                                    }
                                                    }
                                                />
                                            </div>
                                            <div className="col-lg-3 col-md-6 col-12">
                                                <label className="form-label">Profit Percentage :</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="form-control mb-2"
                                                    placeholder={`Enter profit percentage`}
                                                    value={formData.profit?.[activeGoldPurityId] || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;

                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                profit: { ...prev.profit, [activeGoldPurityId]: value },
                                                            }))
                                                        }
                                                    }
                                                    }
                                                />
                                            </div>
                                            <div className="col-lg-3">
                                                <label className="form-label">GST :</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="form-control mb-2"
                                                    placeholder="Enter GST"
                                                    value={formData.gst?.[activeGoldPurityId] || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Allow only digits (0–9)
                                                        if (/^\d*\.?\d*$/.test(value)) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                gst: { ...prev.gst, [activeGoldPurityId]: value },
                                                            }));
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {/* Totals for this active purity */}
                                            <div className="col-12 mt-3">
                                                {(() => {
                                                    const selling = parseFloat(formData.selling_price?.[activeGoldPurityId] || 0);
                                                    const profitPercent = parseFloat(formData.profit?.[activeGoldPurityId] || 0);
                                                    const gstPercent = parseFloat(formData.gst?.[activeGoldPurityId] || 0);

                                                    // Profit Amount = Selling * Profit %
                                                    const profitAmount = (selling * profitPercent) / 100;

                                                    // Total including profit
                                                    const totalProfitAmount = selling + profitAmount;

                                                    // GST Amount = Profit * GST %
                                                    const gstAmount = totalProfitAmount * (gstPercent / 100);

                                                    // Total Amount = Selling + Profit + GST
                                                    const finalTotal = totalProfitAmount + gstAmount;

                                                    return (
                                                        <>
                                                            <h5 className='d-flex justify-content-between mb-3'>
                                                                <strong>Profit Amount (Selling Price + Profit Margin) : </strong>
                                                                {totalProfitAmount.toFixed(2)}
                                                            </h5>

                                                            <h5 className='d-flex justify-content-between mb-4'>
                                                                <strong>Gst Amount (Profit Amount * GST) : </strong>
                                                                {gstAmount.toFixed(2)}
                                                            </h5>

                                                            <h5 className='d-flex justify-content-between mb-2'>
                                                                <strong>Total Amount (Profit Amount + GST) : </strong>
                                                                {finalTotal.toFixed(2)}
                                                            </h5>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className='mt-5'>4. Product Images & Media</p>

                        <div className="col-12 mb-2">
                            <label htmlFor="images" className="form-label">
                                Enter Image and Video According to Purity :
                            </label>

                            {/* Show selected goldPurity with price input */}
                            {formData.metalId?.length > 0 && (
                                <div className="mt-2">
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        {formData.metalId.map((id) => {
                                            const metalName =
                                                metals.find((m) => m.id.toString() === id.toString())?.name || id;

                                            const isActive = activemetalId === id;

                                            return (
                                                <span
                                                    key={id}
                                                    className={`badge p-2 fs-6 ${isActive ? "bg-success" : "bg-primary"}`}
                                                    style={{ cursor: "pointer", minWidth: "60px", textAlign: "center" }}
                                                    onClick={() => setActivemetalId(isActive ? null : id)}
                                                >
                                                    {metalName}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {/* Inputs for active tab, full screen width */}
                                    {activemetalId && (
                                        <div className="row">
                                            {/* Image Upload */}
                                            <div className="col-lg-6 col-md-6 col-12 mb-2">
                                                <label htmlFor="image" className="form-label">Images :</label>
                                                <input
                                                    type="file"
                                                    name="images"
                                                    id="images"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                                    multiple
                                                // required
                                                />

                                                {previewsByMetal[activemetalId]?.images?.length > 0 && (
                                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                                        {previewsByMetal[activemetalId].images.map((src, idx) => (
                                                            <div key={idx} className="position-relative">
                                                                <img
                                                                    src={src}
                                                                    alt={`Preview ${idx + 1}`}
                                                                    className="img-thumbnail img-fluid"
                                                                    style={{ width: 80, height: 80, objectFit: "cover" }}
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
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Video Upload */}
                                            <div className="col-lg-6 col-md-6 col-12 mb-2">
                                                <label htmlFor="video" className="form-label">Upload Video (Optional) :</label>
                                                <input
                                                    type="file"
                                                    accept="video/mp4,video/webm,video/ogg"
                                                    id="video"
                                                    className="form-control"
                                                    onChange={handleVideoChange}
                                                />

                                                {previewsByMetal[activemetalId]?.videoPreview && (
                                                    <div className="mt-3">
                                                        <video
                                                            width="320"
                                                            height="180"
                                                            controls
                                                            src={previewsByMetal[activemetalId].videoPreview}
                                                            className="rounded border"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <p className='mt-5'>5. Product Description & Details</p>
                        {/* Short Description */}
                        <div className="col-12 mb-2">
                            <label htmlFor="shortDescription" className="form-label">
                                Short Description (Optional) :
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
                            />
                        </div>

                        {/* Description */}
                        <div className="col-12 mb-2">
                            <label htmlFor="description" className="form-label">
                                Description (Optional) :
                            </label>
                            <Editor
                                value={formData.description}
                                onTextChange={(e) =>
                                    setFormData({ ...formData, description: e.htmlValue })
                                }
                                style={{ height: '320px' }}
                            />
                        </div>

                        {/* Product Materials */}
                        <div className="col-12 mb-2 d-flex flex-column">
                            <label className="form-label">Product Materials (Optional) :</label>
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

                            <div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={addMaterial}
                                >
                                    Add New
                                </button>
                            </div>
                        </div>

                        <p className='mt-5'>6. Product Description & Details</p>

                        {/* Estimated Time */}
                        <div className="col-12 mb-2">
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

                        {/* Submit */}
                        <div className="text-end mt-3">
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