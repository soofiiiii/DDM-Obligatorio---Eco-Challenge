import { Button, StyleSheet } from "react-native";
import { COLORS } from "../../styles/GlobalStyles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.darkText,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: COLORS.darkText,
    backgroundColor: COLORS.lightGray,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: COLORS.lightGray,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: COLORS.darkText,
  },
  eyeIcon: {
    padding: 12,
  },
  boton: {
    backgroundColor: COLORS.darkGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  botonTexto: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
