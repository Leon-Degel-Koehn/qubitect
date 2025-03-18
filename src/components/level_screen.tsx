import { Devvit, useState, StateSetter } from '@devvit/public-api';
import { Gate, Identity, KNOWN_STATES, Level } from '../types.js';
import { stateFromStabilizer } from '../utils.js';
import { gateLayout } from '../ui/helper.js';
import { Session } from '../levels/types.js';

const QubitLines = ({ numQubits }: { numQubits: number }): JSX.Element => {
  let lines = [<spacer height="20px" />];
  for (let i = 0; i < numQubits; i++) {
    lines.push(<hstack width="100%" height="1px" borderColor='black' />);
    lines.push(<spacer height="40px" />)
  }
  return <vstack width="100%">{lines}</vstack>;
}

const GateSelectionMenu = (props: GateProps): JSX.Element => {
  return (<hstack
    alignment='center middle'
    gap='medium'
    width='95%'
    height='60px'
    borderColor='black'
    cornerRadius='medium'
  >
    {props.session.level.availableGates.map((gate, idx) => (
      <image
        url={gate.assets[0]}
        imageHeight={props.state.selectedGate >= 0 ? idx == props.state.selectedGate ? 50 : 30 : 40}
        imageWidth={props.state.selectedGate >= 0 ? idx == props.state.selectedGate ? 50 : 30 : 40}
        onPress={() => { props.state.selectGate(idx) }}
      />
    ))}
  </hstack>)
}

interface GateProps {
  session: Session,
  state: LevelScreenState,
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
              props.state.gateReplacements[idx] >= 0 ?
                props.session.level.availableGates[props.state.gateReplacements[idx]].assets[0]
                : "placeholder.png"
            }
            imageHeight="40px"
            imageWidth="40px"
            onPress={() => {
              const newGateIdx = props.state.gateReplacements[idx] == props.state.selectedGate ? -1 : props.state.selectedGate;
              props.state.replaceGate[idx](newGateIdx);
              props.session.changeDisplayedGate(idx, newGateIdx, props.state.updateOutputStates);
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

const OutputStates = ({ state }: { state: LevelScreenState }): JSX.Element => {
  return state.outputStates.map((ketStateIdx) => (
    <image
      url={KNOWN_STATES[ketStateIdx].asset}
      imageHeight="40px"
      imageWidth="40px"
    />
  ))
}

interface LevelScreenProps {
  session: Session;
}

class LevelScreenState {

  // Global state variables
  selectedGate: number; // index in the level's available gates
  gateReplacements: number[]; // indices in the level's available gates
  outputStates: number[]; // indices in the global KNOWN_STATES

  // Global setters of state variables
  replaceGate: StateSetter<number>[];
  selectGate: StateSetter<number>;
  updateOutputStates: StateSetter<Array<number>>;

  constructor(session: Session) {
    [this.selectedGate, this.selectGate] = useState(-1);
    const initialOutput = stateFromStabilizer(session.displayedCircuit.simulate(session.level.inputState))
      .map((ketState) => KNOWN_STATES.indexOf(ketState));
    [this.outputStates, this.updateOutputStates] = useState(initialOutput);
    this.gateReplacements = [];
    this.replaceGate = [];
    for (let i = 0; i < session.level.circuit.gates.length; i++) {
      let temp = useState(-1);
      this.gateReplacements.push(temp[0]);
      this.replaceGate.push(temp[1]);
    }
  }
}

export const LevelScreen = (props: LevelScreenProps): JSX.Element => {
  const state = new LevelScreenState(props.session);
  const numQubits = props.session.level.circuit.qubits;
  const ketInputStates = stateFromStabilizer(props.session.level.inputState);
  return (
    <vstack alignment='center middle' height='100%' gap='large' padding='medium' backgroundColor='white'>
      <spacer grow shape='invisible' />
      <zstack width="100%">
        <QubitLines numQubits={numQubits} />
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
          <Gates session={props.session} state={state} />
          <spacer grow shape='invisible' />
          <vstack>
            <OutputStates state={state} />
          </vstack>
        </hstack>
      </zstack>
      <spacer grow shape='invisible' />
      <GateSelectionMenu session={props.session} state={state} />
    </vstack>
  )
}
