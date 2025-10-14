import React, { useState } from 'react'
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
import { loaders } from '../../componet/loader/Loader';
import { toast } from 'react-toastify';

const initialState = {
    deliveryCharge: "",
    InsuranceCharge: "",
    returnCharge: "",
    askPrice: ""
}

const Settings = () => {

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const form = new FormData();
            form.append("deliveryCharge", formData.deliveryCharge);
            form.append("InsuranceCharge", formData.InsuranceCharge);
            form.append("returnCharge", formData.returnCharge);
            form.append("askPrice", formData.askPrice);

            const res = await Axios.post(apiendpoints.settings, form, authorizationHeaders()); // ✅ use `form` here

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData({
                    deliveryCharge: "",
                    InsuranceCharge: "",
                    returnCharge: "",
                    askPrice: ""
                });
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }

    const handleInput = (e) => {
        const { name, value } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    return (
        <>
            <section className="categorylist-section mt-4 mt-lg-4 mt-xl-5 product">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <h3 className="mb-0 page-title">
                                        Settings
                                    </h3>
                                </div>
                            </div>

                            <div className="edit-user px-2">
                                <form className="row g-3 gx-4" onSubmit={handleSubmit}>
                                    <p className=''>1. Extra Charges</p>

                                    <div className="col-lg-6 col-md-6 col-12">
                                        <label htmlFor="deliveryCharge" className="form-label">
                                            Delivery Charge :
                                        </label>
                                        <input
                                            type="text"
                                            name="deliveryCharge"
                                            id="deliveryCharge"
                                            className="form-control"
                                            placeholder="Enter Delivery Charge"
                                            autoComplete="off"
                                            value={formData.deliveryCharge}
                                            onChange={handleInput}
                                        />
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-12">
                                        <label htmlFor="InsuranceCharge" className="form-label">
                                            Insurance Charge :
                                        </label>
                                        <input
                                            type="text"
                                            name="InsuranceCharge"
                                            id="InsuranceCharge"
                                            className="form-control"
                                            placeholder="Enter Insurance Charge"
                                            autoComplete="off"
                                            value={formData.InsuranceCharge}
                                            onChange={handleInput}
                                        />
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-12">
                                        <label htmlFor="returnCharge" className="form-label">
                                            Return Charge :
                                        </label>
                                        <input
                                            type="text"
                                            name="returnCharge"
                                            id="returnCharge"
                                            className="form-control"
                                            placeholder="Enter Return Charge"
                                            autoComplete="off"
                                            value={formData.returnCharge}
                                            onChange={handleInput}
                                        />
                                    </div>

                                    <p className='mt-4'>2. Ask to Price</p>

                                    <div className="col-lg-6 col-md-6 col-12">
                                        <label htmlFor="askPrice" className="form-label">
                                            Ask Price :
                                        </label>
                                        <input
                                            type="text"
                                            name="askPrice"
                                            id="askPrice"
                                            className="form-control"
                                            placeholder="Enter Ask Price"
                                            autoComplete="off"
                                            value={formData.askPrice}
                                            onChange={handleInput}
                                        />
                                    </div>

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
                    </div>
                </div>
            </section>
        </>
    )
}

export default Settings