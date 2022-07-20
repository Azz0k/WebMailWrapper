import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalComponent = ({children, title , show, hide}) => {
    const [isChanged, setIsChanged] = useState(false);
    return(
            <Modal
                show={show}
                onHide={hide}
                backdrop="static"
                keyboard={false}
                >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Имя пользователя: {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" disabled={!isChanged}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={hide}>
                        {isChanged?"Cancel":"Close"}
                    </Button>
                </Modal.Footer>
            </Modal>

    );
};


export default ModalComponent;