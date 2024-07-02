import { Group, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Course } from '../../types';

interface props {
  courses: Course[];
  selectedCourseId: string;
  onSelectCourse: React.Dispatch<React.SetStateAction<Course>>;
}

const CourseDashboardSidebar = ({
  courses,
  selectedCourseId,
  onSelectCourse,
}: props) => {
  return (
    <>
      <Stack
        h={'100vh'}
        w={'15%'}
        justify="flex-start"
        gap={'0px'}
        bg={'#FAFAFA'}
        style={{
          borderRight: 'solid 1px rgba(90, 90, 90, 0.65)',
        }}
      >
        <Group
          mt={'6px'}
          w={'97%'}
          mx={'auto'}
          pb={'5px'}
          mb={'15px'}
          style={{
            borderBottom: 'solid 1px rgba(90, 90, 90, 0.65)',
          }}
        >
          <Text fz={'30px'} fw={'600'} pl={'14px'}>
            Courses
          </Text>
        </Group>

        {courses.map((course) => (
          <Link key={course.id} to={`/course/${course.id}`}>
            <Group
              onClick={() => onSelectCourse(course)}
              className={`course-item ${
                course.id === selectedCourseId ? 'selected' : ''
              }`}
              h={'40px'}
              mx={'12px'}
              style={{
                borderRadius: '4px',
              }}
            >
              <Text pl={'8px'} fz={'20px'} lts={'0.5px'} fw={'400'}>
                {course.courseCode}
              </Text>
            </Group>
          </Link>
        ))}
      </Stack>
    </>
  );
};

export default CourseDashboardSidebar;
