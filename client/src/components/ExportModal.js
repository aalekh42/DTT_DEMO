import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { deleteCollection, setFileName } from "../redux";

function ExportModal({showModal,deleteCollection,token,setFileName}) {
  const [show, setShow] = useState(showModal);
  const navigate = useNavigate();

  const handleYes = () => {
    setShow(false);
    navigate("/tabs", { replace: true });
  };
  const handleNo = () => {
    setShow(false);
    deleteCollection(token);
    setFileName("");
    navigate('/', { replace: true })
  };

  const handleShow = () => setShow(true);
  const handleClose=()=>setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Data transformation tool</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          If you want to visualize the updated table click on Yes or else No!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleYes}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleNo}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
    return {
      token:state.demo.token,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
        deleteCollection:(token)=>dispatch(deleteCollection(token)),
        setFileName:(filename)=>dispatch(setFileName(filename)),
    };
  };

export default connect(mapStateToProps,mapDispatchToProps)(ExportModal);
