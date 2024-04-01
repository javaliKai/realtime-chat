import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import connectDB from '@/app/lib/db';

export async function POST(request: NextRequest) {
  const { client, endPool } = await connectDB();
  try {
    const data = await request.formData();
    const chatRoomId = data.get('chatRoomId');
    const creatorUsername = data.get('creatorUsername');
    const senderUserId = data.get('senderUserId');
    const fileName = data.get('fileName');
    const isGroup = data.get('isGroup');

    if (isGroup === 'isGroup') {
      const groupId = data.get('groupId');
      await client.query(
        "INSERT INTO group_messages(chatroom_id, creator_id, creator_username, text, type) VALUES ($1, $2, $3, $4, 'file')",
        [groupId, senderUserId, creatorUsername, fileName]
      );
    } else {
      // save the identifier to db
      await client.query(
        "INSERT INTO messages(chatroom_id, creator_id, creator_username, text, type) VALUES ($1, $2, $3, $4, 'file')",
        [chatRoomId, senderUserId, creatorUsername, fileName]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error while saving file to DB: ', error);
    return NextResponse.json(
      {
        message: 'Fail to save file to DB.',
      },
      {
        status: 500,
      }
    );
  } finally {
    client.release();
    endPool();
  }
}
