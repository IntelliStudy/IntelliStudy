import { FillInBlankQuestion } from "../components";
import { AnswerReference } from "../types/quiz";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";

const mockOnAnswerChange = jest.fn();

const answerReference: AnswerReference = {
  fileName: "reference.pdf",
  pageNumber: "5",
};

const defaultProps = {
  question: "What is the capital of France? ***",
  questionId: "q1",
  options: ["Berlin", "Madrid", "Paris"],
  sectionType: "geography",
  onAnswerChange: mockOnAnswerChange,
  isCorrect: undefined,
  disabled: false,
  isSubmitted: false,
  userAnswer: "",
  answerReference: answerReference,
};

// Create a custom render function that wraps the component in MantineProvider
const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("FillInBlankQuestion", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous calls to mock functions
  });

  test("renders the question and options", () => {
    renderWithMantine(<FillInBlankQuestion {...defaultProps} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "What is the capital of France?"
    );
    expect(screen.getByPlaceholderText("Pick a value")).toBeInTheDocument();
  });

  test("sets selectedOption based on isSubmitted prop", async () => {
    const { rerender } = renderWithMantine(
      <FillInBlankQuestion {...defaultProps} />
    );

    // Fire the change event on the select element
    fireEvent.change(screen.getByPlaceholderText("Pick a value"), {
      target: { value: "Paris" },
    });

    expect(mockOnAnswerChange).toHaveBeenCalledWith(
      defaultProps.sectionType,
      defaultProps.questionId,
      "Paris"
    );

    // Rerender with isSubmitted set to true
    rerender(
      <MantineProvider>
        <FillInBlankQuestion
          {...defaultProps}
          isSubmitted={true}
          userAnswer="Paris"
        />
      </MantineProvider>
    );

    // Check that the selected option reflects the userAnswer
    await waitFor(() => {
      expect(screen.getByText("Paris")).toBeInTheDocument();
    });
  });

  test("applies correct styles based on isCorrect", async () => {
    const { rerender } = renderWithMantine(
      <FillInBlankQuestion {...defaultProps} />
    );

    // Initially should have no styles applied
    expect(screen.getByPlaceholderText("Pick a value")).toHaveStyle(
      "border-color: ;"
    );

    // Rerender with isCorrect set to true
    rerender(
      <MantineProvider>
        <FillInBlankQuestion
          {...defaultProps}
          isCorrect={true}
          isSubmitted={true}
          userAnswer="Berlin"
        />
      </MantineProvider>
    );
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Pick a value")).toHaveStyle(
        "border-color: limeGreen;"
      );
    });

    // Rerender with isCorrect set to false
    rerender(
      <MantineProvider>
        <FillInBlankQuestion
          {...defaultProps}
          isCorrect={false}
          isSubmitted={true}
          userAnswer="Berlin"
        />
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Pick a value")).toHaveStyle(
        "border-color: red;"
      );
    });
  });

  test("displays answer reference when isCorrect is false", () => {
    renderWithMantine(
      <FillInBlankQuestion
        {...defaultProps}
        isCorrect={false}
        isSubmitted={true}
      />
    );

    expect(screen.getByText("reference.pdf")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("does not display answer reference when isCorrect is true", () => {
    renderWithMantine(
      <FillInBlankQuestion
        {...defaultProps}
        isCorrect={true}
        isSubmitted={true}
      />
    );

    expect(screen.queryByText("reference.pdf")).not.toBeInTheDocument();
  });
});
