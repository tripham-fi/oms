import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { useStore } from "../../api/store";
import { Button, Form, Header, Select, Message } from "semantic-ui-react";
import LoadingComponent from "../../components/LoadingComponent";
import { useSearchParams } from "react-router-dom";

const BookingPage = observer(() => {
  const { roomStore, bookingStore } = useStore();

  const [roomId, setRoomId] = useState<number | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roomIdFromUrl = searchParams.get("roomId");
    if (roomIdFromUrl) {
      setRoomId(parseInt(roomIdFromUrl));
    }
  }, [searchParams]);

  useEffect(() => {
    roomStore.loadRooms();
  }, [roomStore]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleSubmit = async () => {
    if (!roomId || !title || !bookingDate || !startTime || !endTime) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const result = await bookingStore.createBooking({
      roomId,
      title,
      bookingDate,
      startTime,
      endTime,
    });

    if (result.isSuccess) {
      setSuccessMessage("Booking created successfully!");
      setTitle("");
      setBookingDate("");
      setStartTime("");
      setEndTime("");
      setRoomId(undefined);
      bookingStore.loadMyBookings();
    } else {
      setErrorMessage(result.error || "Failed to create booking");
    }
    setLoading(false);
  };

  const roomOptions = roomStore.rooms.map((room) => ({
    key: room.id,
    text: `${room.name} (${room.location}) - Capacity: ${room.capacity}`,
    value: room.id,
  }));

  if (roomStore.loading) {
    return <LoadingComponent content="Loading available rooms..." />;
  }

  return (
    <div className="max-w-lg mx-auto">
      <Header as="h2" className="mb-6">
        Create New Booking
      </Header>

      {successMessage && <Message success content={successMessage} />}
      {errorMessage && <Message error content={errorMessage} />}

      <Form>
        <Form.Field>
          <label>Select Room</label>
          <Select
            placeholder="Choose a room"
            options={roomOptions}
            value={roomId}
            onChange={(_, data) => setRoomId(data.value as number | undefined)}
          />
        </Form.Field>

        <Form.Field>
          <label>Title / Purpose</label>
          <input
            type="text"
            placeholder="e.g. Team Meeting"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Field>

        <Form.Group widths="equal">
          <Form.Field>
            <label>Date</label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Field>
        </Form.Group>

        <Button
          color="red"
          onClick={handleSubmit}
          loading={loading}
          disabled={
            loading ||
            !roomId ||
            !title ||
            !bookingDate ||
            !startTime ||
            !endTime
          }
        >
          Create Booking
        </Button>
      </Form>
    </div>
  );
});

export default BookingPage;
