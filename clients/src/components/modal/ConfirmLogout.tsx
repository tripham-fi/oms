import { observer } from "mobx-react-lite";
import { Button, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import { useStore } from "../../api/store";
import "./PopupModal.css";

const Logout = observer(() => {
  const { modalStore, accountStore } = useStore();
  const { logout } = accountStore;
  const handleLogout = () => {
    logout();
    modalStore.closeModal();
  };

  return (
    <div>
      <ModalHeader className="modal-header-popupModal" toggle={modalStore.closeModal}>Logout</ModalHeader>
      <ModalBody className="modal-body-popupModal">
        <Row>
          <Col md={12}>
            <p>Do you want to sign out?</p>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col md={6}>
            <Button color="danger" onClick={handleLogout} block>
              Logout
            </Button>{" "}
          </Col>

          <Col md={6}>
            <Button
              outline
              color="secondary"
              onClick={modalStore.closeModal}
              block
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </div>
  );
});

export default Logout;
