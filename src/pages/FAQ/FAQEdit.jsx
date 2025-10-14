import { Editor } from 'primereact/editor';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import left from "../../assets/Images/lefticon.png";
import { toast } from 'react-toastify';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';

const initialState = {
    question: "",
    answer: ''

}
const FAQEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [editfaq, setEditFaq] = useState(location.state?.faq || {});
    const [formData, setFormData] = useState(initialState);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({
            question: editfaq?.question,
            answer: editfaq?.answer
        });
    }, [editfaq]);

    const handleChange = (e) => {
        const { name, value } = e.target;

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
            form.append("question", formData.question);
            form.append("answer", formData.answer);

            const res = await Axios.post(apiendpoints.editfaq.replace(":id", editfaq.id),
                form,
                authorizationHeaders()
            );

            if (res.data?.status) {
                toast.success(res.data?.mesage);
                setFormData(initialState);
                navigate("/admin/faq");
            } else {
                toast.error(res.data?.mesage);
            }
        } catch (err) {
            if (err.response?.status === 400) {
                toast.error(err.response.data.mesage);
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
                                    FAQ Edit
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

                                <div className=" col-12 mb-2">
                                    <label htmlFor="question" className="form-label">
                                        Question :
                                    </label>
                                    <input
                                        type="text"
                                        name="question"
                                        id="question"
                                        className="form-control"
                                        placeholder="Enter Question"
                                        autoComplete='off'
                                        value={formData.question}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-12 mb-2">
                                    <label htmlFor="description" className="form-label">
                                        Answer :
                                    </label>
                                    <Editor value={formData.answer}
                                        onTextChange={(e) => setFormData({ ...formData, answer: e.htmlValue })} style={{ height: '320px' }} />
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

export default FAQEdit
