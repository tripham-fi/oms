import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../api/store";
import { Card, Header, Grid, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../components/LoadingComponent";

const RoomsPage = observer(() => {
  const { roomStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    roomStore.loadRooms();
  }, [roomStore]);

  const handleBookNow = (roomId: number) => {
    // Navigate to booking page with room pre-selected (we'll handle pre-select in next step)
    navigate(`/bookings?roomId=${roomId}`);
  };

  if (roomStore.loading) {
    return <LoadingComponent content="Loading available rooms..." />;
  }

  return (
    <div>
      <Header as="h2" className="mb-6">
        Available Rooms
      </Header>

      <Grid columns={3} stackable doubling>
        {roomStore.rooms.map((room) => (
          <Grid.Column key={room.id}>
            <Card color="blue" fluid>
              <Card.Content>
                <Card.Header>{room.name}</Card.Header>
                <Card.Meta>{room.location}</Card.Meta>
                <Card.Description>
                  Capacity: <strong>{room.capacity}</strong> people
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <span className="text-green-600 font-medium">● Available</span>
              </Card.Content>

              {/* Book Now Button */}
              <Card.Content extra textAlign="center">
                <Button
                  color="red"
                  onClick={() => handleBookNow(room.id)}
                  fluid
                >
                  Book Now
                </Button>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
});

export default RoomsPage;