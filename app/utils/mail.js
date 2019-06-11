import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking}  from 'react-native';
import { emailToAddress, emailSubject } from 'app/utils/constants';

export const IOSPreferredMailClient = {
  NATIVE: 'native',
  GMAIL: 'gmail',
};

const buildUrl = (toUnescaped, subjectUnescaped, bodyUnescaped, preferredIOSClient) => {
  const to = encodeURIComponent(toUnescaped);
  const subject = encodeURIComponent(subjectUnescaped);
  const body = encodeURIComponent(bodyUnescaped);

  // TODO: update body to be a single line for iOS + GMAIL case

  return Platform.select({
    ios: () => {
      switch (preferredIOSClient) {
        case IOSPreferredMailClient.GMAIL:
          return `googlegmail:///co?subject=${subject}&body=${body}&to=${to}`;
        case IOSPreferredMailClient.NATIVE:
        default:
          return `mailto:${to}?subject=${subject}&body=${body}`;
      }
    },
    android: () => `mailto:${to}?subject=${subject}&body=${body}`,
  })();
};

const sendMail = (to, subject, body, preferredIOSClient) => {
  const url = buildUrl(to, subject, body, preferredIOSClient);
  console.log(`DEBUG sendMail(): url is ${url}`);

  Linking.canOpenURL(url)
    .then((retval) => {
      console.log(`DEBUG sendMail() canOpenURL returned ${retval}`);
      if (retval) {
        Linking.openURL(url)
          .catch((err) => {
            console.log(`DEBUG sendMail() catch error: ${err}`);
          });
      }
    });
};

/*
CLIENT SELECTION LOGIC
Android: always use multi-line mailto://
iOS: user selects mail client: native or GMail, up front. If GMail, make body single line with spaces.
*/

export const emailReport = (report, preferredIOSClient) => {
  const { date, imageLink, notes } = report;
  let { address } = report;
  console.log('DEBUG emailReport, report:');
  console.log(report);
  let subject = emailSubject;
  if (address) {
    subject += ` - ${address}`;
  } else {
    address = '\nPlease fill in the address or intersection where this incident occurred';
  }
  let notesStr = '';
  if (notes) {
    notesStr = `\n\nNotes: ${notes}`;
  }

  const body = `Mobility incident reported by LaneChange\n\nDate: ${date}\n\nAddress: ${address}\n\nPhoto: ${imageLink}${notesStr}`;
  sendMail(emailToAddress, subject, body, preferredIOSClient);
};
