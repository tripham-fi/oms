import { observer } from "mobx-react-lite";
import { Button, ModalHeader, ModalBody } from "reactstrap";
import { useStore } from "../../api/store";
import "./PopupModal.css";   // reuse your existing modal styles

interface Props {
  bookingId: number;
  bookingTitle: string;
}

const ConfirmDeleteBookingModal = observer(({ bookingId, bookingTitle }: Props) => {
  const { modalStore, bookingStore } = useStore();

  const handleConfirm = async () => {
    const result = await bookingStore.deleteBooking(bookingId);

    if (!result.isSuccess) {
      alert(result.error || "Failed to delete booking");   // temporary feedback
    }

    modalStore.closeModal();
  };

  const handleCancel = () => {
    modalStore.closeModal();
  };

  return (
    <>
      <ModalHeader className="modal-header-popupModal">
        Delete Booking
      </ModalHeader>
      <ModalBody>
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          Are you sure you want to delete this booking?
        </p>
        <p style={{ fontWeight: "bold", color: "#d32f2f" }}>
          "{bookingTitle}"
        </p>

        <div style={{ marginTop: "30px", textAlign: "right" }}>
          <Button
            color="secondary"
            onClick={handleCancel}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button color="danger" onClick={handleConfirm}>
            Yes, Delete Booking
          </Button>
        </div>
      </ModalBody>
    </>
  );
});

export default ConfirmDeleteBookingModal;