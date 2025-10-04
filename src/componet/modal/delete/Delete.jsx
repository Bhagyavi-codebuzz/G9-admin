
import React from 'react'
import { Modal } from 'react-bootstrap'
import { loaders } from '../../loader/Loader'

const Delete = ({ show, handleClose, isDeleteLoading, handleDelete, role }) => {
    return (
        <Modal show={show} centered>
            <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">
                    {`Delete ${role}`}
                </h5>
            </div>
            <div className="modal-body">
                <p>
                    {`Are you sure you want to delete this ${role.toLowerCase()}?`}
                </p>
            </div>
            <div className="modal-footer">
                <button type="button" className="delete-btn" onClick={handleClose}>
                    No
                </button>
                <button
                    type="button"
                    className={`close-btn ${isDeleteLoading ? 'btn-loading' : ''}`}
                    disabled={isDeleteLoading}
                    onClick={handleDelete}
                >
                    {isDeleteLoading && loaders.small}
                    {isDeleteLoading ?
                        ''
                        :
                        'Yes'
                    }
                </button>
            </div>
        </Modal>
    )
}

export default Delete