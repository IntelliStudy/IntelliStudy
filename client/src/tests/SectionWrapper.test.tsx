import { render, screen, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { SectionWrapper } from "../components";
import { MultChoiceQuestionType, QuizValidationAnswers } from "../types/quiz";

const renderWithMantine = (ui: JSX.Element) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

const mockQuestions: MultChoiceQuestionType[] = [
  {
    id: "1",
    question: "What is the capital of France?",
    options: [
      { key: "A", value: "Berlin" },
      { key: "B", value: "Madrid" },
      { key: "C", value: "Paris" },
    ],
    type: "mcq",
    answer: { key: "C", value: "Paris" },
    answerReference: { fileName: "file.pdf", pageNumber: "10" },
  } as MultChoiceQuestionType,
];

const defaultProps = {
  sectionType: "mcq",
  sectionLabel: "Sample Section",
  questions: mockQuestions,
  onAnswerChange: jest.fn(),
  validationResults: {
    mcq: {},
    tf: {},
    short_answer: {},
    long_answer: {},
    fill_in_blank: {},
  } as unknown as QuizValidationAnswers,
  disabled: false,
  isSubmitted: false,
  userAnswer: {},
};

describe("SectionWrapper", () => {
  test("renders section label and questions", async () => {
    renderWithMantine(<SectionWrapper attemptData={[]} {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Sample Section")).toBeInTheDocument();
      expect(
        screen.getByText("What is the capital of France?")
      ).toBeInTheDocument();
      expect(screen.getByText("Berlin")).toBeInTheDocument();
      expect(screen.getByText("Madrid")).toBeInTheDocument();
      expect(screen.getByText("Paris")).toBeInTheDocument();
    });
  });

  test("calls onAnswerChange when an answer is selected", async () => {
    renderWithMantine(<SectionWrapper attemptData={[]} {...defaultProps} />);

    const parisOption = screen.getByText("Paris").closest("button");
    await waitFor(() => {
      if (parisOption) {
        parisOption.click();
      }
    });

    expect(defaultProps.onAnswerChange).toHaveBeenCalledWith(
      defaultProps.sectionType,
      "1",
      "C"
    );
  });

  test("renders validation results", async () => {
    const propsWithValidation = {
      ...defaultProps,
      validationResults: {
        mcq: {},
        tf: {},
        short_answer: {},
        long_answer: {},
        fill_in_blank: {},
      } as unknown as QuizValidationAnswers,
      isSubmitted: true,
      userAnswer: { "1": "C" },
    };

    renderWithMantine(
      <SectionWrapper attemptData={[]} {...propsWithValidation} />
    );

    await waitFor(() => {
      expect(screen.getByText("Sample Section")).toBeInTheDocument();
      expect(
        screen.getByText("What is the capital of France?")
      ).toBeInTheDocument();
      // Check if the correct answer has a visual indication for being correct or incorrect
      expect(screen.getByText("Paris").closest("button")).toHaveAttribute(
        "aria-checked",
        "true"
      );
      expect(screen.getByText("Berlin").closest("button")).toHaveAttribute(
        "aria-checked",
        "false"
      );
      expect(screen.getByText("Madrid").closest("button")).toHaveAttribute(
        "aria-checked",
        "false"
      );
    });
  });
});
