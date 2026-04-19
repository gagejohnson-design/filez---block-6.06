import express from "express";
import db from "#db/client";

const app = express();

app.use(express.json());

app.get('/files', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT f.id, f.name, f.size, f.folder_id, fo.name as folder_name
      FROM files f
      JOIN folders fo ON f.folder_id = fo.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/folders', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM folders');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/folders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT f.*, json_agg(fi.*) as files
      FROM folders f
      LEFT JOIN files fi ON f.id = fi.folder_id
      WHERE f.id = $1
      GROUP BY f.id
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/folders/:id/files', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, size } = req.body;

    // Check if folder exists
    const folderCheck = await db.query('SELECT id FROM folders WHERE id = $1', [id]);
    if (folderCheck.rows.length === 0) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Validate body
    if (!req.body || !name || size === undefined) {
      return res.status(400).json({ error: "Request body must include name and size" });
    }

    // Insert file
    const result = await db.query(
      'INSERT INTO files (name, size, folder_id) VALUES ($1, $2, $3) RETURNING *',
      [name, size, id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

export default app;
