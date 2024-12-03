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

import logoWithText from "../../logo/logo-with-text.png";

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
  "auth/claims-too-large": {
    title: "Claims Too Large",
    message:
      "The claims payload exceeds the maximum allowed size of 1000 bytes.",
  },
  "auth/id-token-expired": {
    title: "ID Token Expired",
    message: "The provided Firebase ID token is expired.",
  },
  "auth/id-token-revoked": {
    title: "ID Token Revoked",
    message: "The Firebase ID token has been revoked.",
  },
  "auth/insufficient-permission": {
    title: "Insufficient Permission",
    message:
      "The credentials used to initialize the Admin SDK have insufficient permissions.",
  },
  "auth/internal-error": {
    title: "Internal Error",
    message:
      "The Authentication server encountered an unexpected error. Please try again later.",
  },
  "auth/invalid-argument": {
    title: "Invalid Argument",
    message: "An invalid argument was provided to an Authentication method.",
  },
  "auth/invalid-claims": {
    title: "Invalid Claims",
    message: "The custom claim attributes are invalid.",
  },
  "auth/invalid-continue-uri": {
    title: "Invalid Continue URL",
    message: "The continue URL must be a valid URL string.",
  },
  "auth/invalid-creation-time": {
    title: "Invalid Creation Time",
    message: "The creation time must be a valid UTC date string.",
  },
  "auth/invalid-credential": {
    title: "Invalid Credential",
    message:
      "The credential used cannot be used to perform the desired action.",
  },
  "auth/invalid-disabled-field": {
    title: "Invalid Disabled Field",
    message: "The value for the disabled user property is invalid.",
  },
  "auth/invalid-display-name": {
    title: "Invalid Display Name",
    message:
      "The displayName user property is invalid. It must be a non-empty string.",
  },
  "auth/invalid-email": {
    title: "Invalid Email",
    message: "The provided value for the email user property is invalid.",
  },
  "auth/invalid-email-verified": {
    title: "Invalid Email Verified",
    message: "The value for emailVerified is invalid. It must be a boolean.",
  },
  "auth/invalid-hash-algorithm": {
    title: "Invalid Hash Algorithm",
    message: "The hash algorithm is invalid or unsupported.",
  },
  "auth/invalid-id-token": {
    title: "Invalid ID Token",
    message: "The provided ID token is not a valid Firebase ID token.",
  },
  "auth/invalid-last-sign-in-time": {
    title: "Invalid Last Sign-In Time",
    message: "The last sign-in time must be a valid UTC date string.",
  },
  "auth/invalid-page-token": {
    title: "Invalid Page Token",
    message: "The provided next page token is invalid.",
  },
  "auth/invalid-password": {
    title: "Invalid Password",
    message:
      "The provided password is invalid. It must be at least six characters long.",
  },
  "auth/invalid-phone-number": {
    title: "Invalid Phone Number",
    message:
      "The provided phone number is invalid. It must be a non-empty E.164 compliant identifier.",
  },
  "auth/invalid-photo-url": {
    title: "Invalid Photo URL",
    message:
      "The provided value for the photoURL user property is invalid. It must be a valid URL.",
  },
  "auth/invalid-provider-data": {
    title: "Invalid Provider Data",
    message: "The provider data must be a valid array of UserInfo objects.",
  },
  "auth/invalid-uid": {
    title: "Invalid UID",
    message:
      "The provided uid must be a non-empty string with at most 128 characters.",
  },
  "auth/maximum-user-count-exceeded": {
    title: "Maximum User Count Exceeded",
    message: "The maximum allowed number of users to import has been exceeded.",
  },
  "auth/missing-android-pkg-name": {
    title: "Missing Android Package Name",
    message:
      "An Android Package Name must be provided if the Android App is required to be installed.",
  },
  "auth/missing-continue-uri": {
    title: "Missing Continue URL",
    message: "A valid continue URL must be provided.",
  },
  "auth/missing-ios-bundle-id": {
    title: "Missing iOS Bundle ID",
    message: "The request is missing a Bundle ID.",
  },
  "auth/operation-not-allowed": {
    title: "Operation Not Allowed",
    message:
      "The requested sign-in method is disabled for your Firebase project.",
  },
  "auth/phone-number-already-exists": {
    title: "Phone Number Already Exists",
    message: "The provided phone number is already in use by another account.",
  },
  "auth/project-not-found": {
    title: "Project Not Found",
    message: "No Firebase project was found for the credentials used.",
  },
  "auth/reserved-claims": {
    title: "Reserved Claims",
    message: "One or more custom user claims are reserved.",
  },
  "auth/session-cookie-expired": {
    title: "Session Cookie Expired",
    message: "The session cookie has expired.",
  },
  "auth/session-cookie-revoked": {
    title: "Session Cookie Revoked",
    message: "The session cookie has been revoked.",
  },
  "auth/too-many-requests": {
    title: "Too Many Requests",
    message: "The number of requests exceeds the maximum allowed.",
  },
  "auth/uid-already-exists": {
    title: "UID Already Exists",
    message: "The provided UID is already in use by another user.",
  },
  "auth/unauthorized-continue-uri": {
    title: "Unauthorized Continue URL",
    message: "The domain of the continue URL is not whitelisted.",
  },
};

function getErrorMessage(errorCode) {
  return (
    errorMessages[errorCode] || {
      title: "Unknown Error",
      message: "An unknown error occurred.",
    }
  );
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
        console.log("error", error);
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
          {/* <GoBackArrow login={isSignUp} /> */}

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
                  <Anchor component="button" size="sm">
                    Forgot password?
                  </Anchor>
                </Group>
                <Button
                  type="submit"
                  variant="gradient"
                  gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
                  radius="md"
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
        <GoBackArrow login={isSignUp} />
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
                  radius="md"
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
              <Image radius="sm" w={300} src={logoWithText} />
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
