import React from 'react';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';

const ConfirmModal = (props) => {
    const {classes, show, handleClose, saveStage, isMobile, stageType} = props;
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={show}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={show}>
                <div
                    className={classes.paper}
                    style={{width: isMobile ? '75%' : '40%'}}
                >
                    <button
                        style={{float: 'right', padding: '0 5px'}}
                        id="transition-modal-title"
                        onClick={handleClose}
                        className="btn btn-outline-primary"
                    >
                        X
                    </button>
                    <h5>{stageType === "pool" ? 'Are you sure to make changes in this stage because along with the stage changes new battles would be created on the TMS and old battles will be deleted. Later you can post these new battles over Topya. ' : "Are you sure to create duplicate battles over TopYa?"}</h5>
                    <div className="text-right">
                        <button
                            onClick={handleClose}
                            className="main-btn-cncel"
                            style={{width: '100px'}}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={e => saveStage(e, 'finish')}
                            className="main-btn"
                            style={{width: '100px', marginBottom: 0}}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Fade>
        </Modal>
    );
};

export default ConfirmModal;
