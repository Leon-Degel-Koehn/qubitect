import { Devvit, useState } from '@devvit/public-api';
import { Gate, Identity, Level, PlaceholderGate } from '../types.js';
import { stateFromStabilizer } from '../utils.js';
import { Rect } from './rectangle.js';
import { gateLayout } from '../ui/helper.js';
import { Session } from '../levels/types.js';

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

interface GateProps {
  session: Session,
  selectedGateIdx: number,
  gateReplacements: number[],
  replaceGate: Function[],
}

const Gates = (props: GateProps): JSX.Element => {
  let layout = gateLayout(props.session);
  let mappedLayout = layout.map((col) => col.map((gateEntry) => {
    let gate: Gate = gateEntry.gate;
    let idx: number = gateEntry.originalIdx;
    if (props.session.level.greyedOutIndices.includes(idx)) {
      return (
        <zstack borderColor='Periwinkle-500' border='thick'>
          <image
            url={
              props.gateReplacements[idx] >= 0 ?
                props.session.level.availableGates[props.gateReplacements[idx]].assets[0]
                : "placeholder.png"
            }
            imageHeight="40px"
            imageWidth="40px"
            onPress={() => {
              if (props.gateReplacements[idx] == props.selectedGateIdx) {
                props.replaceGate[idx](-1);
              } else {
                props.replaceGate[idx](props.selectedGateIdx);
              }
            }}
          />
        </zstack>
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
  session: Session;
}

export const LevelScreen = (props: LevelScreenProps): JSX.Element => {
  const [selectedGate, selectGate] = useState(-1)
  let gateReplacements = [];
  let replaceGate = [];
  for (let i = 0; i < props.session.level.circuit.gates.length; i++) {
    let temp = useState(-1);
    gateReplacements.push(temp[0]);
    replaceGate.push(temp[1]);
  }
  const numQubits = 2;
  const ketInputStates = stateFromStabilizer(props.session.level.inputState);
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
          <Gates session={props.session} selectedGateIdx={selectedGate} gateReplacements={gateReplacements} replaceGate={replaceGate} />
          <spacer grow shape='invisible' />
          <image
            url="standard_measure.png"
            imageHeight="40px"
            imageWidth="40px"
          />
        </hstack>
      </zstack>
      <spacer grow shape='invisible' />
      {bottomMenu(props.session.level.availableGates, selectedGate, selectGate)}
    </vstack>
  )
}
