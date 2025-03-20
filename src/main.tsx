import { Devvit } from '@devvit/public-api'
import { LevelScreen } from './components/level_screen.js';
import { TestLevel } from './levels/simplest.js';
import { Session } from './levels/types.js';
import { BellStateTestLevel } from './levels/bell_state_test.js';


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

Devvit.addCustomPostType({
  name: 'Qubitect',
  height: 'tall',
  description: 'Bite-sized quantum computing puzzles',
  render: () => {
    return (
      //TODO: implement other screens etc.
      <LevelScreen session={new Session(BellStateTestLevel)} />
    )
  }
})

export default Devvit
