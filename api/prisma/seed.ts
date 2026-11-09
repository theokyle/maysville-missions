import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { JourneyType } from '../src/generated/prisma/client';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const journeys = [
  {
    title: 'Neighbor Noticer',
    description:
      'Practice becoming a good neighbor by noticing, acknowledging, and connecting with the people around you.',
    icon: '/STB_waymarker_neighbor noticer_approved.png',
    videoUrl: 'https://youtu.be/zUYAuEOrBYk',
    type: JourneyType.INDIVIDUAL,
    steps: [
      {
        title: 'Notice',
        description:
          'As you go about your day, pay attention to the people and places around you. Notice who you encounter and take a moment to reflect on what you observe.',
        targetCount: 1,
        sortOrder: 1,
      },
      {
        title: 'Friendly Acknowledgment',
        description:
          'Smile, nod, or wave at someone you do not know. Take a moment to reflect on the interaction.',
        targetCount: 3,
        sortOrder: 2,
      },
      {
        title: 'Greeting',
        description:
          'Offer a friendly greeting to someone new. Reflect on what it felt like to initiate a small connection.',
        targetCount: 1,
        sortOrder: 3,
      },
      {
        title: 'Introduce Yourself and Offer a Friendly Question or Comment',
        description:
          'Introduce yourself to someone and offer a friendly question or comment. You can record either the interaction or your reflection on it.',
        targetCount: 2,
        sortOrder: 4,
      },
    ],
  },

  {
    title: 'Encourager',
    description:
      'Practice noticing the people in your life and finding meaningful ways to offer encouragement.',
    icon: '/STB_waymarker_encourager_approved.png',
    videoUrl: 'https://youtu.be/FEyxfs29Le8',
    type: JourneyType.INDIVIDUAL,
    steps: [
      {
        title: 'Notice Someone You Know',
        description:
          'Think about someone you know who might benefit from encouragement. Take time to notice how they are doing and what they might be experiencing.',
        targetCount: 1,
        sortOrder: 1,
      },
      {
        title: 'Consider How to Encourage Them',
        description:
          'Reflect on a way you could encourage this person. You might send a note or text, make a phone call, or decide that the best thing right now is simply to keep them in your thoughts. Record your reflection or action.',
        targetCount: 1,
        sortOrder: 2,
      },
      {
        title: 'Notice a Friend You Haven’t Contacted Recently',
        description:
          'Think of a friend you have not connected with in a while. Consider what might be happening in their life and what they might need.',
        targetCount: 1,
        sortOrder: 3,
      },
      {
        title: 'Consider How to Reconnect',
        description:
          'Reflect on a way you could reconnect with this friend. You might send a message, make a call, or decide how and when you would like to reach out. Record your reflection or action.',
        targetCount: 1,
        sortOrder: 4,
      },
      {
        title: 'Notice an Acquaintance',
        description:
          'Think about someone you know casually—someone from work, your neighborhood, church, or another part of your community. Consider how they might benefit from a little encouragement.',
        targetCount: 1,
        sortOrder: 5,
      },
      {
        title: 'Find a Way to Encourage Them',
        description:
          'Reflect on a simple way to offer encouragement to this person. You might send a message, offer a kind word, or decide on another thoughtful gesture. Record your reflection or action.',
        targetCount: 1,
        sortOrder: 6,
      },
    ],
  },

  {
    title: 'Fill Your Cup',
    description:
      'Make space for renewal by recognizing what you need, creating a plan, and honoring your capacity.',
    icon: '/STB_waymarker_fill your cup_approved.png',
    videoUrl: 'https://youtu.be/aY7opmKjcbg',
    type: JourneyType.INDIVIDUAL,
    steps: [
      {
        title: 'Reflect on Where You Need Renewal',
        description:
          'Take a moment to consider where you feel depleted or in need of renewal. What parts of your life need attention, rest, or care?',
        targetCount: 1,
        sortOrder: 1,
      },
      {
        title: 'Make a Plan',
        description:
          'Identify one or more practical ways you can make space for renewal. Create a plan that feels realistic and meaningful for you.',
        targetCount: 1,
        sortOrder: 2,
      },
      {
        title: 'Practice Your Plan',
        description:
          'Put your plan into practice. Take time to do something that helps restore your energy, attention, or sense of well-being.',
        targetCount: 1,
        sortOrder: 3,
      },
      {
        title: 'Honor Your Capacity',
        description:
          'Reflect on what you have learned about your needs and limits. Consider how you can continue to honor your capacity and make room for renewal.',
        targetCount: 1,
        sortOrder: 4,
      },
    ],
  },

  {
    title: 'Listening for Belonging',
    description:
      'A Christian group journey for practicing attentive listening: slowing down, listening with curiosity, and seeking to understand before responding. Before you begin, watch the Maysville Mini. Participants work through the practices individually and make one private group chat contribution at every step.',
    icon: '/STB_waymarker_GROUP_Listening_approved.png',
    videoUrl: 'https://youtu.be/jl-dvH4wU4o',
    type: JourneyType.GROUP,
    steps: [
      {
        title: 'Begin With Presence',
        description:
          'Slow down and become aware of God’s presence. Practice being attentive to yourself, the people around you, and the moment you are in.',
        videoUrl: 'https://youtu.be/Gm2f9kBFPe8',
        groupChatPrompt:
          'As you practiced becoming aware of God’s presence, what did you notice or feel? Was anything surprising to you?',
        requiresGroupPost: true,
        targetCount: 1,
        sortOrder: 1,
      },
      {
        title: 'Be Curious',
        description:
          'Approach conversations with curiosity. Practice asking open-ended questions and listening to learn rather than assuming you already understand.',
        videoUrl: 'https://youtu.be/l6KLBVOm5OA',
        groupChatPrompt:
          'What did you learn about curiosity or asking open questions? You can share something from your practice or respond thoughtfully to another group member.',
        requiresGroupPost: true,
        targetCount: 1,
        sortOrder: 2,
      },
      {
        title: 'Show You Heard',
        description:
          'Practice demonstrating that you are listening. Pay attention, reflect back what you hear, and help the other person know their words matter.',
        videoUrl: 'https://youtu.be/iyRjbn-0KEE',
        groupChatPrompt:
          'What did you learn about helping someone feel heard? Share an insight from your practice or respond to someone else.',
        requiresGroupPost: true,
        targetCount: 1,
        sortOrder: 3,
      },
      {
        title: 'Ask, Don’t Fix',
        description:
          'Resist the urge to immediately solve someone else’s problem. Practice asking what they need and allowing them to guide the conversation.',
        videoUrl: 'https://youtu.be/fFtpgSDKybo',
        groupChatPrompt:
          'What did you learn about resisting the urge to fix a situation? How might asking someone how you can support them change a conversation?',
        requiresGroupPost: true,
        targetCount: 1,
        sortOrder: 4,
      },
      {
        title: 'Offer a Listening Presence',
        description:
          'Bring together what you have practiced. Offer another person your attentive presence, making room for their experience without judgment or the need to have an answer.',
        videoUrl: 'https://youtu.be/8K8nwNLCNKY',
        groupChatPrompt:
          'Reflect on your listening practice throughout this journey. What have you learned, and what might you carry forward? Please avoid sharing private details from conversations with others.',
        requiresGroupPost: true,
        targetCount: 1,
        sortOrder: 5,
      },
    ],
  },
];

async function main() {
  console.log('Seeding journeys...');

  for (const journey of journeys) {
    const { steps, ...journeyData } = journey;

    await prisma.journey.upsert({
      where: {
        title: journey.title,
      },
      create: {
        ...journeyData,
        steps: {
          create: steps,
        },
      },
      update: {
        ...journeyData,
        steps: {
          deleteMany: {},
          create: steps,
        },
      },
    });

    console.log(`Created or updated journey: ${journey.title}`);
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
