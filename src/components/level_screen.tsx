import { Devvit, useState, StateSetter } from '@devvit/public-api';
import { Gate, Identity, KNOWN_STATES, UnknownKetState } from '../types.js';
import { stateFromStabilizer } from '../utils.js';
import { GateLayout, gateLayout } from '../ui/helper.js';
import { Session } from '../levels/types.js';
import { Direction, Line } from './line.js';
import { InfoPopup } from './InfoPopup.js';

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
        onPress={() => {
          if (props.state.selectedGate === idx) {
            props.state.setPopupText(gate.helpText);
          } else {
            props.state.selectGate(idx);
          }
        }}
      />
    ))}
  </hstack>)
}

interface GateProps {
  session: Session,
  state: LevelScreenState,
}

const Gates = ({ props, layout }: { props: GateProps, layout: GateLayout }): JSX.Element => {
  // make sure the internal representation of the gates is up to date
  props.state.gateReplacements.forEach((gateReplacement, idx) => {
    props.session.changeDisplayedGate(idx, gateReplacement);
  })
  let mappedLayout = layout.map((col) => col.map((gateEntry, rowIdx) => {
    let gate: Gate = gateEntry.gate;
    let idx: number = gateEntry.originalIdx;
    // no gate, blank space
    // special case, if there was a greyed out gate on the previous qubit that has
    // been replaced with a two qubit gate
    if (gate instanceof Identity) {
      const prevGate = rowIdx > 0 ? col[(rowIdx - 1)] : col[col.length - 1];
      let lastIdx = -1;
      if (prevGate) {
        lastIdx = prevGate.originalIdx;
      }
      if (props.session.level.greyedOutIndices.includes(lastIdx) && props.state.gateReplacements[lastIdx] >= 0
        && props.session.level.availableGates[props.state.gateReplacements[lastIdx]].assets.length == 2) {
        return (
          <zstack alignment='center'>
            <Line length={40} thickness={1} direction={Direction.Vertical} />
            <image
              url={props.session.level.availableGates[props.state.gateReplacements[lastIdx]].assets[1]}
              imageHeight="40px"
              imageWidth="40px"
            />
          </zstack>
        )
      }
      console.log(gate, "is identity");
      return (
        <spacer height="40px" />
      )
    }
    // regular gate, no interaction from the user possible
    if (!(props.session.level.greyedOutIndices.includes(idx))) {
      const res = (
        <image
          url={gate.assets[gateEntry.idxInAffectedQubits]}
          imageHeight="40px"
          imageWidth="40px"
        />
      )
      let wrapper = null
      if (gate.assets.length > 1) {
        if (gateEntry.idxInAffectedQubits > 0) {
          wrapper = (<Line length={40} thickness={1} direction={Direction.Vertical} />)
        } else {
          if (gate.affectedQubits[1] > gate.affectedQubits[0]) {
            wrapper = <vstack><spacer height="20px" /><Line length={20} thickness={1} direction={Direction.Vertical} /></vstack>
          } else {
            wrapper = <vstack><Line length={20} thickness={1} direction={Direction.Vertical} /><spacer height="20px" /></vstack>
          }
        }
      }
      return <zstack alignment="center">{wrapper}{res}</zstack>;
    }
    // gate is at a spot with user interaction possible
    // 1. current entry is not the interactive one and none is placed
    if (gateEntry.idxInAffectedQubits > 0 && props.state.gateReplacements[idx] < 0) {
      return (
        <spacer height="40px" />
      )
    }
    const replacement = props.state.gateReplacements[idx];
    let asset = "placeholder.png";
    if (replacement >= 0) {
      const assetsList = props.session.level.availableGates[replacement].assets;
      if (gateEntry.idxInAffectedQubits >= assetsList.length) {
        return (
          <spacer height="40px" />
        )
      }
      asset = assetsList[gateEntry.idxInAffectedQubits];
    }
    const controlBeforeTarget = props.session.displayedCircuit.gates[idx].affectedQubits.length > 1 &&
      props.session.displayedCircuit.gates[idx].affectedQubits[0] < props.session.displayedCircuit.gates[idx].affectedQubits[1]
    // 2. current entry is the interactive one or has been replaced
    return (
      <zstack borderColor='Periwinkle-500' border={gateEntry.idxInAffectedQubits > 0 ? 'none' : 'thick'} alignment='center'>
        {replacement >= 0 && props.session.level.availableGates[props.state.gateReplacements[idx]].affectedQubits.length > 1 ?
          asset === props.session.level.availableGates[props.state.gateReplacements[idx]].assets[0] ?
            controlBeforeTarget ?
              <vstack><spacer height="20px" /><Line length={20} thickness={1} direction={Direction.Vertical} /></vstack>
              : <vstack><Line length={20} thickness={1} direction={Direction.Vertical} /><spacer height="20px" /></vstack>
            : <Line length={40} thickness={1} direction={Direction.Vertical} />
          : ""}
        <image
          url={asset}
          imageHeight="40px"
          imageWidth="40px"
          onPress={() => {
            if (gateEntry.idxInAffectedQubits > 0) return;
            const newGateIdx = props.state.gateReplacements[idx] == props.state.selectedGate ? -1 : props.state.selectedGate;
            props.state.replaceGate[idx](newGateIdx);
            props.session.changeDisplayedGate(idx, newGateIdx);
            props.session.updateOutput(props.state.updateOutputStates);
          }}
        />
      </zstack>
    )
  }));
  return (
    <hstack alignment="center" gap='large' grow>
      {mappedLayout.map((column) => (
        <vstack>
          {column}
        </vstack>
      ))}
    </hstack>
  );
}

