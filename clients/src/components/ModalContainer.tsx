import { observer } from "mobx-react-lite";
import { Modal } from "reactstrap";
import { useStore } from "../api/store";

const ModalContainer = observer(() => {
  const { modalStore } = useStore();

  return (
    <Modal
      size={modalStore.modal.size || undefined}
      backdrop={true}
      isOpen={modalStore.modal.open}
      fade={false}
      toggle={modalStore.closeModal}
    >
      {modalStore.modal.body}
    </Modal>
  );
});


export default ModalContainer;