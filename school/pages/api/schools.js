import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const sqlQuery = 'Select * from school';
    const formData = req.body;
    const values = [];
    const data = await query({ query: sqlQuery, values: [values] });

    res.status(200).json({ products: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}