import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import left from "../../assets/Images/lefticon.png";
import { Editor } from 'primereact/editor';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
const initialState = {
    name: "",
    description: ""
}
const AddPolicy = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("description", formData.description);

            const res = await Axios.post(apiendpoints.addPolicy, form, authorizationHeaders()); // ✅ use `form` here

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                navigate("/admin/policy");
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
                                    Add Policies
                                </div>
                            </h2>
                        </div>

                        <form className="row g-3 gx-4"
                            onSubmit={handleSubmit} >

                            <div className=" col-12 mb-2">
                                <label htmlFor="name" className="form-label">
                                    Name :
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    placeholder="Enter name"
                                    autoComplete='off'
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 mb-2">
                                <label htmlFor="description" className="form-label">
                                    Description  :
                                </label>
                                <Editor value={formData.description}
                                    onTextChange={(e) => setFormData({ ...formData, description: e.htmlValue })} style={{ height: '320px' }} />
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

export default AddPolicy