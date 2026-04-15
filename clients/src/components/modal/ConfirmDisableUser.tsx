import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import { useStore } from "../../api/store";

type Props = {
  id: number;
};

const ConfirmDisableUser = observer(({ id }: Props) => {
  const { modalStore, userStore } = useStore();
  const [loading, setLoading] = useState(false);

  const handleDisable = async () => {
    setLoading(true);
    await userStore.disableUser(id);
    setLoading(false);
    modalStore.closeModal();
  };

  const handleCancel = () => {
    modalStore.closeModal();
  };

  return (
    <>
      <ModalHeader className="modal-header-popupModal" toggle={modalStore.closeModal}>
        Disable User
      </ModalHeader>
      <ModalBody className="modal-body-popupModal">
        <p style={{ fontSize: "16px", marginBottom: "25px" }}>
          Are you sure you want to disable this user?
        </p>

        <Row className="pt-3">
          <Col md={6}>
            <Button 
              color="danger" 
              onClick={handleDisable} 
              block 
              disabled={loading}
            >
              {loading ? "Disabling..." : "Yes, Disable User"}
            </Button>
          </Col>

          <Col md={6}>
            <Button
              outline
              color="secondary"
              onClick={handleCancel}
              block
              disabled={loading}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </>
  );
});

export default ConfirmDisableUser;