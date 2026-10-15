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
    description: '7 days - Become a good neighbor',
    icon: '/neighbor-noticer.png',
    type: JourneyType.INDIVIDUAL,
    steps: [
      {
        title: 'Smile at a neighbor',
        targetCount: 1,
        sortOrder: 1,
      },
      {
        title: 'Wave at a neighbor',
        targetCount: 1,
        sortOrder: 2,
      },
      {
        title: 'Say Hello, Good Morning, etc.',
        targetCount: 1,
        sortOrder: 3,
      },
      {
        title: 'Ask a neighbor, “How’s it going?”',
        targetCount: 1,
        sortOrder: 4,
      },
      {
        title: 'Offer your name to your neighbor.',
        targetCount: 1,
        sortOrder: 5,
      },
      {
        title: 'Help your neighbor with something in the yard.',
        targetCount: 1,
        sortOrder: 6,
      },
      {
        title: 'Give your neighbor a small gift',
        targetCount: 1,
        sortOrder: 7,
      },
    ],
  },

  {
    title: 'Encourager',
    description: '5 days - Practice Affirmation',
    icon: '/encourager.png',
    type: JourneyType.INDIVIDUAL,
    steps: [
      {
        title: 'Send a text',
        targetCount: 1,
        sortOrder: 1,
      },
      {
        title: 'Send a card',
        targetCount: 1,
        sortOrder: 2,
      },
      {
        title: 'Give a compliment',
        targetCount: 1,
        sortOrder: 3,
      },
      {
        title: 'Tell someone they are doing a good job',
        targetCount: 1,
        sortOrder: 4,
      },
      {
        title: 'Your choice',
        targetCount: 1,
        sortOrder: 5,
      },
    ],
  },

  {
    title: 'Table Builder',
    description: '14 days - Increase Community Participation',
    icon: '/table-builder.png',
    type: JourneyType.INDIVIDUAL,
    steps: [
      {
        title: 'Eat Local',
        targetCount: 1,
        sortOrder: 1,
      },
      {
        title: 'Eat at a different local restaurant',
        targetCount: 1,
        sortOrder: 2,
      },
      {
        title: 'Eat at a 3rd local restaurant',
        targetCount: 1,
        sortOrder: 3,
      },
      {
        title: 'Purchase local',
        targetCount: 1,
        sortOrder: 4,
      },
      {
        title: 'Attend a local sports game',
        targetCount: 1,
        sortOrder: 5,
      },
      {
        title: 'Explore a neighborhood you normally do not drive through',
        targetCount: 1,
        sortOrder: 6,
      },
      {
        title: 'Attend a local event',
        targetCount: 1,
        sortOrder: 7,
      },
      {
        title: 'Pick up litter',
        targetCount: 1,
        sortOrder: 8,
      },
      {
        title: 'Pay it forward',
        targetCount: 1,
        sortOrder: 9,
      },
      {
        title: 'Help with a local fundraiser',
        targetCount: 1,
        sortOrder: 10,
      },
      {
        title: 'Donate to the local food bank',
        targetCount: 1,
        sortOrder: 11,
      },
      {
        title: 'Help someone at the grocery store',
        targetCount: 1,
        sortOrder: 12,
      },
      {
        title: 'Learn who your local leaders are',
        targetCount: 1,
        sortOrder: 13,
      },
      {
        title: 'Learn the name of someone serving you',
        targetCount: 1,
        sortOrder: 14,
      },
    ],
  },

  {
    title: 'Bridge Builder',
    description: '8 days - Restore Relationships',
    icon: '/bridge-builder.png',
    type: JourneyType.INDIVIDUAL,
    steps: [
      {
        title: 'Reach out to 1 friend (Text, email, phone)',
        targetCount: 1,
        sortOrder: 1,
      },
      {
        title: 'Reach out to a 2nd friend (Text, email, phone)',
        targetCount: 1,
        sortOrder: 2,
      },
      {
        title: 'Reach out to a 3rd friend (Text, email, phone)',
        targetCount: 1,
        sortOrder: 3,
      },
      {
        title: 'Schedule coffee with 1 friend',
        targetCount: 1,
        sortOrder: 4,
      },
      {
        title: 'Schedule lunch with 1 friend',
        targetCount: 1,
        sortOrder: 5,
      },
      {
        title: 'Schedule a Zoom “Happy Hour” with a long distance friend',
        targetCount: 1,
        sortOrder: 6,
      },
      {
        title: 'Send a reelz or a TikTok',
        targetCount: 1,
        sortOrder: 7,
      },
      {
        title: 'Send a “Thinking of You” card',
        targetCount: 1,
        sortOrder: 8,
      },
    ],
  },

  {
    title: 'Quiet Care',
    description:
      '5 days - Become aware of your body holding onto tension or stress preventing you from connecting with others. FOR THIS JOURNEY DO ALL 3 FOR 5 DAYS.',
    icon: '/quiet-care.png',
    type: JourneyType.INDIVIDUAL,
    steps: [
      {
        title: 'Stretch break',
        targetCount: 5,
        sortOrder: 1,
      },
      {
        title: 'Take a breath',
        targetCount: 5,
        sortOrder: 2,
      },
      {
        title: 'Drink water',
        targetCount: 5,
        sortOrder: 3,
      },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding journeys...');

  for (const journey of journeys) {
    await prisma.journey.create({
      data: {
        title: journey.title,
        description: journey.description,
        icon: journey.icon,
        type: journey.type,
        steps: {
          create: journey.steps,
        },
      },
    });

    console.log(`✔ Created journey: ${journey.title}`);
  }

  console.log('✅ Seeding complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
