import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking}  from 'react-native';
import { emailSubject } from 'app/utils/constants';

export const IOSPreferredMailClient = {
  NATIVE: 'native',
  GMAIL: 'gmail',
};

const buildUrl = (toUnescaped, subjectUnescaped, bodyUnescaped, preferredIOSClient) => {
  const to = encodeURIComponent(toUnescaped);
  const subject = encodeURIComponent(subjectUnescaped);
  let body = encodeURIComponent(bodyUnescaped);
  const bodyNoNewLinesUnescaped = bodyUnescaped.replace(/\n/g, ' . . . ');
  console.log(`DEBUG mail buildURL(): preferredIOSClient is ${preferredIOSClient}`);

  return Platform.select({
    ios: () => {
      switch (preferredIOSClient) {
        case IOSPreferredMailClient.GMAIL:
          body = encodeURIComponent(bodyNoNewLinesUnescaped);
          return `googlegmail:///co?subject=${subject}&body=${body}&to=${to}`;
        case IOSPreferredMailClient.NATIVE:
        default:
          return `mailto:${to}?subject=${subject}&body=${body}`;
      }
    },
    android: () => `mailto:${to}?subject=${subject}&body=${body}`,
  })();
};

const sendMail = async (to, subject, body, preferredIOSClient) => {
  const url = buildUrl(to, subject, body, preferredIOSClient);
  console.log(`DEBUG sendMail(): url is ${url}`);

  let retval = await Linking.canOpenURL(url);
  console.log(`DEBUG sendMail() canOpenURL returned ${retval}`);
  if (!retval) {
    return retval;
  }
  await Linking.openURL(url)
    .catch((err) => {
      console.log(`DEBUG sendMail() catch error: ${err}`);
      retval = false;
    });
  return retval;
};

/*
CLIENT SELECTION LOGIC
Android: always use multi-line mailto://
iOS: user selects mail client: native or GMail, up front. If GMail, make body single line with spaces.
*/

// returns success: bool
export const openEmail = async (emailAddress, report, preferredIOSClient) => {
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
  let retval = true;
  retval = await sendMail(emailAddress, subject, body, preferredIOSClient)
    .catch((e) => {
      console.log('DEBUG emailReport: sendMail ERROR');
      console.log(e);
      retval = false;
    });
  console.log(`DEBUG emailReport returning ${retval}`);
  return retval;
};
