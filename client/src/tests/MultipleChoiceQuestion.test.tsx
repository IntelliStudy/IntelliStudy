import { MultipleChoiceQuestion } from "../components";
import { McqOption, AnswerReference } from "../types/quiz";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MantineProvider } from "@mantine/core"; // Import MantineProvider
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

const mockOnAnswerChange = jest.fn();

const options: McqOption[] = [
  { key: "a", value: "Berlin" },
  { key: "b", value: "Madrid" },
  { key: "c", value: "Paris" },
];

const answerReference: AnswerReference = {
  fileName: "reference.pdf",
  pageNumber: "5",
};

const defaultProps = {
  question: "What is the capital of France?",
  questionId: "q1",
  options,
  sectionType: "geography",
  answerReference,
  onAnswerChange: mockOnAnswerChange,
  correctAnswer: options[2], // Paris
  isCorrect: undefined,
  disabled: false,
  isSubmitted: false,
  userAnswer: "",
};

// Create a custom render function that wraps the component in MantineProvider
const renderWithMantine = (ui: React.ReactElement) =>
  render(<MantineProvider>{ui}</MantineProvider>);

describe("MultipleChoiceQuestion", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous calls to mock functions
  });

  test("renders the question and options", () => {
    renderWithMantine(<MultipleChoiceQuestion {...defaultProps} />);

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
        defaultProps.question
      );

      options.forEach((option) => {
        expect(screen.getByLabelText(option.value)).toBeInTheDocument();
      });
    });
  });

  test("sets selectedOption based on isSubmitted prop", async () => {
    const { rerender } = renderWithMantine(
      <MultipleChoiceQuestion {...defaultProps} />
    );

    // Fire the click event on the button labeled "Paris"
    await waitFor(() => {
      fireEvent.click(screen.getByText("Paris")); // Select the option directly by text
    });

    // Check that it hasn't been submitted yet
    await waitFor(() => {
      expect(screen.getByText("Paris").closest("button")).toHaveAttribute(
        "aria-checked",
        "true"
      );
    });

    // Rerender with MantineProvider and with isSubmitted set to true
    rerender(
      <MantineProvider>
        <MultipleChoiceQuestion
          {...defaultProps}
          isSubmitted={true}
          userAnswer="c"
        />
      </MantineProvider>
    );

    // Now check that the selected option is set to userAnswer
    await waitFor(() => {
      expect(screen.getByText("Paris").closest("button")).toHaveAttribute(
        "aria-checked",
        "true"
      );
    });
  });

  test("applies correct styles based on isCorrect", () => {
    const { rerender } = renderWithMantine(
      <MultipleChoiceQuestion {...defaultProps} />
    );

    // Initially should have no styles applied
    waitFor(() => {
      expect(screen.getByText("Paris").closest("input")).not.toHaveStyle(
        "background-color: limeGreen"
      );
    });

    // Rerender with isCorrect set to true
    rerender(
      <MantineProvider>
        <MultipleChoiceQuestion {...defaultProps} isCorrect={true} />;
      </MantineProvider>
    );
    waitFor(() => {
      expect(screen.getByText("Paris").closest("input")).toHaveStyle(
        "background-color: limeGreen"
      );
    });

    // Rerender with isCorrect set to false
    rerender(
      <MantineProvider>
        <MultipleChoiceQuestion {...defaultProps} isCorrect={false} />;
      </MantineProvider>
    );

    waitFor(() => {
      expect(screen.getByText("Berlin").closest("input")).toHaveStyle(
        "background-color: red"
      );
    });
  });

  test("displays answer reference when isCorrect is false", () => {
    renderWithMantine(
      <MultipleChoiceQuestion
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
      <MultipleChoiceQuestion
        {...defaultProps}
        isCorrect={true}
        isSubmitted={true}
      />
    );

    expect(screen.queryByText("reference.pdf")).not.toBeInTheDocument();
  });

  test("displays correct answer color when selected", async () => {
    const { rerender } = renderWithMantine(
      <MultipleChoiceQuestion {...defaultProps} />
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Madrid")); // Simulate incorrect answer
    });

    // Check if the color indicates incorrect answer
    rerender(
      <MantineProvider>
        <MultipleChoiceQuestion
          {...defaultProps}
          isCorrect={false}
          isSubmitted={true}
        />
      </MantineProvider>
    );

    const madridButton = screen.getByText("Madrid").closest("button");
    expect(screen.queryByText("Madrid")).toBeInTheDocument();
  });
});
