import React from 'react';
import { Stack, Text, FontWeights, PrimaryButton, Link, StackItem } from 'office-ui-fabric-react';
import { msalApp } from './auth';
import { AuthResponse } from 'msal';
import { AppState } from './RootReducer'
import { Dispatch } from 'redux';
import { OPEN_SIGNIN_DIALOG_COMMAND } from './auth/actions';
import { connect } from 'react-redux';
import { OnlineMeeting } from './meeting-creator/models';


interface CopyMeetingPageProps {
  meeting: OnlineMeeting,
  onCopyToClipboard: (meeting?: OnlineMeeting) => {}
}

const mapStateToProps = (state : AppState) => ({
  meeting: state.meeting.createdMeeting
}) as Partial<CopyMeetingPageProps>;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onCopyToClipboard: (meeting?: OnlineMeeting) => {
    const str = document.getElementById('copy')?.innerHTML || 'Failed to copy'
    function listener(e : ClipboardEvent) {
      if (!e || !e.clipboardData) { 
        return
      }
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);

  },

}) as Partial<CopyMeetingPageProps>;

function CopyMeetingPageComponent(props: Partial<CopyMeetingPageProps>) {
  const onCopyToClipboard = props.onCopyToClipboard ?? (() => {});
  
  return (
    <Stack
    className="container"
    verticalFill
    tokens={{
      childrenGap: 35
    }}>
      <Stack.Item align="center" className="meetingCardContainer">
        <Text block variant="xLarge" className="meetingCardHeader">New Meeting link created & copied</Text>
        <div className="meetingCardBody">
          <Link href={props.meeting?.joinWebUrl} className="teamsLink meetingCardUrl">Join Microsoft Teams Meeting</Link>
          
          <div className="meetingCardDialInfo">
            <Link href={props.meeting?.dialinUrl} className="teamsLink">
              <Text variant="medium">{props.meeting?.tollNumber}</Text>
            </Link>
          </div>

          <div className="meetingCardID">
            <Text>Conference ID: {props.meeting?.conferenceId}</Text>
          </div>

        </div>
    <PrimaryButton className="teamsButton copyButton" text="Copy" onClick={() => onCopyToClipboard(props.meeting)}/>
      </Stack.Item>
  </Stack>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyMeetingPageComponent);