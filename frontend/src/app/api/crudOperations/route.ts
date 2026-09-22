import { createItem } from '../../../functions/mongodbOperations'; // Import createItem function
import { getAllItems } from '../../../functions/mongodbOperations'; // Import getAllItems function
import { deleteItemById } from '../../../functions/mongodbOperations'; // Import deleteItemById function
import { updateItemById } from '../../../functions/mongodbOperations'; // Import updateItemById function
import { getItemById } from '../../../functions/mongodbOperations'; // Import getItemById function


// Create Item (POST request)
export async function POST(req: any, res: any) {
  if (req.method === 'POST') {
    const { name, description } = req.body;
    try {
      const result = await createItem({ name, description, createdAt: new Date() });
      res.status(201).json({ message: 'Item created successfully', data: result });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Get All Items (GET request)
export async function GET(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const items = await getAllItems('');
      res.status(200).json({ items });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Get Item by ID (GET request)
export async function handler(req: any, res: any) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const item = await getItemById('items', 'productId', id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({ item });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Update Item by ID (PUT request)
export async function PUT(req: any, res: any) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, description } = req.body;
    try {
      const result = await updateItemById(id, { name, description });
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({ message: 'Item updated successfully', data: result });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Delete Item by ID (DELETE request)
export async function DELETE(req: any, res: any) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const result = await deleteItemById(id);
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}