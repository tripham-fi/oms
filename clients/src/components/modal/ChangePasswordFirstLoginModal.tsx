import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import * as Yup from "yup";
import { Button, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import { Label } from "semantic-ui-react";
import "./PopupModal.css";
import { useStore } from "../../api/store";

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
});

const ChangePasswordFirstLoginModal = observer(() => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const {
    accountStore: { resetPassword },
    modalStore,
  } = useStore();
  return (
    <>
      <ModalHeader className="modal-header-popupModal">
        Change Password
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            newPassword: "",
            error: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(value, { setSubmitting, setErrors }) =>
            resetPassword(value.newPassword)
              .then(() => modalStore.closeModal())
              .catch((err) => {
                setErrors({ error: err.message || "Failed to reset password" });
              })
              .finally(() => setSubmitting(false))
          }
        >
          {({ handleSubmit, isSubmitting, errors }) => (
            <Form onSubmit={handleSubmit} autoComplete="off">
              <ErrorMessage
                name="error"
                render={() => {
                  return (
                    <Label
                      style={{ marginBottom: 10 }}
                      basic
                      color="red"
                      content={errors.error}
                    />
                  );
                }}
              />
              <Row className="mb-2">
                <Label>This is the first time you logged in.</Label>
              </Row>
              <Row className="mb-2">
                <Label>You have to change your password to continue</Label>
              </Row>
              <Row id="newpwdField">
                <Col md={3} style={{ position: "relative" }} id="newpwdLabel">
                  <Label>New password</Label>
                </Col>
                <Col md={7} id="newpwd">
                  <Field
                    className="modal-input-popupModal"
                    type={passwordShown ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    placeholder="Enter new password"
                  />
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </Col>
                <Col md={1} style={{ position: "relative" }} id="newpwdIcon">
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={passwordShown ? faEyeSlash : faEye}
                    />
                  </span>
                </Col>
              </Row>
              <div style={{ height: "4rem", position: "relative" }}>
                <div style={{ right: "0", position: "absolute" }}>
                  <Button
                    className="modal-save-button-popupModal"
                    color="danger"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>{" "}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </>
  );
});

export default ChangePasswordFirstLoginModal;
