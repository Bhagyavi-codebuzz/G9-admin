import { Editor } from 'primereact/editor';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import left from "../../assets/Images/lefticon.png";
import { toast } from 'react-toastify';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';

const initialState = {
    text: ""
}

const OfferbarEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [editofferbar, setEditofferbar] = useState(location.state?.offerbar || {});
    const [formData, setFormData] = useState(initialState);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({
            text: editofferbar?.text
        });

    }, [editofferbar]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value.trimStart(),
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const form = new FormData();
            form.append("text", formData.text);

            const res = await Axios.post(
                apiendpoints.editOfferbar.replace(":id", editofferbar.id),
                form,
                authorizationHeaders()
            );

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                navigate("/admin/offerbar");
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 400) {
                toast.error(err.response.data.message);
            }
        } finally {
            setLoading(false);
        }
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
                                    Offer Bar Edit
                                </div>
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
                            <form className="row g-3"
                                onSubmit={handleSubmit}>

                                <div className="col-12 mb-2">
                                    <label htmlFor="text" className="form-label">
                                        Title :
                                    </label>
                                    <input
                                        type="text"
                                        name="text"
                                        id="txet"
                                        className="form-control"
                                        placeholder="Enter Title"
                                        autoComplete='off'
                                        value={formData.text}
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
                                            'Updating...'
                                            :
                                            'Update'
                                        }
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default OfferbarEdit
