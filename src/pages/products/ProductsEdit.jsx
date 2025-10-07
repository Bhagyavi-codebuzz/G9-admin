import { Editor } from 'primereact/editor';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import left from "../../assets/Images/lefticon.png";
import { loaders } from '../../componet/loader/Loader';
import { apiendpoints } from '../../componet/constants/apiroutes';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { toast } from 'react-toastify';

const initialState = {
    title: "",
    images: [],
    metalsData: {},
    description: "",
    stockNumber: "",
    shortDescription: "",
    estimatedTime: "",
    price: [],
    original_price: {},
    selling_price: {},
    profit: {},
    gst: {},
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

const ProductsEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [editProducts, setEditProducts] = useState(location.state?.products || {});
    const [formData, setFormData] = useState(initialState);
    console.log("🚀 ~ ProductsEdit ~ formData:", formData)
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [subcategory, setSubcategory] = useState([]);
    const [metals, setmetals] = useState([]);
    const [stoneShape, setStoneShape] = useState([]);
    const [goldPurity, setGoldPurity] = useState([]);
    const [previewsByMetal, setPreviewsByMetal] = useState({});
    const [activeGoldPurityId, setActiveGoldPurityId] = useState(null);
    const [activemetalId, setActivemetalId] = useState(null);
    const fileInputRef = useRef(null);

    // Load product details
    useEffect(() => {
        if (!editProducts?.id) return;

        // Parse metals from string to array
        let metalsArray = [];
        try {
            if (editProducts.metals) {
                metalsArray = typeof editProducts.metals === "string"
                    ? JSON.parse(editProducts.metals)
                    : editProducts.metals;
            }
        } catch (err) {
            console.error("Error parsing metals:", err);
            metalsArray = [];
        }

        // Parse product materials
        let materials = [];
        if (editProducts?.productMaterials) {
            try {
                const parsed = typeof editProducts.productMaterials === "string"
                    ? JSON.parse(editProducts.productMaterials)
                    : editProducts.productMaterials;

                if (Array.isArray(parsed)) {
                    materials = parsed.map(item => ({
                        name: item.name || item.key || "",
                        value: item.value || ""
                    }));
                } else if (typeof parsed === "object" && parsed !== null) {
                    materials = Object.entries(parsed).map(([k, v]) => ({
                        name: k,
                        value: v
                    }));
                }
            } catch (err) {
                console.error("Error parsing productMaterials:", err);
                materials = [];
            }
        }

        // Parse purity data and set price fields
        const purityData = editProducts.purity || [];
        const original_price = {};
        const selling_price = {};
        const profit = {};
        const gst = {};

        purityData.forEach(item => {
            if (item.value) {
                original_price[item.value] = item.original_price || "";
                selling_price[item.value] = item.selling_price || "";
                profit[item.value] = item.profit ? parseFloat(item.profit) : "";
                gst[item.value] = item.gst ? parseFloat(item.gst) : "";
            }
        });

        // Parse media data
        const metalsData = {};
        const previewsData = {};

        if (editProducts.media && Array.isArray(editProducts.media)) {
            editProducts.media.forEach(mediaItem => {
                if (mediaItem.id) {
                    const metalId = mediaItem.id.toString();

                    // Set images - mark them as existing (not new files)
                    if (mediaItem.images && Array.isArray(mediaItem.images)) {
                        metalsData[metalId] = {
                            ...metalsData[metalId],
                            images: mediaItem.images.map(img => ({
                                url: img,
                                isExisting: true // Mark as existing image
                            }))
                        };

                        previewsData[metalId] = {
                            ...previewsData[metalId],
                            images: mediaItem.images
                        };
                    }

                    // Set videos - mark as existing
                    if (mediaItem.videos && Array.isArray(mediaItem.videos) && mediaItem.videos.length > 0) {
                        metalsData[metalId] = {
                            ...metalsData[metalId],
                            video: {
                                url: mediaItem.videos[0],
                                isExisting: true
                            }
                        };

                        previewsData[metalId] = {
                            ...previewsData[metalId],
                            videoPreview: mediaItem.videos[0]
                        };
                    }
                }
            });
        }

        setFormData({
            title: editProducts?.title || "",
            description: editProducts?.description || "",
            stockNumber: editProducts?.stockNumber || "",
            shortDescription: editProducts?.shortDescription || "",
            estimatedTime: editProducts?.estimatedTime || "",
            original_price,
            selling_price,
            profit,
            gst,
            productMaterials: materials,
            categoryId: editProducts?.categoryId || "",
            subCategoryId: editProducts?.subCategoryId || "",
            metalId: metalsArray,
            stoneShapeId: editProducts?.stoneShapeId || "",
            diamondCut: editProducts?.diamondCut || "",
            goldPurityId: purityData.map(p => p.value?.toString()) || [],
            purity: purityData,
            topSelling: editProducts?.topSelling === true || editProducts?.topSelling === 1 ? 1 : 0,
            discounted: editProducts?.discounted === true || editProducts?.discounted === 1 ? 1 : 0,
            readyToShip: editProducts?.readyToShip === true || editProducts?.readyToShip === 1 ? 1 : 0,
            newArrival: editProducts?.newArrival === true || editProducts?.newArrival === 1 ? 1 : 0,
            metalsData
        });

        setPreviewsByMetal(previewsData);

    }, [editProducts]);

    // Handle video change for specific metal
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file || !activemetalId) return;

        setFormData(prev => ({
            ...prev,
            metalsData: {
                ...prev.metalsData,
                [activemetalId]: {
                    ...(prev.metalsData[activemetalId] || {}),
                    video: {
                        file,
                        isNew: true
                    }
                }
            }
        }));

        setPreviewsByMetal(prev => ({
            ...prev,
            [activemetalId]: {
                ...(prev[activemetalId] || {}),
                videoPreview: URL.createObjectURL(file)
            }
        }));
    };

    // Handle image change for specific metal
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
                            ...list.map(file => ({
                                file, // Store the file object
                                isNew: true // Mark as new file
                            }))
                        ]
                    }
                }
            }));

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

            e.target.value = "";
        }
    };

    const handleRemoveImage = async (idx) => {
        if (!activemetalId) return;

        const imageToRemove = previewsByMetal[activemetalId]?.images?.[idx];
        const metalData = formData.metalsData[activemetalId];
        const imageInFormData = metalData?.images?.[idx];

        // If it's an existing image (has URL), call delete API
        if (imageToRemove && typeof imageToRemove === 'string' && imageToRemove.startsWith('http')) {
            try {
                const imageName = imageToRemove.split('/').pop();
                const deleteRes = await Axios.delete(apiendpoints.deleteProductMedia, {
                    data: {
                        productId: editProducts.id,
                        metalId: activemetalId,
                        fileName: imageName,
                        type:'image'
                    },
                    ...authorizationHeaders()
                });

                if (deleteRes.data?.status) {
                    toast.success("Image deleted successfully");
                } else {
                    toast.error("Failed to delete image");
                    return; // Don't remove from state if API fails
                }
            } catch (err) {
                console.error("Error deleting image:", err);
                toast.error("Error deleting image");
                return;
            }
        }

        // Remove from form data
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

        // Remove from previews
        setPreviewsByMetal(prev => ({
            ...prev,
            [activemetalId]: {
                ...prev[activemetalId],
                images: prev[activemetalId].images.filter((_, i) => i !== idx)
            }
        }));
    };

    const handleRemoveVideo = async () => {
        if (!activemetalId) return;

        const videoToRemove = previewsByMetal[activemetalId]?.videoPreview;

        // If it's an existing video (has URL), call delete API
        if (videoToRemove && typeof videoToRemove === 'string' && videoToRemove.startsWith('http')) {
            try {
                const videoName = videoToRemove.split('/').pop();
                const deleteRes = await Axios.delete(apiendpoints.deleteProductMedia, {
                    data: {
                        productId: editProducts.id,
                        metalId: activemetalId,
                        fileName: videoName,
                        type:'video'
                    },
                    ...authorizationHeaders()
                });

                if (deleteRes.data?.status) {
                    toast.success("Video deleted successfully");
                } else {
                    toast.error("Failed to delete video");
                    return;
                }
            } catch (err) {
                console.error("Error deleting video:", err);
                toast.error("Error deleting video");
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            metalsData: {
                ...prev.metalsData,
                [activemetalId]: {
                    ...prev.metalsData[activemetalId],
                    video: null
                }
            }
        }));

        setPreviewsByMetal(prev => ({
            ...prev,
            [activemetalId]: {
                ...prev[activemetalId],
                videoPreview: ""
            }
        }));
    };

    // Update product materials
    const handleMaterialChange = (index, field, value) => {
        setFormData(prev => {
            const materials = [...prev.productMaterials];
            materials[index][field] = value;
            return { ...prev, productMaterials: materials };
        });
    };

    const removeMaterial = (index) => {
        setFormData((prev) => {
            const materials = [...prev.productMaterials];
            materials.splice(index, 1);
            return { ...prev, productMaterials: materials };
        });
    };

    const addMaterial = () => {
        setFormData((prev) => ({
            ...prev,
            productMaterials: [...prev.productMaterials, { name: "", value: "" }]
        }));
    };

    // Handle input changes
    const handleInput = (e) => {
        const { name, value } = e.target;

        if (name === "metalId" || name === "goldPurityId") {
            setFormData((prev) => {
                const currentValues = prev[name] || [];
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

    // Fetch dropdown data
    const fetchCategory = async () => {
        try {
            const res = await Axios.get(apiendpoints.category, authorizationHeaders());
            if (res.data?.status) {
                setCategory(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
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
            console.error("Error fetching subcategories:", err);
        }
    }

    const fetchMetals = async () => {
        try {
            const res = await Axios.get(`${apiendpoints.metal}`, authorizationHeaders());
            if (res.data?.status) {
                setmetals(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error("Error fetching metals:", err);
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
            console.error("Error fetching stone shapes:", err);
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
            console.error("Error fetching gold purity:", err);
        }
    }

    useEffect(() => {
        fetchCategory();
        fetchSubCategory();
        fetchMetals();
        fetchStoneShape();
        fetchgoldPurity();
    }, []);

    // Update purity calculations when dependencies change
    // Update the useEffect that calculates purity
    useEffect(() => {
        if (!formData.goldPurityId?.length || !goldPurity.length) return;

        const purityArray = formData.goldPurityId.map((id) => {
            // Find the gold purity name - ensure we're comparing the same types
            const goldPurityItem = goldPurity.find((m) =>
                m.id.toString() === id.toString() ||
                m.id === Number(id)
            );
            const name = goldPurityItem?.name || "";

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
                name, // This will now have the proper name
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

    }, [formData.goldPurityId, formData.original_price, formData.selling_price, formData.profit, formData.gst, goldPurity]);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Before submit:", formData);

        const requiredFields = [
            "title", "stockNumber", "estimatedTime",
            "categoryId", "subCategoryId", "metalId", "stoneShapeId", "goldPurityId",
            "selling_price",
            "profit",
            "gst",
            "diamondCut"
        ];

        // Validation
        for (const field of requiredFields) {
            if (!formData[field] ||
                (Array.isArray(formData[field]) && formData[field].length === 0) ||
                (typeof formData[field] === "string" && formData[field].trim() === "")
            ) {
                toast.error(`${field.replace(/([A-Z])/g, " $1")} is required!`);
                return;
            }
        }

        // if (formData.productMaterials) {
        //     const validMaterials = formData.productMaterials.filter(
        //         (m) => m.name?.trim() && m.value?.trim()
        //     );
        //     if (validMaterials.length === 0) {
        //         toast.error("At least one valid product material (name & value) is required!");
        //         return;
        //     }
        // }

        // Gold purity validation
        if (!formData.goldPurityId || formData.goldPurityId.length === 0) {
            toast.error("At least one gold purity must be selected!");
            return;
        }

        setLoading(true);
        try {
            const form = new FormData();

            // Append simple fields
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
            form.append("discounted", formData.discounted === 1 ? "true" : "false");
            form.append("readyToShip", formData.readyToShip === 1 ? "true" : "false");
            form.append("topSelling", formData.topSelling === 1 ? "true" : "false");
            form.append("newArrival", formData.newArrival === 1 ? "true" : "false");

            // Append product materials
            const materialsObj = formData.productMaterials
                .filter(m => m.name?.trim() && m.value?.trim())
                .reduce((acc, m) => {
                    acc[m.name.trim()] = m.value.trim();
                    return acc;
                }, {});
            form.append("productMaterials", JSON.stringify(materialsObj));

            // ✅ Gold purity validation
            if (!formData.goldPurityId || formData.goldPurityId.length === 0) {
                toast.error("At least one gold purity must be selected!");
                return;
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

            // Append purity array
            if (formData.purity && formData.purity.length > 0) {
                form.append("purity", JSON.stringify(formData.purity));
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

                // ✅ Optional: If you want to enforce video per metal
                // if (metalData.video.length > 1) {
                //     toast.error(`You can max one video add for ${metalName}`);
                //     return;
                // }
            }

            const res = await Axios.post(
                apiendpoints.editProducts.replace(":id", editProducts.id),
                form,
                authorizationHeadersImage()
            );

            if (res.data?.status) {
                toast.success(res.data?.message);

                // Update media for each metal ONLY if there are new files
                for (const metalId of Object.keys(formData.metalsData)) {
                    const metalData = formData.metalsData[metalId];

                    // Check if there are any new files (images or video)
                    const hasNewImages = metalData?.images?.some(img => img.isNew);
                    const hasNewVideo = metalData?.video?.isNew;

                    if (hasNewImages || hasNewVideo) {
                        const mediaForm = new FormData();
                        mediaForm.append("stockNumber", formData.stockNumber);
                        mediaForm.append("metalId", metalId);

                        // Append only NEW images (File objects)
                        if (metalData.images?.length > 0) {
                            metalData.images.forEach((image) => {
                                if (image.isNew && image.file) {
                                    mediaForm.append("images", image.file);
                                }
                            });
                        }

                        // Append only NEW video (File object)
                        if (metalData.video?.isNew && metalData.video.file) {
                            mediaForm.append("video", metalData.video.file);
                        }

                        // Only call API if there are actual files to upload
                        if (mediaForm.has('images') || mediaForm.has('video')) {
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
                                    toast.success(`Media updated for metal ID ${metalId}`);
                                } else {
                                    toast.error(`Failed to update media for metal ID ${metalId}`);
                                }
                            } catch (mediaErr) {
                                console.error(`Error updating media for metal ID ${metalId}:`, mediaErr);
                            }
                        }
                    }
                }

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
            <section className="categorylist-section product mt-4 mt-lg-4 mt-xl-5">
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

                        {loader ? (
                            <div className="d-flex justify-content-center align-items-center py-5 w-100">
                                <div className="spinner-border text-black" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
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
                                        onChange={handleInput}
                                        disabled

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
                                        Select Metals:
                                    </label>
                                    <select
                                        name="metalId"
                                        id="metalId"
                                        className="form-select"
                                        onChange={handleInput}
                                    // required
                                    >
                                        <option>-- Select Metals --</option>
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
                                        onChange={handleInput}
                                    // required
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

                                {/* Diamond cut Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="diamondCut" className="form-label">
                                        Select Diamond Cut:
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
                                        <option value="excellent">Excellent</option>
                                        <option value="verygood">Very Good</option>
                                        <option value="good">Good</option>
                                    </select>
                                </div>

                                <p className='mt-5'>3. Pricing & Stock</p>
                                <div className="col-12 mb-2">
                                    <label htmlFor="price" className="form-label">
                                        Enter Price According to Purity:
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
                                                        <label className="form-label">Original Price</label>
                                                        <input
                                                            type="text"
                                                            className="form-control mb-2"
                                                            placeholder={`Enter original price`}
                                                            value={formData.original_price?.[activeGoldPurityId] || ""}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    original_price: { ...prev.original_price, [activeGoldPurityId]: e.target.value },
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <label className="form-label">Selling Price</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="form-control mb-2"
                                                            placeholder={`Enter selling price`}
                                                            value={formData.selling_price?.[activeGoldPurityId] || ""}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    selling_price: { ...prev.selling_price, [activeGoldPurityId]: e.target.value },
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <label className="form-label">Profit Percentage</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="form-control mb-2"
                                                            placeholder={`Enter profit percentage`}
                                                            value={formData.profit?.[activeGoldPurityId] || ""}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    profit: { ...prev.profit, [activeGoldPurityId]: e.target.value },
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-lg-3">
                                                        <label className="form-label">GST</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="form-control mb-2"
                                                            placeholder={`Enter GST`}
                                                            value={formData.gst?.[activeGoldPurityId] || ""}
                                                            onChange={(e) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    gst: { ...prev.gst, [activeGoldPurityId]: e.target.value },
                                                                }))
                                                            }
                                                        />
                                                    </div>

                                                    {/* Totals for this active purity */}
                                                    <div className="col-12 mt-3">
                                                        {(() => {
                                                            const selling = parseFloat(formData.selling_price?.[activeGoldPurityId] || 0);
                                                            const profitPercent = parseFloat(formData.profit?.[activeGoldPurityId] || 0);
                                                            const gstPercent = parseFloat(formData.gst?.[activeGoldPurityId] || 0);

                                                            const profitAmount = (selling * profitPercent) / 100;
                                                            const totalProfitAmount = selling + profitAmount;
                                                            const gstAmount = totalProfitAmount * (gstPercent / 100);
                                                            const finalTotal = totalProfitAmount + gstAmount;

                                                            return (
                                                                <>
                                                                    <h5 className='d-flex justify-content-between mb-3'>
                                                                        <strong>Profit Amount (Selling Price + Profit Margin): </strong>
                                                                        {totalProfitAmount.toFixed(2)}
                                                                    </h5>

                                                                    <h5 className='d-flex justify-content-between mb-4'>
                                                                        <strong>Gst Amount (Profit Amount * GST): </strong>
                                                                        {gstAmount.toFixed(2)}
                                                                    </h5>

                                                                    <h5 className='d-flex justify-content-between mb-2'>
                                                                        <strong>Total Amount (Profit Amount + GST): </strong>
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
                                        Enter Image and Video According to Metal:
                                    </label>

                                    {/* Show selected metals with media input */}
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
                                                            // required
                                                            multiple
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
                                                        <label htmlFor="video" className="form-label">Upload Video:</label>
                                                        <input
                                                            type="file"
                                                            accept="video/mp4,video/webm,video/ogg"
                                                            id="video"
                                                            className="form-control"
                                                            onChange={handleVideoChange}
                                                        />

                                                        {previewsByMetal[activemetalId]?.videoPreview && (
                                                            <div className="mt-3 position-relative" style={{ width: "320px" }}>
                                                                <video
                                                                    width="320"
                                                                    height="180"
                                                                    controls
                                                                    src={previewsByMetal[activemetalId].videoPreview}
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
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <p className='mt-5'>5. Product Description & Details</p>
                                {/* Short Description */}
                                <div className="col-12 mb-2">
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

                                {/* Description */}
                                <div className="col-12 mb-2">
                                    <label htmlFor="description" className="form-label">
                                        Description :
                                    </label>
                                    <Editor
                                        value={formData.description}
                                        onTextChange={(e) => setFormData({ ...formData, description: e.htmlValue })}
                                        style={{ height: '320px' }}
                                    />
                                </div>

                                {/* Product Materials */}
                                <div className="col-12 mb-2 d-flex flex-column">
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

                                <p className='mt-5'>6. Additional Information</p>

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