import { Container, Flex, Text } from "@mantine/core";
import { IconCircleArrowLeftFilled } from "@tabler/icons-react";
import { Link } from "react-router-dom";

interface props {
  login: boolean;
}

const GoBackArrow = ({ login }: props) => {
  return (
    <>
      <Container pos={"absolute"} top={"25px"} left={"10px"}>
        <Link to={"/"} key={23}>
          <Flex direction={"row"} align={"center"}>
            <IconCircleArrowLeftFilled
              style={{
                width: "24px",
                height: "24px",
                color: login ? "white" : "black",
              }}
            />
            <Text
              fz={"18px"}
              fw={"500"}
              pl={"5px"}
              c={login ? "white" : "black"}
            >
              Go back
            </Text>
          </Flex>
        </Link>
      </Container>
    </>
  );
};

export default GoBackArrow;
