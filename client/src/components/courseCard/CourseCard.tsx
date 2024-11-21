import { Box, Button, Center, Paper, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import classes from "./courseCard.module.css";

type courseCardProps = {
  courseId: string;
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
          <Link to={`/course/${props.courseId}`}>
            <Button variant="white" color="dark" radius="lg">
              Study
            </Button>
          </Link>
        </Box>
      </Center>
    </Paper>
  );
};

export default courseCard;
