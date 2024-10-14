import { Grid, Group, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import { Course } from "../../types";
import { handleCourseDelete } from "../../utilities/fileUploadUtilities";

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
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  return (
    <>
      <Stack
        h={"100vh"}
        w={"15%"}
        justify="flex-start"
        gap={"0px"}
        bg={"#FAFAFA"}
        style={{
          borderRight: "solid 1px rgba(90, 90, 90, 0.65)",
        }}
      >
        <Group
          mt={"6px"}
          w={"97%"}
          mx={"auto"}
          pb={"5px"}
          mb={"15px"}
          style={{
            borderBottom: "solid 1px rgba(90, 90, 90, 0.65)",
          }}
        >
          <Text fz={"30px"} fw={"600"} pl={"14px"}>
            Courses
          </Text>
        </Group>

        {courses.map((course) => (
          <Link key={course.id} to={`/course/${course.id}`}>
            <Group
              onClick={() => onSelectCourse(course)}
              className={`showTrash course-item ${
                course.id === selectedCourseId ? "selected" : ""
              }`}
              h={"40px"}
              mx={"12px"}
              style={{
                borderRadius: "4px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                verticalAlign: "center",
              }}
            >
              <Text
                pl={"8px"}
                fz={"20px"}
                lts={"0.5px"}
                fw={"400"}
                // pt="4px"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexGrow: 1,
                  maxWidth: "calc(97% - 40px)",
                }}
              >
                {course.courseCode}
              </Text>
              <IconTrash
                className="hide"
                stroke={2}
                color="red"
                style={{
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  marginTop: "6px",
                  marginRight: "5px",
                }}
                onClick={() =>
                  handleCourseDelete(currentUser!.uid, course.id).then(() =>
                    navigate("/studyspot")
                  )
                }
              />
            </Group>
          </Link>
        ))}
      </Stack>
    </>
  );
};

export default CourseDashboardSidebar;
