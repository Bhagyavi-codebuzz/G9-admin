import { Editor } from 'primereact/editor';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import left from "../../assets/Images/lefticon.png";
import { toast } from 'react-toastify';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
const initialState = {
    title: "",
    description: '',
    image: null,
    redirectUrl:""

}

const MediaEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [editMedia, seteditMedia] = useState(location.state?.media || {});
    const [imageShow, setImageShow] = useState(editMedia.image);
    const [formData, setFormData] = useState(initialState);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({
            title: editMedia?.title,
            description: editMedia?.description,
            redirectUrl: editMedia?.redirectUrl
        });

        if (editMedia.image) {
            const isFullUrl = editMedia.image.startsWith("http");
            setImageShow(
                isFullUrl ? editMedia.image : `${process.env.REACT_APP_BASE_URL}/uploads/${editMedia.image}`
            );
        }

    }, [editMedia]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0],
            }));
            setImageShow(URL.createObjectURL(files[0])); // 👈 preview new image
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value.trimStart(),
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const form = new FormData();
            form.append("title", formData.title);
            form.append("image", formData.image);
            form.append("description", formData.description);
            form.append("redirectUrl", formData.redirectUrl);

            const res = await Axios.post(
                apiendpoints.editMedia.replace(":id", editMedia.id),
                form,
                authorizationHeadersImage()
            );

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                navigate("/admin/media");
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
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
                                    Media Edit
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
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="image" className="form-label">
                                        Image :
                                    </label>
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        className="form-control"
                                        onChange={handleChange}
                                        accept="image/jpeg,image/jpg,image/png,image/gif"
                                    />
                                    {imageShow && (
                                        <div className="mb-2 mt-2">
                                            <img
                                                src={imageShow}
                                                alt="Image"
                                                className="img-thumbnail img-fluid"
                                                style={{
                                                    maxWidth: "150px", maxHeight: "150px"
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

                                <div className="col-12 mb-2">
                                    <label htmlFor="redirectUrl" className="form-label">
                                        Redirect Url :
                                    </label>
                                    <input
                                        type="text"
                                        name="redirectUrl"
                                        id="redirectUrl"
                                        className="form-control"
                                        placeholder="Enter redirectUrl"
                                        autoComplete='off'
                                        value={formData.redirectUrl}
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

export default MediaEdit