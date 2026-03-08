import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Header,
  Icon,
  Message,
  Segment,
  Container,
} from "semantic-ui-react";
import type { loginRequest } from "../../constants/RequestType";
import { useStore } from "../../api/store";
import LoadingComponent from "../../components/LoadingComponent";
import { observer } from "mobx-react-lite";

const LoginPage = observer(() => {
  const {
    accountStore: {
      login,
      error: storeError,
      loadingInitial,
      appLoaded,
      isLoggedIn,
      setAccount,
      setAppLoaded
    },
  } = useStore();
  const [request, setRequest] = useState<loginRequest>({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token && !isLoggedIn && !loadingInitial) {
      setAccount();
    } else if(!token){
      setAppLoaded();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && appLoaded) {
      navigate("/");
    }
  }, [isLoggedIn, appLoaded, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(request);
    } catch {
      //
    }
  };

  if (loadingInitial || !appLoaded) {
    return <LoadingComponent content="Loading application..." />;
  }
  return (
    <Container text className="mt-5">
      <Segment raised padded="very">
        <Header as="h2" textAlign="center" color="blue">
          <Icon name="sign in alternate" />
          OMS Login
        </Header>

        <Form
          onSubmit={handleSubmit}
          loading={loadingInitial}
          error={!!storeError}
        >
          <Form.Input
            fluid
            icon="user"
            iconPosition="left"
            label={<label style={{ textAlign: "left" }}>Username</label>}
            placeholder="Enter your username"
            value={request.username}
            onChange={(e) =>
              setRequest((prev) => ({ ...prev, username: e.target.value }))
            }
            required
          />

          <Form.Input
            fluid
            icon={
              <Icon
                name={showPassword ? "eye slash" : "eye"}
                link
                onClick={() => setShowPassword(!showPassword)}
              />
            }
            iconPosition="left"
            label={<label style={{ textAlign: "left" }}>Password</label>}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={request?.password}
            onChange={(e) =>
              setRequest((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />

          {storeError && (
            <Message error header="Login Error" content={storeError} />
          )}

          <Button
            fluid
            primary
            size="large"
            type="submit"
            loading={loadingInitial}
            disabled={loadingInitial}
          >
            Login
          </Button>
        </Form>
      </Segment>
    </Container>
  );
})

export default LoginPage;
