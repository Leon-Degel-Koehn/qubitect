import { Devvit, useState } from "@devvit/public-api";
import { LevelScreen } from "./components/level_screen.js";
import { LEVELS } from "./levels/level_db.js";
import { Session } from "./levels/types.js";
import { HelpScreen } from "./components/help_screen.js";
import { SuccessPopup } from "./components/SuccessPopup.js";

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
    onRun: async (_, context) => {
        const { reddit } = context;
        const subreddit = await reddit.getCurrentSubreddit();
        const post = await reddit.submitPost({
            title: "Daily qubitect post",
            subredditName: subreddit.name,
            // The preview appears while the post loads
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text size="large">Loading ...</text>
                </vstack>
            ),
        });
        // Initialize level id in redis
        let levelId = parseInt(
            await context.redis
                .get("currentLevelId")
                .then((value) => value ?? "0"),
        );
        if (levelId >= LEVELS.length) {
            levelId = 0;
            await context.redis.set("currentLevelId", "0");
        }
        await context.redis.set("currentLevelId", `${levelId + 1}`);
        await context.redis.set(post.id, levelId.toString());
    },
});

Devvit.addMenuItem({
    label: "Remove daily post",
    location: "subreddit",
    forUserType: "moderator",
    onPress: async (_, context) => {
        const jobs = await context.scheduler.listJobs();
        jobs.forEach((job) => {
            context.scheduler.cancelJob(job.id);
        });
    },
});

Devvit.addMenuItem({
    label: "Add daily Qubitect puzzle post",
    location: "subreddit",
    onPress: async (_, context) => {
        const jobs = await context.scheduler.listJobs();
        if (jobs.length > 0) return;
        await context.scheduler.runJob({
            name: "Daily Qubitect puzzle post",
            cron: "*/2 * * * *",
        });
        console.log("Added daily posting job");
    },
});

const App: Devvit.CustomPostComponent = (context) => {
    // Fetch current level id from redis
    const [levelId, setLevelId] = useState(async () => {
        let postId = "";
        if (context.postId !== undefined) {
            postId = context.postId;
        }
        return parseInt(
            await context.redis.get(postId).then((value) => value ?? "0"),
        );
    });
    console.log(levelId);
    if (levelId >= LEVELS.length) {
        return <text>No more levels</text>;
    }
    const [displayHelp, changeDisplayHelp] = useState(false);
    const session = new Session(LEVELS[levelId]);
    const postDimensions = context.dimensions ?? { width: 0, height: 0 };
    return (
        <zstack height={100} width={100}>
            {displayHelp ? (
                <HelpScreen session={session} />
            ) : (
                <LevelScreen
                    session={session}
                    screenWidth={postDimensions.width}
                    screenHeight={postDimensions.height}
                />
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
