## ✨ Inspiration
In our own experience, we found that quantum computing can be a difficult topic to grasp, especially for beginners. Hence, we wanted to create a possibility for everyone to try out different quantum circuits and visualize the results in an interactive way, without thinking too much about the underlying mathematics.

🧩 Interactive posts on Reddit are a great way to break out of doomscrolling and challenge your brain. So we thought, why not combine the two? 🤔

## ⚡ What it does
Qubitect is a daily interactive puzzle designed to make quantum computing more accessible. Players explore quantum concepts by completing incomplete quantum circuits with a selection of quantum gates, learning by doing.

Catering to both beginners and advanced users, Qubitect offers a progression from foundational exercises to real-world quantum algorithms used in modern architectures. Each puzzle is accompanied by clear explanations and intuitive visualizations, ensuring users grasp the underlying principles step by step.

With a user-friendly interface, Qubitect transforms complex quantum mechanics into an engaging, hands-on experience—making learning both fun and insightful. 🚀🔬

## 🏗️ How we built it
Qubitect simulates the displayed quantum circuits in real-time and changes the resulting states according to the user input.  
We achieved this by implementing our own quantum simulator using an algebra based on the stabilizer formalism.  
In this way, we can simulate the quantum circuits in a very efficient way, which is crucial for the user experience.

🧮 The simulation algorithm is based on the Gottesman-Knill theorem ([arXiv:quant-ph/9807006](https://arxiv.org/abs/quant-ph/9807006)),
which states that some quantum circuits can be simulated efficiently on a classical computer by applying simple lookup table operations, without the need of complex numerical calculations.

## 🎮 How to play
You are presented with a quantum circuit that is missing some gates. Your task is to complete the circuit by selecting the correct gates from the available options.
Inserting a gate can be done by selecting it from the list of available gates and then clicking on the desired position in the circuit.

Now, you can check the result of your changes by looking at the output states. Correct states are marked green ✅, while incorrect states remain red ❌.

If you are stuck, you can always check explanations for each gate and each state by just clicking on them 🧭.
Plus, for each puzzle there is more background information available in the top right corner 👩‍🏫, so you engage with the quantum concepts on a deeper level 💫.

Play now on [r/qubitect](https://www.reddit.com/r/qubitect/)!

## 🔮 What's next for Qubitect
🌐 **Multiplayer Mode**: Challenge your friends and compete in real-time to solve quantum puzzles together.

⛏️ **Build Your Own Puzzle**: Create and share your own quantum puzzles with the community.

📚 **More Quantum Concepts**: Expand the range of quantum algorithms and concepts covered in the puzzles.
