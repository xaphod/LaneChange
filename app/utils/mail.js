import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, Linking}  from 'react-native';
import { emailSubject } from 'app/utils/constants';
import consolelog from 'app/utils/logging';

export const IOSPreferredMailClient = {
  NATIVE: 'native',
  GMAIL: 'gmail',
};

const buildUrl = (toUnescaped, subjectUnescaped, bodyUnescaped, preferredIOSClient) => {
  const to = encodeURIComponent(toUnescaped);
  const subject = encodeURIComponent(subjectUnescaped);
  let body = encodeURIComponent(bodyUnescaped);
  const bodyNoNewLinesUnescaped = bodyUnescaped.replace(/\n/g, ' . . . ');
  consolelog(`DEBUG mail buildURL(): preferredIOSClient is ${preferredIOSClient}`);

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
  consolelog(`DEBUG sendMail(): url is ${url}`);

  let retval = await Linking.canOpenURL(url);
  consolelog(`DEBUG sendMail() canOpenURL returned ${retval}`);
  if (!retval) {
    return retval;
  }
  await Linking.openURL(url)
    .catch((err) => {
      consolelog(`DEBUG sendMail() catch error: ${err}`);
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
  consolelog('DEBUG emailReport, report:');
  consolelog(report);
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
      consolelog('DEBUG emailReport: sendMail ERROR');
      consolelog(e);
      retval = false;
    });
  consolelog(`DEBUG emailReport returning ${retval}`);
  return retval;
};
