import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import left from "../../assets/Images/lefticon.png";
import { Editor } from 'primereact/editor';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';


const initialState = {
    title: "",
    certificate: null,
    subTitle: ""
}

const AddCertificate = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            form.append("title", formData.title);
            form.append("certificate", formData.certificate);
            form.append("subTitle", formData.subTitle);

            const res = await Axios.post(apiendpoints.addCertificate, form, authorizationHeadersImage()); // ✅ use `form` here

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                navigate("/admin/certificate");
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
                                    Add Certificate
                                </div>
                            </h2>
                        </div>

                        <form className="row g-3 gx-4"
                            onSubmit={handleSubmit} >
                            <div className="col-12 mb-2">
                                <label htmlFor="certificate" className="form-label">
                                    Image :
                                </label>
                                <input
                                    type="file"
                                    name="certificate"
                                    id="certificate"
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                />
                                {formData.certificate && (
                                    <div className="mb-2 mt-2">
                                        <img
                                            src={URL.createObjectURL(formData?.certificate)}
                                            alt="Image"
                                            className="img-thumbnail img-fluid"
                                            style={{
                                                maxWidth: "120px", maxHeight: "120px"
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="col-lg-6 col-md-6 col-12 mb-2">
                                <label htmlFor="title" className="form-label">
                                    Title :
                                </label>
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

                            <div className="col-lg-6 col-md-6 col-12 mb-2">
                                <label htmlFor="subTitle" className="form-label">
                                    Sub Title :
                                </label>
                                <input
                                    type="text"
                                    name="subTitle"
                                    id="subTitle"
                                    className="form-control"
                                    placeholder="Enter Sub Title"
                                    autoComplete='off'
                                    value={formData.subTitle}
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

export default AddCertificate