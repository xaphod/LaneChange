import { Alert } from 'react-native';
import { openTerms, openPrivacy } from 'app/utils/constants';

export default showTermsAlert = (onPress) => {
  Alert.alert(
    'Almost There',
    'When you use this app, it uploads data to our servers. We take your security & privacy seriously. By continuing to use this app you are agreeing to the Terms and Conditions and the Privacy Policy.',
    [
      {
        text: 'Continue',
        onPress: () => onPress(),
      },
      {
        text: 'Terms and Conditions',
        onPress: () => openTerms(),
      },
      {
        text: 'Privacy Policy',
        onPress: () => openPrivacy(),
      },
    ],
  );
};
