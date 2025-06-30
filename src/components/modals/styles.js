import { StyleSheet } from 'react-native';
import { COLORS } from '../../styles/GlobalStyles';

export default StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalView: {
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  thumbnailList: {
    marginVertical: 10,
  },
  thumbnailWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  overlayIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.darkOverlay,
    borderRadius: 12,
    padding: 2,
  },
  addPhotoButton: {
    backgroundColor: COLORS.accentBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 8,
  },
  addPhotoButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: COLORS.mediumGray,
  },
  saveButton: {
    backgroundColor: COLORS.primaryGreen,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
