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
  currentPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Current password is required"),
});

const ChangePasswordModal = observer(() => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [currentShown, setCurrentShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const toggleCurrentPasswordVisibility = () => {
    setCurrentShown(currentShown ? false : true);
  };

  const {
    accountStore: { changePassword },
    modalStore
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
            currentPassword: "",
            error: null,
          }}
          validationSchema={validationSchema}
          onSubmit={(value, { setSubmitting, setErrors }) =>
            changePassword({
              currentPassword: value.currentPassword,
              newPassword: value.newPassword,
            })
              .then(() => modalStore.closeModal())
              .catch((err) =>
                setErrors({
                  error: err.message || "Failed to change password",
                }),
              )
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
              <Row id="currentpwdField">
                <Col
                  md={3}
                  style={{ position: "relative" }}
                  id="currentpwdLabel"
                >
                  <Label>Current password</Label>
                </Col>
                <Col md={7} id="currentpwd">
                  <Field
                    className="modal-input-popupModal"
                    type={currentShown ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    placeholder="Enter current password"
                  />
                  <ErrorMessage
                    name="currentPassword"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </Col>
                <Col
                  md={1}
                  style={{ position: "relative" }}
                  id="currentpwdIcon"
                >
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={toggleCurrentPasswordVisibility}
                  >
                    <FontAwesomeIcon icon={currentShown ? faEyeSlash : faEye} />
                  </span>
                </Col>
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

export default ChangePasswordModal;
