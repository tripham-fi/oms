import { observer } from "mobx-react-lite";
import { Button, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import { useStore } from "../../api/store";

type confirmDisableUserProp = {
  id: number;
};

const ConfirmDisableUser = observer(({ id }: confirmDisableUserProp) => {
  const { modalStore, userStore } = useStore();
  const { disableUser } = userStore;

  const handleLogout = () => {
    disableUser(id);
    modalStore.closeModal();
  };
  return (
    <div>
      <ModalHeader
        className="modal-header-popupModal"
        toggle={modalStore.closeModal}
      >
        Are you sure?
      </ModalHeader>
      <ModalBody className="modal-body-popupModal">
        <Row>
          <Col md={12}>
            <p>Do you want to disable this user?</p>
          </Col>
        </Row>
        <Row className="pt-3">
          <Col md={6}>
            <Button color="danger" onClick={handleLogout} block>
              Disable
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

export default ConfirmDisableUser;
