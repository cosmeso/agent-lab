// =====================================================================
//  STORY TEXT for Abimael's Andromeda - The Utopian Galaxies
//  Everything players read in Story Mode lives here, in Buston's words.
//  Lines marked  // DRAFT  were written to fill a gap: replace them with yours.
//  To change a line: edit the text between the quotes, save, reload the game.
// =====================================================================
window.STORY = {
  ch1: {
    title: "Chapter 1: The Sliven Burrow",

    // ---------- quest steps (shown in the corner and in the Journal) ----------
    steps: {
      hop: "Play air hopscotch with Madison and her friends by the ash trees",
      look: "Something on the horizon is moving. Talk to Madison",
      trees: "Go see the trees that don't move",
      mud: "Run into the blue mud!",
      dinner: "Go home. Dinner with Grandma, Grandpa and the family",
      fire: "The Remembrance: join the village at the blue fire",
      secret: "Slip away to the crew's tree house"
    },

    // ---------- Scene 1: crystals in the ash ----------
    opening: [
      "On a breezy day, the ground near the ash trees is filled with crystals galore, shining like diamonds in a ground of ash.",
      "Madison is six. Her friends are Migi, Armius, Marla and Sady, and today they're playing hopscotch the village way: drawn in the air with ash lighter than air, mixed with miracled blue mud so it glows.",
      "Put a little on your head and hop. Your head is what touches. Every square you hit leaves a glowing print in the air."
    ],
    hopHelp: "Jump (Space) and touch each glowing square with your head.",
    hopDone: "Every square glows with your prints.",

    // ---------- the hook: trees that shouldn't move ----------
    noticeTrees: [
      "Across the horizon, the trees are shimmering. Shaking. Almost moving.",
      "From what they know, those trees don't move."
    ],
    madisonTrees: [
      { who: "Madison", text: "Let's go!" },
      { who: "Madison", text: "Wait. Whoa. What is that, guys? Have y'all seen this before? Sady?" },
      { who: "Sady", text: "I've never seen this. Nothing like this. Nobody has." },
      { who: "Madison", text: "Okay. Well, let's go find out then. We've never seen it. We don't know what this is. Who best to investigate than us?" },
      { who: "Madison", text: "And if we find something new, who's gonna be the discoverers? Us. So we get to name it." }
    ],

    // ---------- Scene 4: the vibration ----------
    vibration: [
      "The ground feels not like an earthquake, but like a tsunami. Something aqueous, moving under the ground. Almost rhythmic.",
      "The sound isn't heard. It is felt.",
      "Everyone knows the rule. Feel them, see one? Run into the mud."
    ],
    madisonThinks: "We can do this. Or not. We can do this. Wait, so there's a nest down there? I need to get rid of it. How do I get rid of it? I need to come up with a plan.",

    // ---------- Scene 2: home ----------
    dinner: [
      "Dinner starts chaotic. Madison is running around the house until Grandma has to call her.",
      "At the table it's structured. She goes over her day, school, the little things she did with her friends. She tries to get more food than she's supposed to. She eats with her mouth open, and she's told not to.",
      "Grandma and her aunt are spectacular cooks. Grandma is structured and rigid, but loving and caring. Her aunt is just smiling, like always, giving beautiful energy. Grandpa mostly listens to the stories, reassuring, laughing, and always warning, just like always.",
      "Her cousin Bia, sixteen and basically her sister, lives down the block. They fight over Bia's clothes, which Madison can't fit, and over who Orneo, their little furry, feathered lizard, likes more.",
      "Everyone spoils her. Each in their own way."
    ],

    // ---------- Scene 3: the Remembrance and Sady's secret ----------
    remembrance: [
      "Once a year the whole village gathers at the center for the Remembrance. Miracled mud goes into the temple pit, and it creates a blue fire.",
      "They say the fire symbolizes the creation of all beings. To the kids, it's just a blue fire.",
      "There's grilling, food, snacks, music. A festival for the whole town."
    ],
    secret: [
      "Up in the tree house the crew is playing Dyonys.",
      "Sady tells them what she knows. A funny little story she overheard while hiding under the table, before the adults said \"Hey, go away. Don't be listening over here.\"",
      "Something weird about some adults doing things in the caves. Whatever.",
      "But the important part: blue mud fell into a black pool in a cave. It accidentally fell in there somehow. Apparently adults don't know how to do things.",
      "And it created the miracle."
    ],
    partEnd: "Two weeks of training begin.",

    // ---------- Scene 5: building the gear (two weeks of training) ----------
    steps2: {
      gear: "Two weeks of training: gather crystals, vines, poison pods and silver tree skin",
      caught: "4 am: meet the crew at the Crystal Cave",
      leaves: "Alone now. Help Madison catch hush-tree leaves",
      dive: "Dive under the moss and pack miracled mud around the sliven nest",
      boom: "From the Crystal Cave, connect the hidden path",
      horizon: "Look into the fire"
    },
    gearStart: [
      "For two weeks they train. They go to the Crystal Cave for crystals, down to the forests of Ruru for poison flowers, and they find vines growing across the foliage and the caverns.",
      "There are trees that grow a metallic skin, almost silver. Harvest it right, drape it over a mold, and it becomes armor."
    ],
    vineGot: "You twist the vine into fiber. Rope.",
    crystalGot: "A crystal from the cave. Good for tools that can cut silver skin.",
    podHelp: "Squeeze it gently. Hold E and let go in the green. Squeeze too hard and it explodes.",
    podOk: "The pod gives up its poison into the vial. Gently done.",
    podBurst: "It explodes. Everyone gets a little of it. One pod could paralyze and kill. The armor saves you, mostly.",
    skinFall: [
      "Nobody is really sure how to get the silver skin off the tree. So they all grab it and pull at the same time.",
      "It gives all at once. They fly backwards, every one of them, straight into a pile left by a lyros.",
      "The lyros watches them with its glowing lilac moss-horns and see-through hooves, completely unbothered."
    ],
    mist: "A shimmering mist covers the village. Put a light to it and you're inside a glowing bulb. Only the blue mud's glow gets through.",
    gearDone: "The gear is ready: bark suits, shoes from beast skin, poison from the pods, abalone helmets, vine rope.",

    // ---------- Scene 6: caught ----------
    caught: [
      { who: "Guard", text: "HEY? Who's all there? Let's go!" },
      { who: "Guard", text: "What the hell are y'all doing here? You should not be up this late. You have school tomorrow." },
      { who: "Sady", text: "Actually, it's Friday. So we don't have school." },
      { who: "Guard", text: "Whatever. Get back home, or we're gonna tell your parents." },
      "They tell them anyway. Every family is waiting. Madison's grandma, grandpa and aunt are waiting.",
      "They're yelled at. Lectured. How horrible it could have been. How they all could have died. That the sliven are always, always, always a forbidden zone. That they're lucky to be alive. They've heard it before, but not like this.",
      "No hanging out. Until the adults decide otherwise.",
      "Her friends move on to the next project. Let's build stuff! But for Madison, this was just a diversion."
    ],

    // ---------- Scene 7: alone ----------
    alone: [
      { who: "Madison", text: "Difficult. But not impossible." },
      "She'll do it alone, in parts. During the day, while the sliven hunt. At night, the finishing touches. Then on the third day, she'll \"ignite it.\"",
      "But the guards patrol day and night. So: the hush tree. Its leaves, treated with blue mud and ash and sewn together, make you invisible. A little.",
      "The hush trees are far, far away, and very tall. People used to fall to their deaths trying to climb them. Nobody goes there. Madison goes there."
    ],
    leavesHelp: "Madison throws her grapple and shakes the branches. Catch the leaves before they hit the ground.",
    leafGot: "Caught one. Perfect condition.",
    leafLost: "It hit the ground. Ruined.",
    suit: "She has enough. A rudimentary cloth. She goes inside it, and she's invisible. A little.",

    // ---------- Scene 8: the dive ----------
    diveStart: "Where the water meets the land, the grass is heavy, almost like a moss you have to swim through. She breathes through a tube she made herself.",
    diveHelp: "Hold E to pack miracled mud into the hole. Don't let go.",
    divePanic: "The moss is all around her. Encased. Fearless Madison is almost losing it.",
    diveDone: "Excruciatingly horrible. She still went through it.",

    // ---------- Scene 9: boom ----------
    boomStart: "From the Crystal Cave she has the perfect view, and it's safe. The hidden path runs all the way around the nest: miracled mud and ash, mixed with hush leaves so nobody can see it.",
    boomConnect: "One piece of untreated miracled mud, connecting the path to where she's standing.",
    boom: [
      "It lights up. The whole path, glowing beautifully. Zoom. Across the entire place.",
      "Then the giant boom. The ground shakes. Blue fire.",
      "In the village, people are screaming. Chaos. Where did this come from? What's going on?",
      "It's Madison. In the cave."
    ],
    cost: [
      "About a third of the trees of wellness are burned. Water seeps into the hole. Trade goods are lost. What a mess. What a nightmare.",
      "The face that shows it is Sady's. She watches all her hard work go up in flames. All the days she couldn't play, gone. The fire reached her cukoo farm too.",
      "She's angry, sad, frustrated. But disappointed most of all.",
      "And now everyone knows how Madison works. She's not going to be stopped."
    ],

    // ---------- Scene 10: the horizon ----------
    horizon: [
      "Across the fire. Through the fire.",
      "She sees stitches. Coming undone, almost.",
      "And almost a hand, she believes. Reaching out.",
      "For a moment, she feels it. A vibration. A whisper.",
      { who: "Guard", text: "Hey! What are you doing here? Didn't we tell you?" },
      "Her family, the chiefs, everyone around her, screaming, yelling. Get out! Water! Come on! Boom. Boom. Boom."
    ],
    ending: [
      "Madison begins to wonder of her next adventure. Where will she find her next mischief? Will it be the trees of willow?",
      "The air thickens. The wind whispers. The ground crackles.",
      "Or the hand across the horizon that calls her?",
      "Will Madison answer?"
    ],
    chapterEnd: "End of Chapter 1",

    // ---------- the friends ----------
    friends: {
      "Sady": {
        about: "Sady is ten: bright, kind, youthful, confident. A little mature for her age, some say. But then again, she's ten now. She already runs her family's farm of cukoo trees.",
        motive: "Keep her family's cukoo farm thriving.",
        lines: ["I've never seen this. Nothing like this. Nobody has.", "The cukoo trees don't pick themselves."] // second line DRAFT
      },
      "Migi": {
        about: "Migi is eccentric. His pranks are never mean, and never funny, and he laughs anyway. He symbiosizes with the ash trees, which nobody does. For him it's pleasure. He goes there for peace, he says.",
        motive: "Have a laugh, and find peace in the ash trees.",
        lines: ["I go to the ash trees for peace. Don't look at me like that."] // DRAFT
      },
      "Armius": {
        about: "Armius comes from a militarance family that serves the lineage of the Third Empire. He's stoic, but it's a facade. Underneath is a boy who likes to sing, dance, play and collect flowers. Velvet in an iron glove.",
        motive: "Be what his family expects, and keep his flowers.",
        lines: ["..."] // DRAFT: what does Armius say?
      },
      "Marla": {
        about: "Marla does not care about anything. Her clothes are on however. She likes to sleep and eat. But if her friends are in it, she'll be the first one to fight.",
        motive: "Eat, sleep, and back her friends in any fight.",
        lines: ["I'm not bored. I'm resting."] // DRAFT
      },
      "Bia": {
        about: "Bia is sixteen, Madison's cousin, but basically her sister. More mature. She lives down the block, so they're always at each other's house.",
        motive: "Keep Madison out of her clothes.",
        lines: ["Those don't even fit you, Madison."] // DRAFT
      },
      "Grandpa": {
        about: "Grandpa mostly listens to the stories. Reassuring, laughing, and always warning, just like always.",
        motive: "Listen, and keep everyone safe.",
        lines: ["Careful now. Just like always."] // DRAFT
      }
    }
  }
};
