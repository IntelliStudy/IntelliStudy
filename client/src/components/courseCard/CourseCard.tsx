import { Paper, Text, Title, Button, Box, Center } from "@mantine/core";
import classes from "./courseCard.module.css";

type courseCardProps = {
  name: string;
  courseCode: string;
};

const courseCard = (props: courseCardProps) => {
  return (
    <Paper shadow="md" p="xl" radius="md" className={classes.card}>
      <Center>
        <Text c="white" size="md" fw="700">
          {props.courseCode}
        </Text>
      </Center>
      <Center>
        <Title order={3} c="white">
          {props.name}
        </Title>
      </Center>
      <Center>
        <Box pt="sm">
          <Button variant="white" color="dark">
            Study
          </Button>
        </Box>
      </Center>
    </Paper>
  );
};

export default courseCard;
