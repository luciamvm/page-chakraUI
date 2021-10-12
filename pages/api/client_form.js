export default function handler (req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  res.status(200);
  const body = JSON.parse(req.body);
  console.log(body);
  res.end();
}