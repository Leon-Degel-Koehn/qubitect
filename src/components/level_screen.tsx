import { Devvit, useState } from '@devvit/public-api';
import { Gate, Identity, Level, PlaceholderGate } from '../types.js';
import { stateFromStabilizer } from '../utils.js';
import { Rect } from './rectangle.js';
import { gateLayout } from '../ui/helper.js';

function qubitLines(numQubits: number) {
  let lines = [<spacer height="20px" />];
  for (let i = 0; i < numQubits; i++) {
    lines.push(<hstack width="100%" height="1px" borderColor='black' />);
    lines.push(<spacer height="40px" />)
  }
  return <vstack width="100%">{lines}</vstack>;
}

const bottomMenu = (gates: Gate[], selectedGate: number, selectGate: Function) => {
  let mappedGates = [];
  for (let i = 0; i < gates.length; i++) {
    mappedGates.push({ 'gateAsset': gates[i].assets[0], 'idx': i });
  }
  return (<hstack
    alignment='center middle'
    gap='medium'
    width='95%'
    height='60px'
    borderColor='black'
    cornerRadius='medium'
  >
    {mappedGates.map(({ gateAsset: gateAsset, idx: idx }) => (
      <image
        url={gateAsset}
        imageHeight={selectedGate >= 0 ? idx == selectedGate ? 50 : 30 : 40}
        imageWidth={selectedGate >= 0 ? idx == selectedGate ? 50 : 30 : 40}
        onPress={() => { selectGate(idx) }}
      />
    ))}
  </hstack>)
}

const Gates = (props: LevelScreenProps): JSX.Element => {
  let layout = gateLayout(props.level);
  let mappedLayout = layout.map((col) => col.map((gate) => {
    if (gate instanceof PlaceholderGate) {
      return (
        <Rect
          width={40}
          height={40}
          backgroundColor="rgba(196, 185, 191, 0.48)"
        />
      )
    }
    if (gate instanceof Identity) {
      return (
        <spacer height="40px" />
      )
    } else {
      return (
        <image
          //TODO: assets for multiqubit gate not supported, therefore [0] access for now
          url={gate.assets[0]}
          imageHeight="40px"
          imageWidth="40px"
        />
      )
    }
  }));
  return (
    <hstack gap='large'>
      {mappedLayout.map((column) => (
        <vstack>
          {column}
        </vstack>
      ))}
    </hstack>
  );
}

interface LevelScreenProps {
  level: Level;
}

export const LevelScreen = (props: LevelScreenProps): JSX.Element => {
  const [selectedGate, selectGate] = useState(-1)
  const numQubits = 2;
  const ketInputStates = stateFromStabilizer(props.level.inputState);
  return (
    <vstack alignment='center middle' height='100%' gap='large' padding='medium' backgroundColor='white'>
      <spacer grow shape='invisible' />
      <zstack width="100%">
        {qubitLines(numQubits)}
        <hstack width="100%">
          <vstack>
            {ketInputStates.map((ketState) => (
              <image
                url={ketState.asset}
                imageHeight="40px"
                imageWidth="40px"
              />
            ))}
          </vstack>
          <Gates level={props.level} />
          <spacer grow shape='invisible' />
          <image
            url="standard_measure.png"
            imageHeight="40px"
            imageWidth="40px"
          />
        </hstack>
      </zstack>
      <spacer grow shape='invisible' />
      {bottomMenu(props.level.availableGates, selectedGate, selectGate)}
    </vstack>
  )
}
