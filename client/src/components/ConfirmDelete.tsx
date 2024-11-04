import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";

export const ConfirmDelete = (
  title: string,
  description: string,
  cancelButton: string,
  confirmButton: string,
  deleteHandler: () => void
) => {
  modals.openConfirmModal({
    title: title,
    centered: true,
    children: <Text size="sm">{description}</Text>,
    labels: { confirm: confirmButton, cancel: cancelButton },
    confirmProps: { color: "red" },
    onConfirm: () => {
      deleteHandler();
    },
  });
};
