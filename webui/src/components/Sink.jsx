import React from 'react';
import classnames from 'classnames';
import { Zoom } from '@material-ui/core';
import {
  usePeer, useSinks, useRegisterForPipe, useUnpipeAction, useShowHidden,
} from '../utils/useSoundSyncState';
import { useEditAudioStreamModal } from './editModal';

import speaker from '../res/speaker.svg';
import nullSinkLogo from '../res/null.svg';
import browserIcon from '../res/browser.svg';
import { nameWithoutHiddenMeta, isHidden } from '../utils/hiddenUtils';
import { HiddenIndicator } from './utils/HiddenIndicator';

const logos = {
  rtaudio: speaker,
  null: nullSinkLogo,
  webaudio: browserIcon,
};

export const Sink = ({ sink }) => {
  const [shouldShow, isSelectedElement, registerForPipe] = useRegisterForPipe('sink', sink);
  const handleUnpipe = useUnpipeAction(sink);
  const peer = usePeer(sink.peerUuid);
  const { handleOpen, anchor, modal } = useEditAudioStreamModal('sink', sink);
  const sinks = useSinks();
  const sinkIndex = sinks.indexOf(sink);
  const sinkLogo = logos[sink.type];
  const hidden = isHidden(sink.name);
  const shouldShowHidden = useShowHidden();

  return (
    <Zoom
      in={!hidden || shouldShowHidden}
      mountOnEnter
      unmountOnExit
      appear
      style={{
        transformOrigin: '100% 50%',
      }}
    >
      <div
        className={classnames('sink-container', !shouldShow && 'not-selectable')}
        style={{ gridRow: sinkIndex + 2 }}
        ref={anchor}
      >
        <div
          className="handle"
          onClick={registerForPipe}
        />
        <a
          className={classnames('unpipe-button delete is-large', { active: sink.pipedFrom && isSelectedElement })}
          onClick={handleUnpipe}
        />
        <div className="box sink-box" onClick={handleOpen}>
          <img src={sinkLogo} className="sink-logo" />
          <p className="name">{nameWithoutHiddenMeta(sink.name)}</p>
          <p className="peer-name">{peer.name}</p>
          {hidden && <HiddenIndicator position="left" />}
        </div>
        {modal}
      </div>
    </Zoom>
  );
};
