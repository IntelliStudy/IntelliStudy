import { Card, Center, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface AddCourseCardProps {
  onClick?: () => void;
}

const AddCourseCard = (props: AddCourseCardProps) => {
  return (
    <Card
      h="150px"
      w="360px"
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: "pointer", backgroundColor: "#f0f0f0" }}
      onClick={props.onClick}
    >
      <Center style={{ height: "100vh" }}>
        <IconPlus size={48} stroke={1.5} color="#808080" />
      </Center>
      <Center>
        <Text c="#808080">Add Course</Text>
      </Center>
    </Card>
  );
};

export default AddCourseCard;
