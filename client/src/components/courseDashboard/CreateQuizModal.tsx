import {
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  MantineProvider,
  Select,
  Stack,
  Text,
  Title,
  createTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { addDoc, collection } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { QuestionType } from "../../constants";
import { db } from "../../firebase/firebase";

const theme = createTheme({
  cursorType: "pointer",
  components: {
    Checkbox: {
      styles: () => ({
        label: {
          fontSize: "16px",
          fontWeight: "500",
        },
      }),
    },
    Select: {
      styles: () => ({
        root: {
          width: "28%",
          paddingTop: "7px",
        },
      }),
    },
  },
});

interface props {
  courseId: string;
}

const CreateQuizModal = ({ courseId }: props) => {
  // Current user context
  const { currentUser } = useContext(UserContext);

  const quizCountOptions = Array.from({ length: 5 }, (_, i) =>
    (i + 1).toString()
  );

  const navigate = useNavigate();

  const quizForm = useForm({
    initialValues: {
      questionTypes: [
        {
          type: QuestionType.mcq,
          label: "Multiple Choice Questions",
          checked: false,
          count: 0,
        },
        {
          type: QuestionType.s_ans,
          label: "Short Answer Questions",
          checked: false,
          count: 0,
        },
        {
          type: QuestionType.tf,
          label: "True and False Questions",
          checked: false,
          count: 0,
        },
        {
          type: QuestionType.l_ans,
          label: "Long Answer Questions",
          checked: false,
          count: 0,
        },
        {
          type: QuestionType.fill_in_blank,
          label: "Fill in the Blank Questions",
          checked: false,
          count: 0,
        },
      ],
      // duration: [{ label: 'Timed', checked: false, duration: 0 }],
    },
  });

  // State to track if the submit button should be disabled
  const [isCreateDisabled, setIsCreateDisabled] = useState<boolean>(true);

  // useEffect to track changes in questionTypes and update the state
  useEffect(() => {
    const isAnyChecked = quizForm.values.questionTypes.some(
      (questionType) => questionType.checked
    );

    // Disable the submit button if no checkbox is selected
    setIsCreateDisabled(!isAnyChecked);
  }, [quizForm.values.questionTypes]);

  // Function to render check boxes
  const questionTypeCheckBoxes = quizForm.values.questionTypes.map(
    (value, index) => (
      <Flex key={index} direction={"column"} mb={"10px"}>
        <Checkbox
          key={index}
          label={value.label}
          checked={value.checked}
          onChange={(event) =>
            quizForm.setFieldValue(
              `questionTypes.${index}.checked`,
              event.currentTarget.checked
            )
          }
        />
        {value.checked && (
          <Select
            placeholder="Number of questions"
            data={quizCountOptions}
            value={value.count.toString()}
            onChange={(selectedValue) => {
              quizForm.setFieldValue(
                `questionTypes.${index}.count`,
                parseInt(selectedValue ?? "0", 10)
              );
            }}
            error={quizForm.errors[`questionTypes.${index}.count`]}
          />
        )}
      </Flex>
    )
  );

  // const durationCheckBoxes = quizForm.values.duration.map((value, index) => (
  //   <Flex key={index} direction={'column'}>
  //     <Checkbox
  //       key={index}
  //       label={value.label}
  //       checked={value.checked}
  //       onChange={(event) =>
  //         quizForm.setFieldValue(
  //           `duration.${index}.checked`,
  //           event.currentTarget.checked
  //         )
  //       }
  //     />
  //     {value.checked && (
  //       <Select
  //         placeholder="Duration"
  //         data={quizCountOptions}
  //         value={value.duration.toString()}
  //         onChange={(selectedValue) =>
  //           quizForm.setFieldValue(
  //             `duration.${index}.duration`,
  //             parseInt(selectedValue ?? '0', 10)
  //           )
  //         }
  //       />
  //     )}
  //   </Flex>
  // ));

  const handleSubmit = async (values: (typeof quizForm)["values"]) => {
    const errors: { [key: string]: string } = {}; // This allows dynamic string keys

    values.questionTypes.forEach((questionType, index) => {
      if (questionType.checked && questionType.count <= 0) {
        // Use a dynamic key for the error
        errors[`questionTypes.${index}.count`] = "Please select a value";
      }
    });

    if (Object.keys(errors).length > 0) {
      quizForm.setErrors(errors);
    } else {
      // Handle form submission
      console.log("Form submitted successfully!", values);

      // Create quizzes collection and create document for quiz
      const quizzesCollection = collection(
        db,
        `users/${currentUser?.uid}/courses/${courseId}/quizzes`
      );

      const quizzesDoc = await addDoc(quizzesCollection, {});

      // Redirect to quiz page after submission
      navigate(`quiz/${quizzesDoc.id}`);
    }
  };

  return (
    <>
      <MantineProvider theme={theme}>
        <Container>
          <Divider size={"sm"} w={"96%"} mt={0} />

          <Flex direction={"column"} pt={"25px"}>
            <Title order={3} fw={500} mb={"20px"}>
              Question Format
            </Title>

            <form onSubmit={quizForm.onSubmit(handleSubmit)}>
              <Stack gap={"md"}>
                {questionTypeCheckBoxes}

                {/* <Title order={3} fw={500}>
                  Duration
                </Title> */}

                {/* {durationCheckBoxes} */}

                <Flex justify={"right"} mt={"20px"} mb={"20px"} mr={"15px"}>
                  <Button
                    type="submit"
                    variant="gradient"
                    gradient={{ from: "#2FAED7", to: "#0280C7", deg: 180 }}
                    size="md"
                    radius={10}
                    disabled={isCreateDisabled}
                  >
                    <Text size="20px" fw={600}>
                      Create
                    </Text>
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Flex>
        </Container>
      </MantineProvider>
    </>
  );
};

export default CreateQuizModal;
