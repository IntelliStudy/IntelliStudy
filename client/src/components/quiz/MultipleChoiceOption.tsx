import { Group, Radio, Text } from "@mantine/core";
import { McqOption } from "../../types/quiz";

interface props {
  option: McqOption;
  checked: boolean;
  setChecked: () => void;
  optionColour: string | undefined;
  disabled: boolean;
}

const MultipleChoiceOption = ({
  option,
  checked,
  setChecked,
  optionColour,
  disabled,
}: props) => {
  const borderWidth = optionColour !== undefined ? "2px" : "";

  return (
    <Radio.Card
      radius={6}
      checked={checked}
      onClick={setChecked}
      py="10px"
      px="20px"
      my="7px"
      bg="white"
      disabled={disabled}
      style={{
        boxShadow: "rgba(0, 0, 0, 0.15) 0px 1px 3px 0px",
        borderColor: optionColour,
        borderWidth: borderWidth,
      }}
    >
      <Group wrap="nowrap" align="flex-start">
        <Text>{option.value}</Text>
        <Radio.Indicator ml="auto" color="#68D1F2" />
      </Group>
    </Radio.Card>
  );
};

export default MultipleChoiceOption;
