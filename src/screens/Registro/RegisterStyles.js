import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/GlobalStyles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.darkText,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: COLORS.lightGray,
    color: COLORS.darkText,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: COLORS.lightGray,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    color: COLORS.darkText,
  },
  eyeIcon: {
    padding: 10,
  },
  passwordStrengthBarContainer: {
    height: 6,
    width: "100%",
    backgroundColor: COLORS.mediumGray,
    borderRadius: 5,
    marginBottom: 10,
  },
  passwordStrengthBar: {
    height: 6,
    borderRadius: 5,
  },
  passwordErrorText: {
    fontSize: 12,
    color: "red",
    marginBottom: 5,
  },
  datePickerButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerText: {
    color: COLORS.darkText,
    fontSize: 16,
  },
  photoPickerButton: {
    backgroundColor: COLORS.lightGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  photoPickerButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  registerButtonContainer: {
    marginTop: 20,
  },
  registerButton: {
    backgroundColor: COLORS.darkGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },
  registerButtonText: {
    color: COLORS.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  imageSourceOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageSourceContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  imageSourceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.darkText,
  },
  imageSourceOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imageSourceIcon: {
    marginRight: 10,
  },
  imageSourceOptionText: {
    fontSize: 16,
    color: COLORS.darkText,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: COLORS.accentBlue,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  bottomSheetContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    width: "100%",
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },
  iconButton: {
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  tooltipWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  tooltipBox: {
    position: "absolute",
    top: 28, 
    right: 0,
    backgroundColor: "#FFF5F5",
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 100,
    minWidth: 250,
  },
  tooltipTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#D32F2F",
  },
  tooltipItem: {
    color: "#D32F2F",
    fontSize: 13,
  },
});

export default styles;
