import { Button, Container, Flex, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Course, FileRef } from '../../types';
import CoursePageFileUpload from './CoursePageFileUpload';

interface props {
  selectedCourse: Course;
}

const CoursePage = ({ selectedCourse }: props) => {
  const [files, setFiles] = useState<FileRef[]>(selectedCourse.filesRef);

  useEffect(() => {
    setFiles(selectedCourse.filesRef);
  }, [selectedCourse]);

  return (
    <>
      <Container fluid ml={'70px'} mt={'60px'}>
        <Flex direction={'row'} gap={'400px'}>
          <Flex direction={'column'} w={'500px'}>
            <Title order={1} fw={800} fz={'44px'}>
              {selectedCourse.courseCode}
            </Title>
            <Title order={3} fw={500} fz={'30px'}>
              {selectedCourse.courseName}
            </Title>
            <Title order={2} fz={'28px'} fw={500} mt={'75px'} mb={'15px'}>
              Upload
            </Title>

            <CoursePageFileUpload selectedCourse={selectedCourse} />
          </Flex>

          <Flex direction={'column'} mt={'180px'}>
            <Title order={2} fz={'28px'} fw={500}>
              Files Uploaded
            </Title>
            {files &&
              files.map((file, index) => {
                return <Text key={index}>{file.fileName}</Text>;
              })}
          </Flex>
        </Flex>

        <Flex direction={'row'} mt={'250px'}>
          <Button
            maw={'250px'}
            variant="gradient"
            gradient={{ from: '#2FAED790', to: '#0280C7', deg: 180 }}
            size="xl"
            radius={10}
          >
            <Text size="24px" fw={600}>
              Create Quiz
            </Text>
          </Button>

          <Button
            ml={'100px'}
            maw={'340px'}
            variant="gradient"
            gradient={{ from: '#2FAED790', to: '#0280C7', deg: 180 }}
            size="xl"
            radius={10}
          >
            <Text size="24px" fw={600}>
              Create Note Summary
            </Text>
          </Button>
        </Flex>
      </Container>
    </>
  );
};

export default CoursePage;
