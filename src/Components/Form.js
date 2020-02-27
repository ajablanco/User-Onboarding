import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import PasswordMask from "react-password-mask";

const UserForm = ({ values, errors, touched, status }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("status has changed", status);
    status && setUsers(users => [...users, status]);
  }, [status]);
  return (
    <div className="form">
      <Form>
        <h1>Sign Up</h1>
        <label htmlFor="name">
          Name
          <Field id="name" type="text" name="name" placeholder="Your name" />
          {touched.name && errors.name && (
            <p className="errors">{errors.name}</p>
          )}
        </label>
        <label htmlFor="email">
          Email
          <Field id="email" type="text" name="email" placeholder="Your email" />
          {touched.email && errors.email && (
            <p className="errors">{errors.email}</p>
          )}
        </label>
        <label htmlFor="password">
          Password
          <PasswordMask
            id="password"
            name="password"
            placeholder="Enter password"
          />
        </label>
        <label htmlFor="role">
          Role
          <Field as="select" className="food-select" name="role">
            <option>Select a Role</option>
            <option value="webdev">Web Developer</option>
            <option value="data">Data Scientist</option>
            <option value="ios">iOS Developer</option>
          </Field>
        </label>

        <div className="termsBox">
          <Field type="checkbox" name="terms" checked={values.terms} />
          <span className="checkmark" />
          <p>By checking this box, you agree to our Terms of Service.</p>
        </div>

        <button type="submit">Sign Up</button>
      </Form>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      <pre>{JSON.stringify(errors, null, 2)}</pre>
      {users.map(user => {
        return (
          <ul key={user.id}>
            <li>Name: {user.name}</li>
            <li>Email: {user.email}</li>
          </ul>
        );
      })}
    </div>
  );
};

const FormikUserForm = withFormik({
  mapPropsToValues(props) {
    return {
      name: props.name || "",
      email: props.email || "",
      password: props.password || "",
      role: props.role || "",
      terms: props.terms || false
    };
  },

  validationSchema: Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    email: Yup.string().required("Please enter your email")
  }),

  handleSubmit(values, { setStatus, resetForm }) {
    console.log("submitting", values);
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        console.log("success", res);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.log(err.response));
  }
})(UserForm);

export default FormikUserForm;
