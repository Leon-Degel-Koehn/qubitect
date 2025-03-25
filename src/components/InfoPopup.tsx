import { Devvit } from '@devvit/public-api';

type InfoPopupProps = {
  visible: boolean,
  setVisible: (visibility: boolean) => void,
  text: string,
}

export const InfoPopup = (props: InfoPopupProps): JSX.Element => {
  if (!props.visible) return "";
  return (
    <vstack height="70%" width="70%" alignment='top center' backgroundColor='CoolGray-900' cornerRadius='medium'>
      <hstack width="100%" height="50px" alignment='middle end' padding='small'>
        <button appearance='plain' icon="clear" onPress={() => {
          props.setVisible(false);
        }} />
      </hstack>
      <text size="small" maxWidth={100} width={100} height={100} wrap>
        {props.text}
      </text>
    </vstack>
  )
}
