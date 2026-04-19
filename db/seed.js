import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Insert folders
  const folders = [
    { name: 'Documents' },
    { name: 'Pictures' },
    { name: 'Music' }
  ];

  for (const folder of folders) {
    const folderResult = await db.query(
      'INSERT INTO folders (name) VALUES ($1) RETURNING id',
      [folder.name]
    );
    const folderId = folderResult.rows[0].id;

    // Insert files for this folder
    const files = [
      { name: 'file1.txt', size: 100 },
      { name: 'file2.pdf', size: 200 },
      { name: 'file3.docx', size: 150 },
      { name: 'file4.xlsx', size: 300 },
      { name: 'file5.ppt', size: 250 }
    ];

    for (const file of files) {
      await db.query(
        'INSERT INTO files (name, size, folder_id) VALUES ($1, $2, $3)',
        [file.name, file.size, folderId]
      );
    }
  }
}
