import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../api/store";
import { Card, Header, Segment, Icon } from "semantic-ui-react";
import LoadingComponent from "../../components/LoadingComponent";

const MyBookingsPage = observer(() => {
  const { bookingStore } = useStore();

  useEffect(() => {
    bookingStore.loadMyBookings();
  }, [bookingStore]);

  if (bookingStore.loading) {
    return <LoadingComponent content="Loading my booking list..." />;
  }

  return (
    <div>
      <Header as="h2" className="mb-6">
        My Bookings
      </Header>

      {bookingStore.myBookings.length === 0 ? (
        <Segment placeholder>
          <Header icon>
            <Icon name="calendar times outline" />
            No bookings found
            <p>Go to Bookings page to create your first booking.</p>
          </Header>
        </Segment>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookingStore.myBookings.map((booking) => (
            <Card key={booking.id} color="blue" fluid>
              <Card.Content>
                <Card.Header>{booking.title}</Card.Header>
                <Card.Meta>
                  <strong>{booking.roomName}</strong> • {booking.bookingDate}
                </Card.Meta>
                <Card.Description>
                  <Icon name="clock" /> {booking.startTime} - {booking.endTime}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                Booked by: <strong>{booking.bookedBy}</strong>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
});

export default MyBookingsPage;
