'use server';

import { db } from '@vercel/postgres';

export default async function Page() {
  const client = await db.connect();
  try {
    // extension for creating a long string of unique id
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    let createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users(
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
        username VARCHAR(16) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        is_online BOOLEAN DEFAULT FALSE,
        friends_count INT DEFAULT 0,
        status VARCHAR(255) DEFAULT '',
        profile_img TEXT DEFAULT NULL,
        additional_info JSONB
      );
    `;

    // console.log('Table "users" is created');

    // console.log(createTable);

    // INSERT DATA TO THE USERS TABLE
    // const insertedUser = await client.sql`
    //   INSERT INTO users(username, password)
    //   VALUES ('test', 123456)
    //   ON CONFLICT(id) DO NOTHING;
    // `;

    // console.log(insertedUser);

    /** FRIENDS TABLE */
    createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS friends(
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
        user_id_1 UUID NOT NULL,
        user_id_2 UUID NOT NULL,
        FOREIGN KEY (user_id_1) REFERENCES users(id),
        FOREIGN KEY (user_id_2) REFERENCES users(id)
      );
    `;

    // console.log(createTable);

    // // INSERT DATA TO FRIENDS TABLE
    // const insertedFriend = await client.sql`
    //     INSERT INTO friends(user_id_1, user_id_2)
    //     VALUES ('c77fc807-03eb-4b46-b68d-345f4817785f', '3fe21503-5f1e-47f4-924d-0f1b8cafcd25');
    // `;

    // console.log(insertedFriend);

    /** FRIEND REQUESTS TABLE */
    createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS friend_requests(
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
        from_id UUID NOT NULL,
        to_id UUID NOT NULL,
        FOREIGN KEY (from_id) REFERENCES users(id),
        FOREIGN KEY (to_id) REFERENCES users(id)
      );
    `;

    console.log(createTable);
  } catch (error) {
    console.error('Error creating user table:', error);
    throw error;
  }
}
