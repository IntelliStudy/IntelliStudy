import { Button, LoadingOverlay } from "@mantine/core";
import { useForm } from "@mantine/form";
import { collection, getDocs } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import { QuizScore, SectionWrapper } from "../components";
import { QuestionLabel, QuestionType } from "../constants";
import { db } from "../firebase/firebase";
import { QuizFormValues, QuizValidationAnswers } from "../types/quiz";
import {
  calculateFinalScore,
  createAttemptDocument,
  validateAnswers,
  validateAnswersForAttempt,
} from "../utilities/quizUtilities";

const Quiz = () => {
  const { currentUser } = useContext(UserContext);
  const { courseId } = useParams();
  const { quizId } = useParams();

  const [quizQuestions, setQuizQuestions] = useState<any>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [quizScore, setQuizScore] = useState({
    userScore: 0,
    totalScore: 0,
  });
  const [isQuizGraded, setIsQuizGraded] = useState<boolean>(false);

  useEffect(() => {
    // Function to fetch the 'graded' field from Firestore
    const fetchGradedStatus = async () => {
      if (currentUser && courseId && quizId) {
        const attemptRef = collection(
          db,
          `users/${currentUser?.uid}/courses/${courseId}/quizzes/${quizId}/attempt`
        );
        const attemptSnapshot = await getDocs(attemptRef);

        if (!attemptSnapshot.empty) {
          const firstAttemptDoc = attemptSnapshot.docs[0];
          const attemptData = firstAttemptDoc.data();

          if (attemptData.graded) {
            setIsQuizGraded(true); // Update the state when graded is true
          }
        }
      }
    };

    // Polling to check if the quiz is graded
    const intervalId = setInterval(fetchGradedStatus, 500); // Poll every 0.5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [currentUser, courseId, quizId]);

  useEffect(() => {
    // Functions to get quiz and get attempt
    const fetchQuizQuestions = async () => {
      const questionsCollectionRef = collection(
        db,
        `users/${currentUser?.uid}/courses/${courseId}/quizzes/${quizId}/questions`
      );
      const allQuestionsQuery = await getDocs(questionsCollectionRef);
      const allQuestions = allQuestionsQuery.docs.map((doc) => doc.data());
      setQuizQuestions(allQuestions);
      console.log(allQuestions);
    };

    const fetchAttempt = async () => {
      const attemptRef = collection(
        db,
        `users/${currentUser?.uid}/courses/${courseId}/quizzes/${quizId}/attempt`
      );

      const attemptSnapshot = await getDocs(attemptRef);

      if (!attemptSnapshot.empty) {
        setIsSubmitted(true);
        const firstAttemptDoc = attemptSnapshot.docs[0];
        const attemptData = firstAttemptDoc.data();
        const attemptQuestions = attemptData.questions;
        console.log(attemptQuestions);
        const {
          mcq = [],
          tf = [],
          s_ans = [],
          l_ans = [],
          fill_in_blank = [],
        } = attemptQuestions;

        // Loop through each question type and set values
        mcq.forEach((question: any) => {
          quizForm.values.mcq[question.questionId] = question.userAnswer;
        });

        tf.forEach((question: any) => {
          quizForm.values.tf[question.questionId] = question.userAnswer;
        });

        s_ans.forEach((question: any) => {
          quizForm.values.s_ans[question.questionId] = question.userAnswer;
        });

        l_ans.forEach((question: any) => {
          quizForm.values.l_ans[question.questionId] = question.userAnswer;
        });

        fill_in_blank.forEach((question: any) => {
          quizForm.values.fill_in_blank[question.questionId] =
            question.userAnswer;
        });

        // VALIDATION
        const results: QuizValidationAnswers = {
          mcq: {},
          tf: {},
          s_ans: {},
          l_ans: {},
          fill_in_blank: {},
        };

        // Validate MCQ answers
        results.mcq = validateAnswersForAttempt(attemptQuestions.mcq);

        // Validate TF answers
        results.tf = validateAnswersForAttempt(attemptQuestions.tf);

        // Validate Fill in the Blank answers
        results.fill_in_blank = validateAnswersForAttempt(
          attemptQuestions.fill_in_blank
        );

        // Disbale selection
        setDisabled(true);

        // Set Validation results to state
        setValidationResults(results);
      } else {
        console.log("No attempts found!");
      }
    };

    fetchQuizQuestions()
      .then(() => {
        fetchAttempt();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentUser, courseId, quizId]);

  useEffect(() => {
    // Define the async function
    const fetchAttemptData = async () => {
      try {
        const attemptRef = collection(
          db,
          `users/${currentUser?.uid}/courses/${courseId}/quizzes/${quizId}/attempt`
        );

        const attemptSnapshot = await getDocs(attemptRef);

        if (!attemptSnapshot.empty) {
          const firstAttemptDoc = attemptSnapshot.docs[0];
          const attemptData = firstAttemptDoc.data();

          // Set score
          setQuizScore({
            userScore: attemptData.userScore,
            totalScore: attemptData.totalScore,
          });
        }
      } catch (error) {
        console.error("Error fetching attempt data:", error);
      }
    };

    // Call the async function
    fetchAttemptData();
  }, [isQuizGraded]);

  // useEffect(() => {
  //   if (isQuizGraded && isSubmitted) {
  //     window.location.reload();
  //   }
  // }, [isQuizGraded, isSubmitted]);

  const quiz = {
    quiz: {
      files: ["file1.pdf", "file2.pdf"],
      questions: {
        mcq: quizQuestions
          ? quizQuestions.filter((question: any) => question.type === "mcq")
          : [],
        s_ans: quizQuestions
          ? quizQuestions.filter((question: any) => question.type === "s_ans")
          : [],
        l_ans: quizQuestions
          ? quizQuestions.filter((question: any) => question.type === "l_ans")
          : [],
        tf: quizQuestions
          ? quizQuestions.filter((question: any) => question.type === "tf")
          : [],
        fill_in_blank: quizQuestions
          ? quizQuestions.filter(
              (question: any) => question.type === "fill_in_blank"
            )
          : [],
      },
    },
  };

  const quizForm = useForm<QuizFormValues>({
    initialValues: {
      mcq: {},
      tf: {},
      s_ans: {},
      l_ans: {},
      fill_in_blank: {},
    },
  });

  // Used to store answer validation results
  const [validationResults, setValidationResults] =
    useState<QuizValidationAnswers>({
      mcq: {},
      tf: {},
      s_ans: {},
      l_ans: {},
      fill_in_blank: {},
    });

  // Used to disable selections after submitting
  const [disabled, setDisabled] = useState(false);
  const [shouldCreateAttempt, setShouldCreateAttempt] = useState(false);

  // Handle answer change
  const handleAnswerChange = (
    sectionType: string,
    questionId: string,
    answer: string
  ) => {
    quizForm.setFieldValue(`${sectionType}.${questionId}`, answer);
    console.log(quizForm.getValues());
  };

  const handleQuizSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // VALIDATION
    const results: QuizValidationAnswers = {
      mcq: {},
      tf: {},
      s_ans: {},
      l_ans: {},
      fill_in_blank: {},
    };

    // Validate MCQ answers
    results.mcq = validateAnswers(
      QuestionType.mcq,
      quiz.quiz.questions.mcq,
      quizForm.values.mcq
    );

    // Validate TF answers
    results.tf = validateAnswers(
      QuestionType.tf,
      quiz.quiz.questions.tf,
      quizForm.values.tf
    );

    // Validate Fill in the Blank
    results.fill_in_blank = validateAnswers(
      QuestionType.fill_in_blank,
      quiz.quiz.questions.fill_in_blank,
      quizForm.values.fill_in_blank
    );

    // Disbale selection
    setDisabled(true);

    // Set Validation results to state
    setValidationResults(results);

    // Setting flag to indicate that an attempt should be created
    setShouldCreateAttempt(true);

    // Set submission flag
    setIsSubmitted(true);
  };

  useEffect(() => {
    const handleCreateAttempt = async () => {
      if (shouldCreateAttempt) {
        try {
          // Create attempt under users/{userId}/courses/{courseId}/quizzes/{quizId}/attempts
          await createAttemptDocument(
            currentUser!.uid,
            courseId!,
            quizId!,
            quiz.quiz,
            quizForm.values,
            validationResults
          );

          // Set loading to true and delay for 2 seconds
          setLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second delay
          setLoading(false);

          // Calculate the final score and update the state
          const finalScore = await calculateFinalScore(
            currentUser!.uid,
            courseId!,
            quizId!
          );

          // Update the score after calculation
          setQuizScore(finalScore); // Now the state gets updated with both userScore and totalScore
          setIsQuizGraded(true); // Set the graded flag once the score is updated

          // Scroll to top after submission
          window.scrollTo({
            top: 0,
            behavior: "smooth", // Makes the scroll smooth
          });
        } catch (error) {
          console.error("Error calculating score:", error);
        }
        // Reset the trigger after the attempt has been created
        setShouldCreateAttempt(false);
      }
    };

    handleCreateAttempt();
  }, [shouldCreateAttempt, validationResults, disabled]);

  useEffect(() => {
    // Display the score only if the quiz is graded and submitted
    if (isQuizGraded && isSubmitted) {
      // Fetch the latest score (if needed) and re-render
      setQuizScore({
        userScore: quizScore.userScore,
        totalScore: quizScore.totalScore,
      });
    }
  }, [isQuizGraded, isSubmitted, quizScore.userScore, quizScore.totalScore]);

  return (
    <>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 20 }}
        data-testid="loading"
      />
      {/* Quiz Score Section */}
      {isSubmitted && isQuizGraded && (
        <QuizScore
          totalScore={quizScore.totalScore}
          userScore={quizScore.userScore}
        />
      )}
      {!loading && (
        <form onSubmit={handleQuizSubmit}>
          {/* MCQ */}
          {quiz.quiz.questions.mcq.length > 0 && (
            <SectionWrapper
              sectionType={QuestionType.mcq}
              sectionLabel={QuestionLabel.mcq}
              questions={quiz.quiz.questions.mcq}
              onAnswerChange={handleAnswerChange}
              validationResults={validationResults}
              disabled={disabled}
              isSubmitted={isSubmitted}
              userAnswer={quizForm.values.mcq}
            />
          )}

          {/* TF */}
          {quiz.quiz.questions.tf.length > 0 && (
            <SectionWrapper
              sectionType={QuestionType.tf}
              sectionLabel={QuestionLabel.tf}
              questions={quiz.quiz.questions.tf}
              onAnswerChange={handleAnswerChange}
              validationResults={validationResults}
              disabled={disabled}
              isSubmitted={isSubmitted}
              userAnswer={quizForm.values.tf}
            />
          )}

          {/* SHORT ANS */}

          {quiz.quiz.questions.s_ans.length > 0 && (
            <SectionWrapper
              sectionType={QuestionType.s_ans}
              sectionLabel={QuestionLabel.s_ans}
              questions={quiz.quiz.questions.s_ans}
              onAnswerChange={handleAnswerChange}
              validationResults={validationResults}
              disabled={disabled}
              isSubmitted={isSubmitted}
              userAnswer={quizForm.values.s_ans}
            />
          )}

          {/* LONG ANS */}
          {quiz.quiz.questions.l_ans.length > 0 && (
            <SectionWrapper
              sectionType={QuestionType.l_ans}
              sectionLabel={QuestionLabel.l_ans}
              questions={quiz.quiz.questions.l_ans}
              onAnswerChange={handleAnswerChange}
              validationResults={validationResults}
              disabled={disabled}
              isSubmitted={isSubmitted}
              userAnswer={quizForm.values.l_ans}
            />
          )}

          {/* FILL IN BLANK */}

          {quiz.quiz.questions.fill_in_blank.length > 0 && (
            <SectionWrapper
              sectionType={QuestionType.fill_in_blank}
              sectionLabel={QuestionLabel.fill_in_blank}
              questions={quiz.quiz.questions.fill_in_blank}
              onAnswerChange={handleAnswerChange}
              validationResults={validationResults}
              disabled={disabled}
              isSubmitted={isSubmitted}
              userAnswer={quizForm.values.fill_in_blank}
            />
          )}

          {!isSubmitted && (
            <Button type="submit" w={"90px"} ml="115px" mb="70px">
              Submit
            </Button>
          )}
        </form>
      )}
    </>
  );
};

export default Quiz;
