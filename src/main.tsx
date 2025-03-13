import { Devvit, useState } from '@devvit/public-api'

// glaube das hier kann weg, wenn dieses "Add my post" weg ist oder nicht mehr diesen "forUserType: moderator" hat.
Devvit.configure({
  redis: true,
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add qubitect playtest post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Submitting your post - upon completion you'll navigate there.");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'My devvit post',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});

function qubitLines(numQubits: number) {
  let lines = [<spacer height="20px" />];
  for (let i = 0; i < numQubits; i++) {
    lines.push(<hstack width="100%" height="1px" borderColor='black' />);
    lines.push(<spacer height="40px" />)
  }
  return <vstack width="100%">{lines}</vstack>;
}

const bottomMenu = (gates: string[], selectedGate: string, selectGate: Function) => {
  return (<hstack
    alignment='center middle'
    gap='medium'
    width='95%'
    height='60px'
    borderColor='black'
    cornerRadius='medium'
  >
    {gates.map((gateLabel) => (
      <image
        url={`${gateLabel}.png`}
        imageHeight={!!selectedGate ? gateLabel == selectedGate ? 50 : 30 : 40}
        imageWidth={!!selectedGate ? gateLabel == selectedGate ? 50 : 30 : 40}
        onPress={() => { selectGate(gateLabel) }}
      />
    ))}
  </hstack>)
}

Devvit.addCustomPostType({
  name: 'Qubitect',
  render: () => {
    let gates = ["hadamard", "pauli_x"]
    const [selectedGate, selectGate] = useState('')
    const numQubits = 2;
    return (
      <vstack alignment='center middle' height='100%' gap='large' padding='medium' backgroundColor='white'>
        <spacer grow shape='invisible' />
        <zstack width="100%">
          {qubitLines(numQubits)}
          <hstack width="100%">
            <image
              url="ket_1.png"
              imageHeight="40px"
              imageWidth="40px"
            />
            <spacer grow shape='invisible' />
            <image
              url="standard_measure.png"
              imageHeight="40px"
              imageWidth="40px"
            />
          </hstack>
        </zstack>
        <spacer grow shape='invisible' />
        {bottomMenu(gates, selectedGate, selectGate)}
      </vstack>
    )
  }
})

export default Devvit
