import React from 'react';
import { Modal } from 'react-bootstrap';
import { loaders } from '../../loader/Loader';

const Logout = ({ show, handleClose, isLogoutLoading, handleLogout }) => {
    return (
        <Modal show={show} backdrop="static" centered>
            <div className="modal-header">
                <h5 className="modal-title mb-3" id="deleteModalLabel">
                    Logout
                </h5>
            </div>
            <div className="modal-body">
                <p className='mb-0'>
                    Are you sure you want to logout ?
                </p>

                <div className='mt-4 d-flex justify-content-end gap-2 modal-footer'>
                    <button type="button" className="delete-btn" onClick={handleClose}>
                        No
                    </button>
                    <button
                        type="button"
                        className={`close-btn ${isLogoutLoading ? 'btn-loading' : ''}`}
                        disabled={isLogoutLoading}
                        onClick={handleLogout}
                    >
                        {isLogoutLoading && loaders.small
                        }
                        {/* {isLogoutLoading ? 'Logging out...' : 'Logout'} */}
                        {isLogoutLoading ? '' : 'Yes'}
                    </button>

                </div>
            </div>
        </Modal>

       
    )
}

export default Logout;