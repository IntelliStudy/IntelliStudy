import {
  Anchor,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  // Flex,
  Group,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Notifications, notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { UserContext } from "../App";
import { GoogleButton } from "../components";
import GoBackArrow from "../components/firebaseAuth/GoBackArrow";
import {
  // getCurrentlySignedInUserHandler,
  googleLoginHandler,
  loginHandler,
  signUpHandler,
} from "../firebase/auth";

const errorMessages = {
  "auth/email-already-in-use": {
    title: "Email Already Exists",
    message: "The email address is already in use by another account.",
  },
  "auth/user-not-found": {
    title: "User Not Found",
    message: "No user found for the given email address.",
  },
  "auth/wrong-password": {
    title: "Wrong username or password",
    message: "Please try again.",
  },
};

type ErrorCode =
  | "auth/email-already-in-use"
  | "auth/user-not-found"
  | "auth/wrong-password";

function getErrorMessage(errorCode: ErrorCode) {
  return errorMessages[errorCode];
}

const AuthPage = () => {
  // const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isSignupFromState = location.state?.isSignup || false; // Default to false if not provided
  const [isSignUp, setIsSignUp] = useState(isSignupFromState);

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  const signupForm = useForm({
    initialValues: {
      email: "",
      fName: "",
      lName: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      fName: (val: string) => (val.length <= 1 ? "Invalid name" : null),
      lName: (val: string) => (val.length <= 1 ? "Invalid name" : null),
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val: string) =>
        val.length < 6 ? "Password should include at least 6 characters" : null,
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  const handleSignup = () => {
    console.log(
      "Signing up with:",
      signupForm.values.email,
      signupForm.values.password,
      signupForm.values.fName,
      signupForm.values.lName
    );
    signUpHandler(
      signupForm.values.email,
      signupForm.values.password,
      signupForm.values.fName,
      signupForm.values.lName,
      () => {
        navigate("/studyspot");
      }
    )
      .then(() => {
        // setCurrentUser(getCurrentlySignedInUserHandler);
      })
      .catch((error) => {
        console.log("error", getErrorMessage(error.code));
        notifications.show({
          icon: xIcon,
          radius: "lg",
          title: getErrorMessage(error.code).title,
          message: getErrorMessage(error.code).message,
          color: "red",
        });
      });
  };

  const handleGoogleLogin = () => {
    console.log("Signing up / logging in with Google");

    googleLoginHandler(() => {
      navigate("/studyspot");
    }).then(() => {
      // setCurrentUser(getCurrentlySignedInUserHandler);
    });
  };

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
    },
  });

  const handleLogin = () => {
    loginHandler(loginForm.values.email, loginForm.values.password, () => {
      navigate("/studyspot");
    })
      .then(() => {
        // setCurrentUser(getCurrentlySignedInUserHandler);
        console.log(
          "Logging in with:",
          loginForm.values.email,
          loginForm.values.password
        );
      })
      .catch((error) => {
        console.log(error);
        notifications.show({
          icon: xIcon,
          title: getErrorMessage(error.code).title,
          message: getErrorMessage(error.code).message,
          color: "red",
        });
      });
  };

  return (
    <>
      <Notifications position="top-center" />
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
            transform: isSignUp ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 0.4s ease",
          }}
        >
          <GoBackArrow login={isSignUp} />
          <Title ta="center">Welcome back!</Title>

          <Paper withBorder shadow="md" p={30} mt={30} w={500} radius="md">
            <Group grow mb="md" mt="md">
              <GoogleButton radius="xl" onClick={handleGoogleLogin}>
                Sign In with Google
              </GoogleButton>
            </Group>

            <Divider
              label="Or continue with email"
              labelPosition="center"
              my="lg"
            />

            <form onSubmit={loginForm.onSubmit(handleLogin, console.log)}>
              <Stack gap="md">
                <TextInput
                  required
                  label="Email"
                  placeholder="you@intellistudy.com"
                  key={loginForm.key("email")}
                  {...loginForm.getInputProps("email")}
                  value={loginForm.values.email}
                  onChange={(event) =>
                    loginForm.setFieldValue("email", event.currentTarget.value)
                  }
                  error={loginForm.errors.email && "Invalid email"}
                  radius="md"
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  key={loginForm.key("password")}
                  {...loginForm.getInputProps("password")}
                  value={loginForm.values.password}
                  onChange={(event) =>
                    loginForm.setFieldValue(
                      "password",
                      event.currentTarget.value
                    )
                  }
                  error={
                    loginForm.errors.password &&
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
                  type="submit"
                  variant="gradient"
                  gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
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
            transform: isSignUp ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.4s ease",
          }}
        >
          <Title ta="center">Sign up now!</Title>

          <Paper withBorder shadow="md" p={30} mt={30} w={500} radius="md">
            <Group grow mb="md" mt="md">
              <GoogleButton radius="xl" onClick={handleGoogleLogin}>
                Sign Up with Google
              </GoogleButton>
            </Group>

            <Divider
              label="Or continue with email"
              labelPosition="center"
              my="lg"
            />

            <form onSubmit={signupForm.onSubmit(handleSignup, console.log)}>
              <Stack gap="md">
                <TextInput
                  required
                  label="First Name"
                  placeholder="John"
                  key={signupForm.key("fName")}
                  {...signupForm.getInputProps("fName")}
                  value={signupForm.values.fName}
                  onChange={(event) =>
                    signupForm.setFieldValue("fName", event.currentTarget.value)
                  }
                  radius="md"
                />

                <TextInput
                  required
                  label="Last Name"
                  placeholder="Smith"
                  key={signupForm.key("lName")}
                  {...signupForm.getInputProps("lName")}
                  value={signupForm.values.lName}
                  onChange={(event) =>
                    signupForm.setFieldValue("lName", event.currentTarget.value)
                  }
                  radius="md"
                />
                <TextInput
                  required
                  label="Email"
                  placeholder="you@intellistudy.com"
                  value={signupForm.values.email}
                  key={signupForm.key("email")}
                  {...signupForm.getInputProps("email")}
                  onChange={(event) =>
                    signupForm.setFieldValue("email", event.currentTarget.value)
                  }
                  error={signupForm.errors.email && "Invalid email"}
                  radius="md"
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  value={signupForm.values.password}
                  key={signupForm.key("password")}
                  {...signupForm.getInputProps("password")}
                  onChange={(event) =>
                    signupForm.setFieldValue(
                      "password",
                      event.currentTarget.value
                    )
                  }
                  error={
                    signupForm.errors.password &&
                    "Password should include at least 6 characters"
                  }
                  radius="md"
                />
                <PasswordInput
                  required
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={signupForm.values.confirmPassword}
                  key={signupForm.key("confirmPassword")}
                  {...signupForm.getInputProps("confirmPassword")}
                  onChange={(event) =>
                    signupForm.setFieldValue(
                      "confirmPassword",
                      event.currentTarget.value
                    )
                  }
                  error={
                    signupForm.errors.confirmPassword && "Password do not match"
                  }
                  radius="md"
                />
                <Button
                  type="submit"
                  variant="gradient"
                  gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
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
            backgroundImage: isSignUp
              ? "linear-gradient(to left, #2FAED7 0%, #0280C7 100%)"
              : "linear-gradient(to right, #2FAED7 0%, #0280C7 100%)", // Using hex codes
          }}
        >
          {isSignUp && <GoBackArrow login={isSignUp} />}
          <Center style={{ height: "100vh" }}>
            <Stack align="center" gap="sm">
              <Image radius="sm" w={300} src="./logo/logo-with-text.png" />
              <Text ta="center" size="lg" fw={700} c="white">
                The study buddy you've always wanted.
              </Text>
            </Stack>
          </Center>
        </div>
      </Container>
    </>
  );
};

export default AuthPage;
