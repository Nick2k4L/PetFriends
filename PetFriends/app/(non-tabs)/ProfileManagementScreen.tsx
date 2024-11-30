import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Alert,
  Modal,
} from 'react-native';
import { getAuth, updateProfile, updateEmail, updatePassword, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider, User, onAuthStateChanged, verifyBeforeUpdateEmail } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';

export default function UserManagementScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  // Password is sensitive, so we display placeholder characters
  const [password, setPassword] = useState('******');

  const [editingField, setEditingField] = useState('');
  const [newValue, setNewValue] = useState('');
  const [currentPassword, setCurrentPassword] = useState(''); // For re-authentication
  const [isVerified, setIsVerified] = useState(false); // Track email verification

  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || '');
      setEmail(user.email || '');
      setIsVerified(user.emailVerified); // Initialize verification state
    }
  }, [user]);

  
  const handleReauthenticate = async (password: string) => {
    try {
      if(user){
      const credential = EmailAuthProvider.credential(user.email as string, password);
      await reauthenticateWithCredential(user, credential);
      return true;
      }
    } catch (error) {
      Alert.alert('Re-authentication Failed');
      return false;
    }
  };

  const handleChangeField = async (field: string, value: string) => {
    try {
      if (user) {
        // Re-authenticate before updating sensitive information
        Alert.prompt(
          'Re-authenticate',
          'Please enter your current password to proceed.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => setEditingField(''),
            },
            {
              text: 'OK',
              onPress: async (input) => {
                if (!input) {
                  Alert.alert('Error', 'Password cannot be empty.');
                  return;
                }
                 const isReauthenticated = await handleReauthenticate(input);
                 if (!isReauthenticated) return;

                try {
                  if (field === 'username') {
                    await updateProfile(user, { displayName: value });
                    setUsername(value);
                    Alert.alert('Success', 'Username updated successfully.');
                  } else if (field === 'email') {
                    
                    await verifyBeforeUpdateEmail(user, value);
                    
                    Alert.alert(
                      'Verification Email Sent',
                      'Please check your inbox to verify your new email address!',
                    );

                    setEmail(value);

                  } else if (field === 'password') {
                    await updatePassword(user, value);
                    Alert.alert('Success', 'Password updated successfully.');
                  }
                } catch (error) {
                  Alert.alert('Update Failed');
                  console.log(error);
                } finally {
                  setEditingField('');
                  setNewValue('');
                  setCurrentPassword('');
                }
              },
            },
          ],
          'secure-text'
        );
      }
    } catch (error) {
      Alert.alert('Error');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/LoginScreen');
    } catch (error) {
      Alert.alert('Logout Error');
    }
  };

  const handleAccountTermination = async () => {
    try {
      // Re-authenticate before deleting account
      Alert.prompt(
        'Re-authenticate',
        'Please enter your password to confirm account termination.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async (input) => {
              if (!input) {
                Alert.alert('Error', 'Password cannot be empty.');
                return;
              }
              const isReauthenticated = await handleReauthenticate(input);
              if (!isReauthenticated) return;

              try {
                if(user){
                await user.delete();
                Alert.alert('Success', 'Account terminated successfully.');
                router.replace('/LoginScreen');
                }
              } catch (error) {
                Alert.alert('Error');
              }
            },
          },
        ],
        'secure-text'
      );
    } catch (error) {
      Alert.alert('Error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Manager</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Username"
          value={username}
          editable={false}
        />
        <Button
          mode="contained"
          style={styles.changeButton}
          buttonColor="#333333"
          labelStyle={styles.changeButtonLabel}
          onPress={() => {
            setEditingField('username');
            setNewValue('');
          }}
        >
          Change
        </Button>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Email"
          value={email}
          editable={false}
        />
        <Button
          mode="contained"
          style={styles.changeButton}
          buttonColor="#333333"
          labelStyle={styles.changeButtonLabel}
          onPress={() => {
            setEditingField('email');
            setNewValue('');
          }}
        >
          Change
        </Button>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholderTextColor="grey"
          placeholder="Password"
          value={password}
          editable={false}
          secureTextEntry={true}
        />
        <Button
          mode="contained"
          style={styles.changeButton}
          buttonColor="#333333"
          labelStyle={styles.changeButtonLabel}
          onPress={() => {
            setEditingField('password');
            setNewValue('');
          }}
        >
          Change
        </Button>
      </View>

      {/* Spacer to push buttons further down */}
      <View style={{ flex: 1 }} />

      <Button
        mode="contained"
        style={styles.doneButton}
        buttonColor="#333333"
        onPress={() => router.replace('/Swiper')}
      >
        Done? Click here!
      </Button>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.actionButton}
          buttonColor="#333333"
          onPress={handleLogout}
        >
          Log Out
        </Button>
        <Button
          mode="contained"
          style={styles.actionButton}
          buttonColor="#333333"
          onPress={handleAccountTermination}
        >
          Terminate Account
        </Button>
      </View>

      {/* Modal for changing information */}
      {editingField !== '' && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={editingField !== ''}
          onRequestClose={() => {
            setEditingField('');
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter new {editingField}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={`New ${editingField}`}
                value={newValue}
                onChangeText={setNewValue}
                secureTextEntry={editingField === 'password'}
              />
              <View style={styles.modalButtons}>
                <Button
                  mode="contained"
                  style={styles.modalButton}
                  onPress={() => {
                    setEditingField('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  style={styles.modalButton}
                  onPress={async () => {
                    if (!newValue) {
                      Alert.alert('Error', `Please enter a new ${editingField}.`);
                      return;
                    }
                    await handleChangeField(editingField, newValue);
                  }}
                >
                  Confirm
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E5E5E5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 75,
    marginTop: 78,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50, // Consistent height
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  changeButton: {
    flex: 1,
    height: 50, // Same height as the input
    marginLeft: 10,
    justifyContent: 'center',
    borderRadius: 1,
  },
  changeButtonLabel: {
    fontSize: 14, // Adjust font size as needed
  },
  doneButton: {
    borderRadius: 1,
    height: 50,
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionButton: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 1,
    height: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: '#fff',
    padding: 35,
    borderRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    height: 50,
    justifyContent: 'center',
  },
});
