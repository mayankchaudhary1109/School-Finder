import mysql from "mysql2/promise";



export async function query({ query, values = [] }) {
  const dbconnection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your actual MySQL username
    password: '**',  // Replace with your actual MySQL password
    database: 'school_db',  // Replace with your actual MySQL database name
    port: 3306,// Use the correct port (3306 is the default for MySQL)
  });
  try {
    const [results] = await dbconnection.execute(query, values);
    // dbconnection.end();
    return results;
  } catch (error) {
    console.log(error);
    throw Error(error.message);
    return { error };
  }
}
