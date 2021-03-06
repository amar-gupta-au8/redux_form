import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { Styles } from '../../Utils/Style';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { SignInUser, authState } from '../../redux/actionGenerator';
import CustomTextInput from '../../components/CustomTextInput';
// import Loader from '../../components/Loader';
import Spiner from '../../components/Spiner';
import { auth } from '../../firebase';
import { Redirect } from 'react-router-dom';

const Home = () => {
  const { user, isLoading } = useSelector(
    ({ user, isLoading, error }) => ({
      user: user,
      isLoading: isLoading,
      error: error,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const handleClick = (value) => {
    dispatch(SignInUser(value));
  };
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        dispatch(authState(user));
      }
    });
  }, [dispatch]);
  return user.displayName ? (
    <Redirect to='/home' />
  ) : !isLoading ? (
    <Styles>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string().email('Invalid Email').required('Required'),
          password: Yup.string()
            .required()
            .min(2, 'Seems a bit short...')
            .max(10, 'We prefer insecure system, try a shorter password.'),
        })}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          handleClick(values);
          resetForm();
          setSubmitting(false);
        }}
      >
        {(props) => (
          <Form>
            <h1>Login Form</h1>

            <CustomTextInput
              label='Email'
              name='email'
              type='email'
              placeholder='theamargupta.tech@gmail.com'
            />
            <CustomTextInput
              label='Password'
              name='password'
              type='password'
              placeholder='********'
            />
            <button type='submit'>
              {props.isSubmitting ? 'loading...' : 'submit'}
            </button>
            {/* <button>{isLoading ? 'loading...' : 'done'}</button> */}
            {/* {user.displayName && <button>{user.displayName}</button>} */}
          </Form>
        )}
      </Formik>
    </Styles>
  ) : (
    <Spiner />
  );
};

export default Home;
