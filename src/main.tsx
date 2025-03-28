import { Devvit, useState } from "@devvit/public-api";
import { LevelScreen } from "./components/level_screen.js";
import { LEVELS } from "./levels/level_db.js";
import { Session } from "./levels/types.js";
import { HelpScreen } from "./components/help_screen.js";

Devvit.configure({
    redis: true,
    redditAPI: true,
});

const randomTitle = () => {
    const titles = [
        "Can you solve this Qubitect challenge? 🤔⚡",
        "Think you can crack this quantum puzzle? 🧠🚀",
        "A new Qubitect challenge awaits! Ready? 🎯",
        "Quantum geniuses wanted! Can you solve this? 🧠💡",
        "Crack this quantum puzzle and flex your Qubitect skills! 💡⚡",
        "Quantum mastery starts here—can you prove yourself? 🚀🔬",
        "Test your quantum skills—can you solve this? 🏆🔬",
        "Borrow computing power from the multiverse—solve this! 🔮🧠",
    ];
    const randomIdx = Math.floor(Math.random() * titles.length);
    return titles[randomIdx];
};

Devvit.addMenuItem({
    label: "Post a random Qubitect puzzle",
    location: "subreddit",
    onPress: async (_event, context) => {
        const { reddit, ui } = context;
        ui.showToast(
            "Submitting your post - upon completion you'll navigate there.",
        );
        const subreddit = await reddit.getCurrentSubreddit();
        const post = await reddit.submitPost({
            title: randomTitle(),
            subredditName: subreddit.name,
            preview: (
                <vstack height="100%" width="100%" alignment="middle center">
                    <text size="large">Loading ...</text>
                </vstack>
            ),
        });
        const levelId = Math.floor(Math.random() * LEVELS.length);
        await context.redis.set(post.id, levelId.toString());
        ui.navigateTo(post);
    },
});

Devvit.addSchedulerJob({
    name: "Daily Qubitect puzzle post",
    onRun: async (_, context) => {
        const { reddit } = context;
        const subreddit = await reddit.getCurrentSubreddit();
        const post = await reddit.submitPost({
            title: "Your daily Qubitect puzzle 🧩",
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
    label: "Remove daily Qubitect post",
    location: "subreddit",
    forUserType: "moderator",
    onPress: async (_, context) => {
        const jobs = await context.scheduler.listJobs();
        jobs.forEach((job) => {
            context.scheduler.cancelJob(job.id);
        });
        context.ui.showToast(
            "Sucess! This Subreddit will no longer receive daily Qubitect posts.",
        );
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
            cron: "0 0 * * *",
        });
        context.ui.showToast(
            "Sucess! Every Day at 0:00 UTC you there will be an automated post on this Subreddit",
        );
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