const OutputStates = (props: GateProps): JSX.Element => {
  return props.state.outputStates.map((ketStateIdx, qubit) => {
    const ketState = ketStateIdx >= 0 ? KNOWN_STATES[ketStateIdx] : UnknownKetState;
    return (
      <zstack backgroundColor='white' borderColor={ketStateIdx == props.session.optimalOutput[qubit] ? 'success-plain' : 'danger-plain'} border='thick'>
        <image
          url={ketState.asset}
          imageHeight={`${ketState.stabilizer[0].x_part.length * 40}px`}
          imageWidth="40px"
          onPress={() => {
            props.state.setPopupText(ketState.helpText || "");
          }}
        />
      </zstack>
    )
  })
}

interface LevelScreenProps {
  session: Session;
}

export class LevelScreenState {

  // Global state variables
  selectedGate: number; // index in the level's available gates
  gateReplacements: number[]; // indices in the level's available gates
  outputStates: number[]; // indices in the global KNOWN_STATES
  popupText: string;

  // Global setters of state variables
  replaceGate: StateSetter<number>[];
  selectGate: StateSetter<number>;
  updateOutputStates: StateSetter<Array<number>>;
  setPopupText: StateSetter<string>;

  constructor(session: Session) {
    [this.selectedGate, this.selectGate] = useState(-1);
    [this.popupText, this.setPopupText] = useState("");
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
  const layout = gateLayout(props.session);
  return (
    <zstack alignment='center' width='100%' height='100%' gap='large' padding='medium' backgroundColor='white'> {/* To allow for popups */}
      <vstack alignment='center middle' width='100%' height='100%' gap='large' padding='medium' backgroundColor='white'>
        {props.session.level.title ? (<text style='heading' color='global-black'>{props.session.level.title}</text>) : (<spacer grow shape='invisible' />)}
        <zstack width="100%">
          <QubitLines numQubits={numQubits} />
          <hstack width="100%">
            <vstack>
              {ketInputStates.map((ketState) => (
                <image
                  url={ketState.asset}
                  imageHeight={`${ketState.stabilizer[0].x_part.length * 40}px`}
                  imageWidth="40px"
                  onPress={() => {
                    state.setPopupText(ketState.helpText || "");
                  }}
                />
              ))}
            </vstack>
            <Gates props={{ session: props.session, state: state }} layout={layout} />
            <spacer grow shape='invisible' />
            <vstack>
              <OutputStates session={props.session} state={state} />
            </vstack>
          </hstack>
        </zstack>
        <vstack grow alignment='center middle'>
          <text>{props.session.level.objective || ''}</text>
        </vstack>
        <GateSelectionMenu session={props.session} state={state} />
      </vstack>
      <InfoPopup
        visible={!!state.popupText}
        setVisible={(val: boolean) => { state.setPopupText(val ? state.popupText : "") }}
        text={state.popupText}
      />
    </zstack>
  )
}
