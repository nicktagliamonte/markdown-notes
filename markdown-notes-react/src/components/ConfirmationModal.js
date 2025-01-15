import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ConfirmationModal = ({ open, onClose, onConfirm }) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Unsaved Changes</DialogTitle>
      <DialogContent>
        <p>
          You have unsaved changes. Do you want to discard them and switch
          notes?
        </p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ backgroundColor: theme.palette.primary }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{ backgroundColor: theme.palette.primary }}
        >
          Yes, Discard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
