import { observer } from "mobx-react-lite";
import { Button, ModalHeader, ModalBody, Row, Col } from "reactstrap";
import { Label } from "semantic-ui-react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useStore } from "../../api/store";
import "./PopupModal.css";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "First name is too short")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2, "Last name is too short")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  role: Yup.string().required("Role is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
});

const CreateUserModal = observer(() => {
  const { userStore, modalStore, accountStore } = useStore();
  const currentUserRole = accountStore.account?.role || "";
  const getAvailableRoles = () => {
    if (currentUserRole === "SUPER_ADMIN") {
      return [
        { value: "EMPLOYEE", label: "Employee" },
        { value: "ADMIN", label: "Admin" },
      ];
    } else if (currentUserRole === "ADMIN") {
      return [
        { value: "EMPLOYEE", label: "Employee" },
      ];
    }
    return [{ value: "EMPLOYEE", label: "Employee" }];
  };
  return (
    <>
      <ModalHeader className="modal-header-popupModal">
        Create New User
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            role: "EMPLOYEE",
            dob: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
            try {
              await userStore.create({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim(),
                role: values.role,
                dob: new Date(values.dob),
              });

              resetForm();
              modalStore.closeModal();
            } catch (err: unknown) {
              let errorMessage = "Failed to create user. Please try again.";

              if (err instanceof Error) {
                errorMessage = err.message;
              } else if (err && typeof err === "object" && "message" in err) {
                errorMessage = (err as { message: string }).message;
              }
              setErrors({
                email: errorMessage,
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, errors }) => (
            <Form autoComplete="off">
              {errors.email && (
                <Label
                  basic
                  color="red"
                  style={{ marginBottom: 15, display: "block" }}
                >
                  {errors.email}
                </Label>
              )}

              <Row className="mb-3">
                <Col md={6}>
                  <Label>First Name</Label>
                  <Field
                    className="modal-input-popupModal"
                    name="firstName"
                    placeholder="Enter first name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </Col>
                <Col md={6}>
                  <Label>Last Name</Label>
                  <Field
                    className="modal-input-popupModal"
                    name="lastName"
                    placeholder="Enter last name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <Label>Email Address</Label>
                  <Field
                    className="modal-input-popupModal"
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Label>Role</Label>
                  <Field
                    as="select"
                    name="role"
                    className="modal-input-popupModal"
                  >
                    {getAvailableRoles().map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </Field>
                </Col>
                <Col md={6}>
                  <Label>Date of Birth</Label>
                  <Field
                    className="modal-input-popupModal"
                    name="dob"
                    type="date"
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-danger small mt-1"
                  />
                </Col>
              </Row>

              <div style={{ textAlign: "right", marginTop: "30px" }}>
                <Button
                  color="secondary"
                  onClick={() => modalStore.closeModal()}
                  style={{ marginRight: "12px" }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button color="danger" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating User..." : "Create User"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </>
  );
});

export default CreateUserModal;
