import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const journeys = [
  {
    title: 'Neighbor Noticer',
    tasks: [
      {
        title: 'Wave at your neighbor when driving by',
        targetCount: 3,
        sortOrder: 1,
      },
      {
        title:
          'Say hi to the person in front of you or behind you in the next line you are in',
        targetCount: 3,
        sortOrder: 2,
      },
      {
        title: 'Ask a neighbor, "How are you today?"',
        targetCount: 3,
        sortOrder: 3,
      },
    ],
  },
  {
    title: 'Table Builder',
    tasks: [
      {
        title: 'Invite a friend to coffee',
        targetCount: 1,
        sortOrder: 1,
      },
      {
        title: 'Invite a friend and someone new to coffee',
        targetCount: 1,
        sortOrder: 2,
      },
      {
        title: 'Gather a small group (3+) for coffee or a meal',
        targetCount: 1,
        sortOrder: 3,
      },
      {
        title: 'Host a dinner for several people',
        targetCount: 1,
        sortOrder: 4,
      },
    ],
  },
  {
    title: 'The Encourager',
    tasks: [
      {
        title: 'Send an encouraging text',
        targetCount: 5,
        sortOrder: 1,
      },
      {
        title: 'Send a card to someone',
        targetCount: 3,
        sortOrder: 2,
      },
      {
        title: 'Tell someone how much you appreciate them',
        targetCount: 3,
        sortOrder: 3,
      },
      {
        title: 'Do something nice for someone else',
        targetCount: 2,
        sortOrder: 4,
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
        tasks: {
          create: journey.tasks,
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
