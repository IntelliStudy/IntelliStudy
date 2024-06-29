import {
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  MantineProvider,
  Select,
  Stack,
  Text,
  Title,
  createTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

const theme = createTheme({
  cursorType: 'pointer',
  components: {
    Checkbox: {
      styles: () => ({
        label: {
          fontSize: '16px',
          fontWeight: '500',
        },
      }),
    },
    Select: {
      styles: () => ({
        root: {
          width: '28%',
          paddingTop: '7px',
        },
      }),
    },
  },
});

const CreateQuizModal = () => {
  const quizCountOptions = Array.from({ length: 10 }, (_, i) =>
    (i + 1).toString()
  );

  const quizForm = useForm({
    initialValues: {
      questionTypes: [
        {
          id: '1',
          label: 'Multiple Choice Questions',
          checked: false,
          count: 0,
        },
        { id: '2', label: 'Short Answer Questions', checked: false, count: 0 },
        {
          id: '3',
          label: 'True and False Questions',
          checked: false,
          count: 0,
        },
        { id: '4', label: 'Long Answer Questions', checked: false, count: 0 },
      ],
      duration: [{ label: 'Timed', checked: false, duration: 0 }],
    },
  });

  const questionTypeCheckBoxes = quizForm.values.questionTypes.map(
    (value, index) => (
      <Flex key={index} direction={'column'} mb={'10px'}>
        <Checkbox
          key={index}
          label={value.label}
          checked={value.checked}
          onChange={(event) =>
            quizForm.setFieldValue(
              `questionTypes.${index}.checked`,
              event.currentTarget.checked
            )
          }
        />
        {value.checked && (
          <Select
            placeholder="Number of questions"
            data={quizCountOptions}
            value={value.count.toString()}
            onChange={(selectedValue) =>
              quizForm.setFieldValue(
                `questionTypes.${index}.count`,
                parseInt(selectedValue ?? '0', 10)
              )
            }
          />
        )}
      </Flex>
    )
  );

  const durationCheckBoxes = quizForm.values.duration.map((value, index) => (
    <Flex key={index} direction={'column'}>
      <Checkbox
        key={index}
        label={value.label}
        checked={value.checked}
        onChange={(event) =>
          quizForm.setFieldValue(
            `duration.${index}.checked`,
            event.currentTarget.checked
          )
        }
      />
      {value.checked && (
        <Select
          placeholder="Duration"
          data={quizCountOptions}
          value={value.duration.toString()}
          onChange={(selectedValue) =>
            quizForm.setFieldValue(
              `duration.${index}.duration`,
              parseInt(selectedValue ?? '0', 10)
            )
          }
        />
      )}
    </Flex>
  ));

  return (
    <>
      <MantineProvider theme={theme}>
        <Container>
          <Divider size={'sm'} w={'96%'} mt={0} />

          <Flex direction={'column'} pt={'25px'}>
            <Title order={3} fw={500} mb={'20px'}>
              Question Format
            </Title>

            <form onSubmit={quizForm.onSubmit((values) => console.log(values))}>
              <Stack gap={'md'}>
                {questionTypeCheckBoxes}

                <Title order={3} fw={500}>
                  Duration
                </Title>

                {durationCheckBoxes}

                <Flex justify={'right'} mt={'20px'} mb={'20px'} mr={'15px'}>
                  <Button
                    type="submit"
                    variant="gradient"
                    gradient={{ from: '#2FAED7', to: '#0280C7', deg: 180 }}
                    size="md"
                    radius={10}
                  >
                    <Text size="20px" fw={600}>
                      Create
                    </Text>
                  </Button>
                </Flex>
              </Stack>
            </form>
          </Flex>
        </Container>
      </MantineProvider>
    </>
  );
};

export default CreateQuizModal;
