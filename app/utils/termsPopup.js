import { Alert } from 'react-native';
import { openTerms, openPrivacy } from 'app/utils/constants';

const showInnerAlert = (onPress) => {
  Alert.alert(
    'Read',
    'Please take a moment to read the following.',
    [
      {
        text: 'Terms and Conditions',
        onPress: () => openTerms(),
      },
      {
        text: 'Privacy Policy',
        onPress: () => openPrivacy(),
      },
      {
        text: 'Accept and continue',
        onPress: () => onPress(),
        style: 'cancel',
      },
    ],
  );
};

export default showTermsAlert = (onPress) => {
  Alert.alert(
    'Almost There',
    'When you use this app, it uploads data to our servers. We take your security & privacy seriously. By continuing to use this app you are agreeing to the Terms and Conditions and the Privacy Policy which can be updated at any time.',
    [
      {
        text: 'Read...',
        onPress: () => showInnerAlert(onPress),
      },
      {
        text: 'Accept and continue',
        onPress: () => onPress(),
        style: 'cancel',
      },
    ],
  );
};
