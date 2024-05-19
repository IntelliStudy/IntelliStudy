// import { ChangeEvent, useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../App';
// import {
//   getCurrentlySignedInUserHandler,
//   googleLoginHandler,
//   loginHandler,
//   signUpHandler,
// } from '../firebase/auth';

// const LoginForm = () => {
//   const [create, setCreate] = useState(true);
//   const [email, setEmail] = useState('');
//   const [fName, setfName] = useState('');
//   const [lName, setlName] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const { currentUser, setCurrentUser } = useContext(UserContext);

//   const handlefNameChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setfName(event.target.value);
//   };

//   const handlelNameChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setlName(event.target.value);
//   };

//   const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setEmail(event.target.value);
//   };

//   const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setPassword(event.target.value);
//   };

//   // Sign up with email and password
//   const handleSignup = () => {
//     console.log('Signing up with:', email, password, fName, lName);

//     signUpHandler(email, password, fName, lName, () => {
//       navigate('/studyspot');
//     }).then(() => {
//       setCurrentUser(getCurrentlySignedInUserHandler);
//     });
//   };

//   // Login with email and password
//   const handleLogin = () => {
//     console.log('Logging in with:', email, password);

//     loginHandler(email, password, () => {
//       navigate('/studyspot');
//     }).then(() => {
//       setCurrentUser(getCurrentlySignedInUserHandler);
//     });
//   };

//   // Sign up or login using Google account
//   const handleGoogleLogin = () => {
//     console.log('Signing up / logging in with Google');

//     googleLoginHandler(() => {
//       navigate('/studyspot');
//     }).then(() => {
//       setCurrentUser(getCurrentlySignedInUserHandler);
//     });
//   };

//   return (
//     <>
//       <div>
//         <h2>Signup/Login Form</h2>
//         {create && (
//           <>
//             <div>
//               <label>First Name:</label>
//               <input type="text" value={fName} onChange={handlefNameChange} />
//             </div>
//             <br />
//             <div>
//               <label>Last Name:</label>
//               <input type="text" value={lName} onChange={handlelNameChange} />
//             </div>
//           </>
//         )}
//         <br />
//         <div>
//           <label>Email:</label>
//           <input type="email" value={email} onChange={handleEmailChange} />
//         </div>
//         <br />
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={handlePasswordChange}
//           />
//         </div>
//         <div>
//           {create ? (
//             <button onClick={handleSignup}>Sign Up</button>
//           ) : (
//             <button onClick={handleLogin}>Log In</button>
//           )}
//         </div>
//         Already have an account?
//         <button onClick={() => setCreate(!create)}>
//           {create ? 'Log In' : 'Sign Up'}
//         </button>
//         <div>
//           <button onClick={handleGoogleLogin}>Google Auth</button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginForm;
import { useState } from "react";
import { useForm } from "@mantine/form";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Divider,
  Stack,
} from "@mantine/core";
import { GoogleButton } from "./GoogleButton";

const SlidingForm = () => {
  const form = useForm({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val: string) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Container
      size="100000px"
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        padding: 0,
        margin: 0,
      }}
    >
      {/* Left Side - Login Form */}
      <Paper
        shadow="xs"
        p="lg"
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Title ta="center">Welcome back!</Title>

        <Paper withBorder shadow="md" p={30} mt={30} w={500} radius="md">
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Sign In with Google</GoogleButton>
          </Group>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />

          <form onSubmit={form.onSubmit(() => {})}>
          <Stack gap="md">
            <TextInput
              required
              label="Email"
              placeholder="you@intellistudy.com"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />
            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" />
              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button
                variant="gradient"
                gradient={{ from: '#2FAED7', to: '#0280C7', deg: 180 }}
                radius={15}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Paper>
        <Text c="dimmed" size="sm" ta="center" mt={20}>
          Don't have an account yet?{" "}
          <Anchor
            size="sm"
            component="button"
            onClick={() => setIsSignUp(true)}
          >
            Create account
          </Anchor>
        </Text>
      </Paper>

      {/* Right Side - Sign Up Form */}
      <Paper
        shadow="xs"
        p="lg"
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Title ta="center">Sign up now!</Title>
        <Paper withBorder shadow="md" p={30} mt={30} w={500} radius="md">
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Sign Up with Google</GoogleButton>
          </Group>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />

          <form onSubmit={form.onSubmit(() => {})}>
            <Stack gap="md">
              <TextInput
                required
                label="First Name"
                placeholder="John"
                value={form.values.firstName}
                onChange={(event) =>
                  form.setFieldValue("firstName", event.currentTarget.value)
                }
                radius="md"
              />

              <TextInput
                required
                label="Last Name"
                placeholder="Smith"
                value={form.values.lastName}
                onChange={(event) =>
                  form.setFieldValue("lastName", event.currentTarget.value)
                }
                radius="md"
              />
              <TextInput
                required
                label="Email"
                placeholder="you@intellistudy.com"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={
                  form.errors.password &&
                  "Password should include at least 6 characters"
                }
                radius="md"
              />
              <PasswordInput
                required
                label="Confirm Password"
                placeholder="Confirm your password"
                value={form.values.confirmPassword}
                onChange={(event) =>
                  form.setFieldValue(
                    "confirmPassword",
                    event.currentTarget.value
                  )
                }
                error={form.errors.confirmPassword && "Password do not match"}
                radius="md"
              />
                        <Button
                variant="gradient"
                gradient={{ from: '#2FAED7', to: '#0280C7', deg: 180 }}
                radius={15}
              >
                Sign up
              </Button>
            </Stack>
          </form>
        </Paper>
        <Text c="dimmed" size="sm" ta="center" mt={20}>
          Already have an account?{" "}
          <Anchor
            size="sm"
            component="button"
            onClick={() => setIsSignUp(false)}
          >
            Login
          </Anchor>
        </Text>
      </Paper>

      {/* Banner to Cover Forms */}
      <div
        style={{
          position: "absolute",
          width: "50%",
          height: "100%",
          left: isSignUp ? 0 : "50%",
          transition: "left 0.4s ease",
          zIndex: 1,
          backgroundImage:
            "linear-gradient(to right, #2FAED7 0%, #0280C7 100%)", // Using hex codes
        }}
      ></div>
    </Container>
  );
};

export default SlidingForm;
