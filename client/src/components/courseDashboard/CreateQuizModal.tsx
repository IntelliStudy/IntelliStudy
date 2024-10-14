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
  TextInput,
  Title,
  createTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { addDoc, collection, getDocs, updateDoc } from "firebase/firestore";
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
      quizName: "",
    },

    validate: {
      quizName: (val: string) => (val.length <= 1 ? "Invalid quiz name" : null),
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

  function getRandomValues(array: any[], n: number): any[] {
    // Check if n is greater than the array length
    if (n > array.length) {
      throw new Error("n cannot be greater than the length of the array");
    }

    // Shuffle the array using Fisher-Yates algorithm
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ]; // Swap elements
    }

    // Return the first n elements from the shuffled array
    return shuffledArray.slice(0, n);
  }

  const fetchQuestions = async (values: any) => {
    const files = await getDocs(
      collection(db, `users/${currentUser?.uid}/courses/${courseId}/files/`)
    );
    const fileIds = files.docs.map((doc) => doc.id);
    const questions: any[] = [];

    const fetchFileQuestions = fileIds.map(async (fileId: string) => {
      const questionsCollectionRef = collection(
        db,
        `users/${currentUser?.uid}/courses/${courseId}/files/${fileId}/questions`
      );
      const allQuestionsQuery = await getDocs(questionsCollectionRef);
      const allQuestions = allQuestionsQuery.docs.map((doc) => doc.data());
      values.questionTypes.forEach((questionType: any) => {
        if (questionType.checked) {
          const typeFilteredQuestions = allQuestions.filter(
            (question) => question.type === questionType.type
          );
          questions.push(
            ...getRandomValues(typeFilteredQuestions, questionType.count)
          );
        }
      });
    });

    await Promise.all(fetchFileQuestions);
    return questions;
  };

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

      const quiz = await fetchQuestions(values);

      // Create quiz document
      const quizzesDoc = await addDoc(quizzesCollection, {
        quizName: quizForm.values.quizName,
      });
      await updateDoc(quizzesDoc, { id: quizzesDoc.id });

      const quizItemsCollection = collection(
        db,
        `users/${currentUser!.uid}/courses/${courseId}/quizzes/${quizzesDoc.id}/questions`
      );
      for (const question of quiz) {
        console.log("adding question", question);
        await addDoc(quizItemsCollection, question);
      }
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

                <TextInput
                  size="md"
                  label="Quiz Name"
                  placeholder="Enter your quiz name"
                  value={quizForm.values.quizName}
                  onChange={(event) => {
                    quizForm.setFieldValue(
                      "quizName",
                      event.currentTarget.value
                    );
                  }}
                  error={quizForm.errors.quizName && "Invalid quiz name"}
                  w="40%"
                />

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
