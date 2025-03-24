import { Devvit, useState } from "@devvit/public-api";
import { LevelScreen } from "./components/level_screen.js";
import { LEVELS } from "./levels/level_db.js";
import { Session } from "./levels/types.js";
import { HelpScreen } from "./components/help_screen.js";

Devvit.configure({
    redis: true,
    redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
    label: "Add qubitect playtest post",
    location: "subreddit",
    forUserType: "moderator",
    onPress: async (_event, context) => {
        const { reddit, ui } = context;
        ui.showToast(
            "Submitting your post - upon completion you'll navigate there.",
        );

        const subreddit = await reddit.getCurrentSubreddit();
        const post = await reddit.submitPost({
            title: "Test qubitect post",
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

Devvit.addSchedulerJob({
    name: "Daily Qubitect puzzle post",
    onRun: async (event, context) => {
        const { reddit } = context;
        const subreddit = await reddit.getCurrentSubreddit();
        await reddit.submitPost({
            title: "Test qubitect post",
            subredditName: subreddit.name,
            // The preview appears while the post loads
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text size="large">Loading ...</text>
                </vstack>
            ),
        });
    },
});

Devvit.addMenuItem({
    label: "Add daily Qubitect puzzle post",
    location: "post",
    onPress: async (event, context) => {
        // Initialize level id in redis
        const hasLevelId = await context.redis.exists("currentLevelId");
        if (!hasLevelId) {
            await context.redis.set("currentLevelId", "0");
        }
        const jobId = await context.scheduler.runJob({
            name: "Daily Qubitect puzzle post",
            cron: "*/2 * * * *",
        });
    },
});

const App: Devvit.CustomPostComponent = async ({ redis }) => {
    // Fetch current level id from redis
    const levelId =
        parseInt(
            await redis.get("currentLevelId").then((value) => value ?? "0"),
        ) + 1;
    // Update current level id in redis
    await redis.set("currentLevelId", levelId.toString());
    if (levelId >= LEVELS.length) {
        return <text>No more levels</text>;
    }
  const [displayHelp, changeDisplayHelp] = useState(false);
    const session = new Session(LEVELS[levelId]);
    return (
        <zstack height={100} width={100}>
            {displayHelp ? (
                <HelpScreen session={session} />
            ) : (
                <LevelScreen session={session} />
            )}
            <hstack alignment="end" width={100}>
                <button
                    icon={displayHelp ? "wiki-ban" : "wiki"}
                    onPress={() => {
                        changeDisplayHelp(!displayHelp);
                    }}
                />
            </hstack>
        </zstack>
    );
};
Devvit.addCustomPostType({
    name: "Qubitect",
    height: "tall",
    description: "Bite-sized quantum computing puzzles",
    render: App,
});

export default Devvit;
