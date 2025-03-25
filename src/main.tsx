import { Devvit, useState } from '@devvit/public-api'
import { LevelScreen, LevelScreenState } from './components/level_screen.js';
import { Session } from './levels/types.js';
import { EPR } from './levels/cnot_test.js';
import { Measurement } from './types.js';
import { MeasurementTest } from './levels/measurement.js';
import { TestLevel } from './levels/simplest.js';
import { HelpScreen } from './components/help_screen.js';


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
      title: 'Test qubitect post',
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

const LEVELS = [TestLevel, MeasurementTest, EPR]

Devvit.addCustomPostType({
  name: 'Qubitect',
  height: 'tall',
  description: 'Bite-sized quantum computing puzzles',
  render: () => {
    const [displayHelp, changeDisplayHelp] = useState(false);
    let session = new Session(EPR);
    return (
      <zstack height={100} width={100}>
        {displayHelp ? <HelpScreen session={session} />
          : <LevelScreen session={session} />}
        <hstack alignment='end' width={100}>
          <button icon={displayHelp ? "wiki-ban" : "wiki"} onPress={() => {
            changeDisplayHelp(!displayHelp);
          }} />
        </hstack>
      </zstack>
    )
  }
})

export default Devvit
