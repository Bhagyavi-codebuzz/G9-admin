import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import left from "../../assets/Images/lefticon.png";
import { Editor } from 'primereact/editor';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';


const initialState = {
    name: "",
    category: ""
}

const AddSubCategory = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [categoryList, setcategoryList] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            form.append("categoryId", formData.category);
            form.append("name", formData.name);

            const res = await Axios.post(apiendpoints.adSubCategory, form, authorizationHeaders()); // ✅ use `form` here

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                navigate("/admin/subcategory");
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }

    }

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        let newValue = value
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : newValue.trimStart(),
        }));
    }

    const fetchcategorylist = async () => {
        setLoading(true);

        try {
            const res = await Axios.get(`${apiendpoints.category}`, authorizationHeaders());

            if (res.data?.status) {
                setcategoryList(res.data?.data || []);
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
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchcategorylist();
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
                                <div>
                                    Add Sub Category
                                </div>
                            </h2>
                        </div>

                        <form className="row g-3 gx-4"
                            onSubmit={handleSubmit} >

                            {/* category Select */}
                            <div className="col-lg-6 col-md-6 col-12 mb-2">
                                <label htmlFor="category" className="form-label">
                                    Select Category :
                                </label>
                                <select
                                    name="category"
                                    id="category"
                                    className="form-select"
                                    value={formData.category || ""}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Select Category --</option>
                                    {categoryList?.map((item) => (
                                        <option key={item._id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-lg-6 col-md-6 col-12 mb-2">
                                <label htmlFor="name" className="form-label">
                                   Sub Category Name :
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="tinametle"
                                    className="form-control"
                                    placeholder="Enter Sub Category Name"
                                    autoComplete='off'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>



                            <div className="text-end">
                                <button
                                    type="submit"
                                    className={`submit-btn ${loading ? 'btn-loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading && loaders.small}
                                    {loading ?
                                        'Submitting...'
                                        :
                                        'Submit'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddSubCategory
